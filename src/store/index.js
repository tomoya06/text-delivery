import Vue from 'vue';
import Vuex from 'vuex';

import playerModule from './playerModule';
import expressMarketModule from './expressMarketModule';

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
  },
});
