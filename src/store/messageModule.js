import { v4 as uuidv4 } from 'uuid';

const MAX_MSG_LENGTH = 5;
const MSG_TIME = 3000;

const emptyMsg = () => ({
  id: uuidv4(),
  msg: '你還沒有消息',
});

const defaultMsgs = '0'.repeat(MAX_MSG_LENGTH).split('').map(() => emptyMsg());

export default {
  namespaced: true,
  state: () => ({
    msgs: defaultMsgs,
  }),
  mutations: {
    sendMsg(state, msg) {
      const id = uuidv4();
      state.msgs.unshift({
        id,
        msg,
      });
      state.msgs.splice(MAX_MSG_LENGTH);
    },
    emptyMsg() {
    },
  },
  actions: {
    sendMsg({ commit }, msg) {
      commit('sendMsg', msg);
      setTimeout(() => {
        commit('emptyMsg');
      }, MSG_TIME);
    },
  },
};
