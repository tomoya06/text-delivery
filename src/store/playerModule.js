import _ from 'lodash';
import { pickFromArray } from '../util/random';
import { playerState } from '../data/player';
import { allError } from '../data/error';
import { doYouNeedAPenalty } from '../util/penalty';

const shares = [0.1, 0.2, 0.3, 0.4, 0.5];

const stepSizes = [0.1];

const maxQueueLengths = [3, 3, 5, 10, 20];
const upgradeMaxQueueLengthPrices = [0, 10, 100, 200, 500];

const randomIncomeRates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.3, 0.5];

const penaltyRates = [0.01];
const penaltyStepSizes = [0.001];


export default {
  namespaced: true,
  state: () => ({
    share: shares[0],
    stepSize: stepSizes[0],
    totalFinished: 0,

    penaltyRate: penaltyRates[0],
    queue: [],
    qlGrade: 0,
    activeIdx: -1,
  }),
  mutations: {
    removePackage(state, uuid) {
      const idx = _.findIndex(state.queue, { id: uuid });
      state.queue.splice(idx, 1);
    },
    addExpressToQueue(state, express) {
      state.queue.push(express);
    },
    activatePackage(state, uuid) {
      const idx = _.findIndex(state.queue, { id: uuid });
      state.queue[idx].active = true;
      state.activeIdx = idx;
    },
    resolvePackageDistance(state, dis) {
      state.queue[state.activeIdx].distance -= dis;
      if (state.queue[state.activeIdx].distance <= 0) {
        // 送到了
        console.log('package arrived');
        state.queue[state.activeIdx].distance = 0;
        state.queue[state.activeIdx].active = false;
        state.queue[state.activeIdx].finished = true;
      }
    },
    addFinished(state) {
      state.totalFinished += 1;
    },
    resetActivePackage(state) {
      state.activeIdx = -1;
    },
    increasePenaltyRate(state, val) {
      state.penaltyRate += val;
    },
    resetPenaltyRate(state) {
      // eslint-disable-next-line prefer-destructuring
      state.penaltyRate = penaltyRates[0];
    },
  },
  actions: {
    startDeliver({ commit, rootState }, uuid) {
      return new Promise((resolve, reject) => {
        if (rootState.status !== playerState.free) {
          return reject(new Error(allError.player_notFree));
        }
        commit('activatePackage', uuid);
        commit('updateStatus', playerState.gettingPackage, { root: true });
        return resolve();
      });
    },
    pickPackageFromMarket({ commit, rootState, getters }, uuid) {
      return new Promise((resolve, reject) => {
        if (getters.isQueueFull) {
          return reject(new Error(allError.player_queueFull));
        }
        const thePackage = _.find(rootState.market.queue, { id: uuid });
        commit('market/pickPackage', uuid, { root: true });
        // FIXME: change to promise return
        commit('addExpressToQueue', thePackage);
        return resolve();
      });
    },
    startSendingPackage({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        if (rootState.status !== playerState.gettingPackage) {
          return reject(new Error(allError.player_noActive));
        }
        commit('updateStatus', playerState.startSendingPackage, { root: true });
        return resolve();
      });
    },
    deliverPackage({
      commit, state, dispatch, rootGetters, getters,
    }) {
      if (!rootGetters.isSending) {
        return;
      }
      const { remainingDistance } = getters;
      dispatch('car/driveYourCar', remainingDistance, { root: true })
        .then((dis) => {
          commit('updateStatus', playerState.sendingPackageOnCar, { root: true });
          commit('resolvePackageDistance', dis);
        })
        .catch(() => {
          commit('updateStatus', playerState.sendingPackageOnFoot, { root: true });
          return dispatch('runOnFoot', remainingDistance)
            .then((runDis) => {
              commit('resolvePackageDistance', runDis);
            });
        })
        .finally(() => {
          if (state.queue[state.activeIdx].distance <= 0) {
            commit('updateStatus', playerState.finishedPackage, { root: true });
            commit('resetActivePackage');
          }
        });
    },
    runOnFoot({ state }, dis) {
      return new Promise((resolve) => {
        const actualDis = Math.min(dis, state.stepSize);
        return resolve(actualDis);
      });
    },
    finalizePackage({ commit, state }, uuid) {
      return new Promise((resolve) => {
        const thePackage = _.find(state.queue, { id: uuid });
        if (thePackage.finished) {
          const thisIncome = thePackage.value * state.share;
          const randomIncome = pickFromArray(randomIncomeRates) * thePackage.value;
          let penaltyIncome = 0;
          const penalty = doYouNeedAPenalty(state.penaltyRate);
          if (penalty) {
            penaltyIncome = 0 - penalty.value;
          }

          commit('earn', thisIncome + randomIncome + penaltyIncome, { root: true });
          commit('addFinished');
          commit('resetPenaltyRate');

          return resolve({
            stock: thisIncome,
            bonus: randomIncome,
            penalty,
          });
        }
        return resolve({
          stock: 0,
          bonus: 0,
        });
      });
    },
    getFree({ commit }, uuid) {
      commit('updateStatus', playerState.free, { root: true });
      commit('removePackage', uuid);
    },
    increasePenaltyRate({ commit, rootState }) {
      if (rootState.status === playerState.sendingPackageOnCar) {
        const addRate = penaltyStepSizes[0] * (rootState.car.ssGrade + 1);
        commit('increasePenaltyRate', addRate);
      }
    },
  },
  getters: {
    grade: (state) => state.grade + 1,
    isQueueFull: (state) => state.queue.length === maxQueueLengths[state.qlGrade],
    remainingDistance: (state) => state.queue[state.activeIdx].distance,

    canUpgradeQl: (state) => state.qlGrade < maxQueueLengths.length - 1,
    curQl: (state) => maxQueueLengths[state.qlGrade],
    nextQl: (state) => maxQueueLengths[state.qlGrade + 1],
    upgradeQlcost: (state) => upgradeMaxQueueLengthPrices[state.qlGrade + 1],
  },
};
