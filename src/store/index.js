import Vue from 'vue';
import Vuex from 'vuex';

import playerModule from './playerModule';
import expressMarketModule from './expressMarketModule';
import carModule from './carModule';

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    player: playerModule,
    market: expressMarketModule,
    car: carModule,
  },
});
