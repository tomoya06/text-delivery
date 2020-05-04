import { carState } from '../data/player';

import { allError } from '../data/error';

const durations = [20000, 30000, 50000, 100000, 500000];
const upgradeDurationPrices = [0, 500, 800, 1200, 2000];

const stepSizes = [10, 15, 20, 35, 50];
const upgradeStepSizePrices = [0, 300, 500, 1000, 1200];

const chargingSpeeds = [10, 20, 30, 50, 100];
const upgradeChargingSpeedPrices = [0, 10, 20, 500, 1000];

export default {
  namespaced: true,
  state: () => ({
    grade: 0,
    status: carState.fine,
    duration: durations[0],
    mileage: 0,

    csGrade: 0,
    dtGrade: 0,
    ssGrade: 0,
  }),
  mutations: {
    updateState(state, newState) {
      state.status = newState;
    },
    driveOneStep(state, dis) {
      state.status = carState.driving;
      state.duration -= dis;
      state.mileage += dis;
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
    upgradeStepSize(state) {
      state.ssGrade = Math.min(state.ssGrade + 1, stepSizes.length - 1);
    },
  },
  actions: {
    driveYourCar({ commit, state, getters }, dis) {
      return new Promise((resolve, reject) => {
        if (!getters.isFine) {
          return reject(new Error(state.status));
        }
        const actualDis = Math.min(dis, state.duration, getters.curSS);
        commit('driveOneStep', actualDis);
        return resolve(actualDis);
      });
    },
    stopTheCar({ commit }) {
      commit('stopTheCar');
    },
    chargeYourCar({ commit, state, getters }) {
      return new Promise((resolve, reject) => {
        if (!getters.canCharge) {
          return reject(new Error(state.status));
        }
        const val = Math.min(getters.curCS, getters.curDT - state.duration);
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
        const upgradeCost = getters.upgradeDTcost;
        const newDuration = getters.nextDT;
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
    upgradeStepSize({ commit, dispatch, getters }) {
      return new Promise((resolve, reject) => {
        const upgradeCost = getters.upgradeSScost;
        const newStepSize = getters.nextSS;
        if (!upgradeCost || !newStepSize) {
          return reject(new Error(allError.car_cantUpgrade));
        }
        return dispatch('spendMoney', upgradeCost, { root: true })
          .then(() => {
            commit('upgradeStepSize');
            return resolve(newStepSize);
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

    canUpgradeDT: (state) => state.dtGrade < durations.length - 1,
    curDT: (state) => durations[state.dtGrade],
    nextDT: (state) => durations[state.dtGrade + 1],
    upgradeDTcost: (state) => upgradeDurationPrices[state.dtGrade + 1],

    canUpgradeSS: (state) => state.ssGrade < stepSizes.length - 1,
    curSS: (state) => stepSizes[state.ssGrade],
    nextSS: (state) => stepSizes[state.ssGrade + 1],
    upgradeSScost: (state) => upgradeStepSizePrices[state.ssGrade + 1],
  },
};
