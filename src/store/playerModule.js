import _ from 'lodash';
import { pickFromArray } from '../util/random';
import { playerState } from '../data/player';

const maxQueueLengths = [1, 3, 5, 10, 20];
// const upgradeMaxQueueLengthPrices = [0, 10, 100, 200, 500];
const shares = [0.1, 0.2, 0.3, 0.4, 0.5];
const stepSizes = [1000, 0.1, 0.1, 0.1, 0.1];

const randomIncomeRates = [0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.3, 0.5];


export default {
  namespaced: true,
  state: () => ({
    share: shares[0],
    stepSize: stepSizes[0],
    queue: [],
    maxQueueLength: maxQueueLengths[0],
    activeIdx: -1,
  }),
  mutations: {
    removeExpress(state, uuid) {
      const idx = _.findIndex(state.queue, { id: uuid });
      state.queue.splice(idx, 1);
    },
    addExpressToQueue(state, express) {
      state.queue.push(express);
    },
    activatePackage(state, idx) {
      state.queue[idx].active = true;
      state.activeIdx = idx;
    },
    resolvePackageDistance(state, dis) {
      state.queue[state.activeIdx].distance -= dis;
      if (state.queue[state.activeIdx].distance <= 0) {
        // 送到了
        console.log('package arrived');
        state.queue[state.activeIdx].distance = 0;
        delete state.queue[state.activeIdx].active;
        state.queue[state.activeIdx].finished = true;
      }
    },
  },
  actions: {
    startDeliver({ commit, state, rootState }, uuid) {
      return new Promise((resolve, reject) => {
        if (rootState.status !== playerState.free) {
          return reject(new Error('not free'));
        }
        const idx = _.findIndex(state.queue, { id: uuid });
        commit('activatePackage', idx);
        commit('updateStatus', playerState.gettingPackage, { root: true });
        return resolve();
      });
    },
    pickPackageFromMarket({ commit, rootState, getters }, uuid) {
      return new Promise((resolve, reject) => {
        if (getters.isQueueFull) {
          return reject(new Error('full'));
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
          return reject(new Error('no package yet'));
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

          commit('earn', thisIncome + randomIncome, { root: true });

          return resolve({
            stock: thisIncome,
            bonus: randomIncome,
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
      commit('removeExpress', uuid);
    },
  },
  getters: {
    grade: (state) => state.grade + 1,
    maxQueueContent: (state) => maxQueueLengths[state.grade],
    isQueueFull: (state) => state.queue.length === state.maxQueueLength,
    remainingDistance: (state) => state.queue[state.activeIdx].distance,
  },
};
