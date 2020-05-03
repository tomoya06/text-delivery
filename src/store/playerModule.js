import _ from 'lodash';
import Enum from 'enum';

const maxQueueLength = [1, 3, 5, 10, 20];
const expressSpeed = [100, 2, 5, 10, 20];
const durations = [2000, 30000, 50000, 100000, 500000];
const shares = [0.1, 0.2, 0.3, 0.4, 0.5];
const runningSpeed = [1, 0.1, 0.1, 0.1, 0.1];

const FINALIZE_DELAY = 1000;

export const playerState = new Enum([
  'free',
  'gettingPackage',
  'sendingPackage',
  'runOutEngine',
  'finishedPackage',
]);

export default {
  namespaced: true,
  state: () => ({
    earning: 10, // 收入
    warning: 0, // 罚单数量
    grade: 0, // 等级
    state: playerState.free,
    queue: [],
    activeIdx: -1,
    duration: durations[0],
    maxDuration: durations[0],
  }),
  mutations: {
    earn(state, value) {
      state.earning += value * shares[state.grade];
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
    startExpress(state, idx) {
      state.queue[idx].active = true;
      state.activeIdx = idx;
      state.state = playerState.gettingPackage;
    },
    updateState(state, newState) {
      state.state = newState;
    },
    deliverWithCar(state) {
      const nextStepSize = Math.min(
        expressSpeed[state.grade],
        state.queue[state.activeIdx].distance,
        state.duration,
      );
      state.queue[state.activeIdx].distance -= nextStepSize;
      state.duration -= nextStepSize;

      if (state.queue[state.activeIdx].distance <= 0) {
        // 送到了
        console.log('package arrived');
        state.queue[state.activeIdx].distance = 0;
        state.state = playerState.finishedPackage;
        // 更新包裹數據
        delete state.queue[state.activeIdx].active;
        state.queue[state.activeIdx].finished = true;
      } else if (state.duration <= 0) {
        // 車沒電了
        console.log('out of electric');
        state.duration = 0;
        state.state = playerState.runOutEngine;
      }
    },
    deliverOnFoot(state) {
      const nextStepSize = Math.min(
        runningSpeed[state.grade],
        state.queue[state.activeIdx].distance,
      );
      state.queue[state.activeIdx].distance -= nextStepSize;
      if (state.queue[state.activeIdx].distance <= 0) {
        // 送到了
        console.log('package arrived');
        state.queue[state.activeIdx].distance = 0;
        state.state = playerState.finishedPackage;
        // 更新包裹數據
        delete state.queue[state.activeIdx].active;
        state.queue[state.activeIdx].finished = true;
      }
    },
  },
  actions: {
    startExpress({ commit, state }, uuid) {
      return new Promise((resolve, reject) => {
        if (state.state !== playerState.free) {
          return reject(new Error('not free'));
        }
        const idx = _.findIndex(state.queue, { id: uuid });
        commit('startExpress', idx);
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
        commit('addExpressToQueue', thePackage);
        return resolve();
      });
    },
    startSendingPackage({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.state !== playerState.gettingPackage) {
          return reject(new Error('no package yet'));
        }
        commit('updateState', playerState.sendingPackage);
        return resolve();
      });
    },
    deliverPackage({ commit, getters, state }) {
      if (!getters.isSending) {
        return;
      }
      if (state.state === playerState.runOutEngine) {
        commit('deliverOnFoot');
      } else {
        commit('deliverWithCar');
      }
    },
    finalizePackage({ commit, state }, uuid) {
      const thePackage = _.find(state.queue, { id: uuid });
      if (thePackage.finished) {
        commit('earn', thePackage.value);

        setTimeout(() => {
          console.log('delete package');
          commit('removeExpress', uuid);
          commit('updateState', playerState.free);
        }, FINALIZE_DELAY);
      }
    },
  },
  getters: {
    grade: (state) => state.grade + 1,
    maxQueueContent: (state) => maxQueueLength[state.grade],
    isQueueFull: (state) => state.queue.length === maxQueueLength[state.grade],
    isSending: (state) => [
      playerState.sendingPackage,
      playerState.runOutEngine,
    ].includes(state.state),
  },
};
