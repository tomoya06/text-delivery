import _ from 'lodash';
import { v1 as uuidvn } from 'uuid';

import { pickFromArray, generateDistance } from '../util/random';

const maxQueueLengths = [5];

const packageData = require('../data/package');

export default {
  namespaced: true,
  state: () => ({
    queue: [],
    grade: 0,
    maxQueueLength: maxQueueLengths[0],
  }),
  mutations: {
    removeAll(state) {
      state.queue.splice(0);
    },
    generatePackage(state) {
      const uid = uuidvn();
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
        active: false,
        finished: false,
      };
      state.queue.push(newPackage);
    },
    pickPackage(state, uuid) {
      const idx = _.findIndex(state.queue, { id: uuid });
      state.queue.splice(idx, 1);
    },
  },
  actions: {
    updateQueues({ commit, getters }) {
      if (getters.isQueueFull) {
        commit('removeAll');
      }
      while (!getters.isQueueFull) {
        commit('generatePackage');
      }
    },
  },
  getters: {
    isQueueFull: (state) => state.queue.length === state.maxQueueLength,
    grade: (state) => state.grade + 1,
  },
};
