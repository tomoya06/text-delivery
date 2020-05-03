import _ from 'lodash';
import Enum from 'enum';
import { pickFromArray } from '../util/random';

const maxQueueLength = [1, 3, 5, 10, 20];
const shares = [0.1, 0.2, 0.3, 0.4, 0.5];
const stepSizes = [1000, 0.1, 0.1, 0.1, 0.1];

const randomIncomeRates = [0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.3, 0.5];

export const playerState = new Enum([
  'free',
  'gettingPackage',
  'startSendingPackage',
  'sendingPackageOnCar',
  'sendingPackageOnFoot',
  'finishedPackage',
]);

export default {
  namespaced: true,
  state: () => ({
    earning: 10, // 收入
    warning: 0, // 罚单数量
    grade: 0, // 等级
    share: shares[0],
    state: playerState.free,
    stepSize: stepSizes[0],
    queue: [],
    activeIdx: -1,
  }),
  mutations: {
    earn(state, value) {
      state.earning += value;
    },
    removeExpress(state, uuid) {
      const idx = _.findIndex(state.queue, { id: uuid });
      state.queue.splice(idx, 1);
    },
    addExpressToQueue(state, express) {
      state.queue.push(express);
    },
    penalty(state, n) {
      state.earning -= n;
      state.warning += 1;
    },
    activatePackage(state, idx) {
      state.queue[idx].active = true;
      state.activeIdx = idx;
    },
    updateState(state, newState) {
      state.state = newState;
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
    startDeliver({ commit, state }, uuid) {
      return new Promise((resolve, reject) => {
        if (state.state !== playerState.free) {
          return reject(new Error('not free'));
        }
        const idx = _.findIndex(state.queue, { id: uuid });
        commit('activatePackage', idx);
        commit('updateState', playerState.gettingPackage);
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
    startSendingPackage({ state, commit }) {
      return new Promise((resolve, reject) => {
        if (state.state !== playerState.gettingPackage) {
          return reject(new Error('no package yet'));
        }
        commit('updateState', playerState.startSendingPackage);
        return resolve();
      });
    },
    deliverPackage({
      commit, getters, state, dispatch,
    }) {
      if (!getters.isSending) {
        return;
      }
      const remainingDistance = state.queue[state.activeIdx].distance;
      dispatch('car/driveYourCar', remainingDistance, { root: true })
        .then((dis) => {
          commit('updateState', playerState.sendingPackageOnCar);
          commit('resolvePackageDistance', dis);
        })
        .catch(() => {
          commit('updateState', playerState.sendingPackageOnFoot);
          return dispatch('runOnFoot', remainingDistance)
            .then((runDis) => {
              commit('resolvePackageDistance', runDis);
            });
        })
        .finally(() => {
          if (state.queue[state.activeIdx].distance <= 0) {
            commit('updateState', playerState.finishedPackage);
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

          commit('earn', thisIncome + randomIncome);

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
      commit('updateState', playerState.free);
      commit('removeExpress', uuid);
    },
  },
  getters: {
    grade: (state) => state.grade + 1,
    maxQueueContent: (state) => maxQueueLength[state.grade],
    isQueueFull: (state) => state.queue.length === maxQueueLength[state.grade],
    isSending: (state) => [
      playerState.startSendingPackage,
      playerState.sendingPackageOnCar,
      playerState.sendingPackageOnFoot,
    ].includes(state.state),
  },
};
