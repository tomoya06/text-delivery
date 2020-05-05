import { v1 as uuidvn } from 'uuid';

const MAX_MSG_LENGTH = 2;

const emptyMsg = () => ({
  id: uuidvn(),
  msg: '你還沒有消息',
});

const defaultMsgs = '0'.repeat(MAX_MSG_LENGTH).split('').map(() => emptyMsg());

export default {
  namespaced: true,
  state: () => ({
    msgs: defaultMsgs,
    flag: false,
  }),
  mutations: {
    sendMsg(state, msg) {
      const id = uuidvn();
      state.msgs.unshift({
        id,
        msg,
      });
      state.msgs.splice(MAX_MSG_LENGTH);
    },
    resetFlag(state) {
      state.flag = !state.flag;
    },
  },
  actions: {
    sendMsg({ commit }, msg) {
      commit('resetFlag');
      commit('sendMsg', msg);
    },
    sendNotAMsg({ commit }, msg) {
      commit('sendMsg', msg);
    },
  },
};
