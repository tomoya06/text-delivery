import _ from 'lodash';
import Enum from 'enum';

const maxQueueLength = [1, 3, 5, 10, 20];
const expressSpeed = [0.1, 0.2, 0.5, 1, 2];
const durations = [1000, 1500, 2000, 3000, 5000];

const playerState = new Enum(['free', 'gettingPackage', 'sendingPackage', 'finishedPackage']);


export default {
  namespaced: true,
  state: () => ({
    earning: 10, // 收入
    warning: 0, // 罚单数量
    grade: 0, // 等级
    state: playerState.free,
    queue: [],
    underExpress: null,
    duration: 1000,
  }),
  mutations: {
    earn(state, n) {
      state.earning += n;
    },
    penalty(state, n) {
      state.earning -= n;
      state.warning += 1;
    },
    startExpress(state, idx) {
      const express = state.queue.splice(idx, 1)[0];
      state.underExpress = express;
    },
    addExpressProgress(state) {
      if (state.underExpress === null) {
        return;
      }
      state.underExpress.distance -= expressSpeed[state.grade];
      if (state.underExpress.distance <= 0) {
        state.underExpress.distance = 0;
        state.duration -= expressSpeed[state.grade];
        // TODO: finish express
      }
    },
    addExpressToQueue(state, express) {
      state.queue.push(express);
    },
  },
  actions: {
    startExpress({ commit, state }, idx) {
      if (state.queue.length <= idx || idx < 0) {
        return;
      }
      commit('startExpress', idx);
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
  },
  getters: {
    grade: (state) => state.grade + 1,
    duration: (state) => Math.floor(state.duration / durations[state.grade]) * 100,
    isQueueFull: (state) => state.queue.length === maxQueueLength[state.grade],
  },
};
