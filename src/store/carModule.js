import { carState } from '../data/player';

const durations = [20000, 30000, 50000, 100000, 500000];
const stepSizes = [10, 15, 20, 35, 50];

export default {
  namespaced: true,
  state: () => ({
    grade: 0,
    state: carState.fine,
    stepSize: stepSizes[0],
    duration: durations[0],
    maxDuration: durations[0],
  }),
  mutations: {
    updateState(state, newState) {
      state.state = newState;
    },
    driveOneStep(state, dis) {
      state.duration -= dis;
      if (state.duration <= 0) {
        state.state = carState.outOfGas;
      }
    },
  },
  actions: {
    driveYourCar({ commit, state }, dis) {
      return new Promise((resolve, reject) => {
        if (state.state !== carState.fine) {
          return reject(new Error(state.state));
        }
        const actualDis = Math.min(dis, state.duration, state.stepSize);
        commit('driveOneStep', actualDis);
        return resolve(actualDis);
      });
    },
  },
};
