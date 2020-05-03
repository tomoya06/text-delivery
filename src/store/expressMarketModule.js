import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { pickFromArray, generateDistance } from '../util/random';

const maxQueueLength = [10, 15, 20, 30, 50];

const packageData = require('../data/package');

export default {
  namespaced: true,
  state: () => ({
    queue: [],
    grade: 0,
  }),
  mutations: {
    generatePackage(state) {
      const uid = uuidv4();
      const curRcvName = pickFromArray(packageData.rcvNames);
      const curProvider = pickFromArray(packageData.serviceProviders);
      const curService = pickFromArray(curProvider.services);
      const curPrice = pickFromArray(curService.price);
      const curDis = generateDistance();

      const newPackage = {
        id: uid,
        from: curProvider.name,
        to: curRcvName,
        good: curService.name,
        value: curPrice,
        distance: curDis,
      };
      state.queue.push(newPackage);
    },
    pickPackage(state, uuid) {
      const idx = _.findIndex(state.queue, { id: uuid });
      state.queue.splice(idx, 1);
    },
  },
  actions: {
    generatePackage({ commit, getters }) {
      if (getters.isQueueFull) {
        return;
      }
      commit('generatePackage');
    },
  },
  getters: {
    isQueueFull: (state) => state.queue.length === maxQueueLength[state.grade],
  },
};
