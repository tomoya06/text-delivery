import Vue from 'vue';
import Vuex from 'vuex';

import { playerState } from '../data/player';
import { allError } from '../data/error';

import playerModule from './playerModule';
import expressMarketModule from './expressMarketModule';
import carModule from './carModule';
import messageModule from './messageModule';

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    earning: 10, // 收入
    grade: 0, // 等级
    warning: 0, // 罚单数量
    status: playerState.free,
    timeSpeed: 100,
  },
  mutations: {
    updateStatus(state, newState) {
      state.status = newState;
    },
    earn(state, value) {
      state.earning += value;
    },
    spend(state, value) {
      state.earning -= value;
    },
  },
  actions: {
    isEarningEnough({ state }, val) {
      return new Promise((resolve) => resolve(val <= state.earning));
    },
    spendMoney({ state, commit }, val) {
      return new Promise((resolve, reject) => {
        if (val > state.earning) {
          return reject(allError.notEnoughMoney);
        }
        commit('spend', val);
        return resolve();
      });
    },
  },
  getters: {
    isSending: (state) => [
      playerState.startSendingPackage,
      playerState.sendingPackageOnCar,
      playerState.sendingPackageOnFoot,
    ].includes(state.status),
    grade: (state) => state.grade + 1,
  },
  modules: {
    player: playerModule,
    market: expressMarketModule,
    car: carModule,
    msg: messageModule,
  },
});
