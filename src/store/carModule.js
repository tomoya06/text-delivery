import { carState } from '../data/player';

const durations = [20000, 30000, 50000, 100000, 500000];
const stepSizes = [1000, 15, 20, 35, 50];
const chargingSpeeds = [10, 20, 30, 50, 100];

export default {
  namespaced: true,
  state: () => ({
    grade: 0,
    status: carState.fine,
    stepSize: stepSizes[0],
    duration: durations[0],
    maxDuration: durations[0],
    chargingSpeed: chargingSpeeds[0],
  }),
  mutations: {
    updateState(state, newState) {
      state.status = newState;
    },
    driveOneStep(state, dis) {
      state.status = carState.driving;
      state.duration -= dis;
      if (state.duration <= 0) {
        state.status = carState.outOfGas;
      }
    },
    charging(state) {
      state.status = carState.charging;
      state.duration += Math.min(state.chargingSpeed, state.maxDuration - state.duration);
    },
    stopCharging(state) {
      state.status = carState.fine;
    },
    stopTheCar(state) {
      state.status = carState.fine;
    },
  },
  actions: {
    driveYourCar({ commit, state, getters }, dis) {
      return new Promise((resolve, reject) => {
        if (!getters.isFine) {
          return reject(new Error(state.status));
        }
        const actualDis = Math.min(dis, state.duration, state.stepSize);
        commit('driveOneStep', actualDis);
        return resolve(actualDis);
      });
    },
    chargeYourCar({ commit, state, getters }) {
      return new Promise((resolve, reject) => {
        if (!getters.canCharge) {
          return reject(new Error(state.status));
        }
        commit('charging');
        return resolve();
      });
    },
    stopCharging({ commit, getters, state }) {
      return new Promise((resolve, reject) => {
        if (!getters.isCharging) {
          return reject(state.status);
        }
        commit('stopCharging');
        return resolve();
      });
    },
    stopTheCar({ commit }) {
      commit('stopTheCar');
    },
  },
  getters: {
    grade: (state) => state.grade + 1,
    canCharge: (state) => [carState.fine, carState.charging].includes(state.status),
    isCharging: (state) => [carState.charging].includes(state.status),
    isFine: (state) => [carState.fine, carState.driving].includes(state.status),
  },
};
