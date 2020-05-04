import { carState } from '../data/player';

import { allError } from '../data/error';

const durations = [20000, 30000, 50000, 100000, 500000];
const upgradeDurationPrices = [0, 500, 800, 1200, 2000];

const stepSizes = [1000, 15, 20, 35, 50];

const chargingSpeeds = [10, 20, 30, 50, 100];
const upgradeChargingSpeedPrices = [0, 10, 20, 500, 1000];

export default {
  namespaced: true,
  state: () => ({
    grade: 0,
    status: carState.fine,
    stepSize: stepSizes[0],
    duration: durations[0],
    csGrade: 0,
    dtGrade: 0,
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
    charging(state, val) {
      state.status = carState.charging;
      state.duration += val;
    },
    stopCharging(state) {
      state.status = carState.fine;
    },
    stopTheCar(state) {
      state.status = carState.fine;
    },
    upgradeChargingSpeed(state) {
      state.csGrade = Math.min(state.csGrade + 1, chargingSpeeds.length - 1);
    },
    upgradeDuration(state) {
      state.dtGrade = Math.min(state.dtGrade + 1, durations.length - 1);
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
        const val = Math.min(chargingSpeeds[state.csGrade], state.maxDuration - state.duration);
        commit('charging', val);
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
    upgradeChargingSpeed({ commit, dispatch, state }) {
      return new Promise((resolve, reject) => {
        const curIdx = state.csGrade;
        const upgradeCost = upgradeChargingSpeedPrices[curIdx + 1];
        const newSpeed = chargingSpeeds[curIdx + 1];
        if (!upgradeCost || !newSpeed) {
          return reject(new Error(allError.car_cantUpgrade));
        }
        return dispatch('spendMoney', upgradeCost, { root: true })
          .then(() => {
            commit('upgradeChargingSpeed');
            return resolve(newSpeed);
          })
          .catch((error) => reject(error));
      });
    },
    upgradeDuration({ commit, dispatch, getters }) {
      return new Promise((resolve, reject) => {
        const upgradeCost = getters.upgradeDtcost;
        const newDuration = getters.nextDt;
        if (!upgradeCost || !newDuration) {
          return reject(new Error(allError.car_cantUpgrade));
        }
        return dispatch('spendMoney', upgradeCost, { root: true })
          .then(() => {
            commit('upgradeDuration');
            return resolve(newDuration);
          })
          .catch((error) => reject(error));
      });
    },
  },
  getters: {
    grade: (state) => state.grade + 1,
    canCharge: (state) => [
      carState.fine,
      carState.charging,
      carState.outOfGas].includes(state.status),
    isCharging: (state) => [carState.charging].includes(state.status),
    isFine: (state) => [carState.fine, carState.driving].includes(state.status),

    canUpgradeCS: (state) => state.csGrade < chargingSpeeds.length - 1,
    curCS: (state) => chargingSpeeds[state.csGrade],
    nextCS: (state) => chargingSpeeds[state.csGrade + 1],
    upgradeCScost: (state) => upgradeChargingSpeedPrices[state.csGrade + 1],

    canUpgradeDt: (state) => state.dtGrade < durations.length - 1,
    curDt: (state) => durations[state.dtGrade],
    nextDt: (state) => durations[state.dtGrade + 1],
    upgradeDtcost: (state) => upgradeDurationPrices[state.dtGrade + 1],
  },
};
