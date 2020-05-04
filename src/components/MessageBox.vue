<template>
  <div class="msgbox-container">
    <ul class="densed">
      <li v-for="msgItem in msgs" :key="msgItem.id">
        <span>{{ msgItem.msg }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { pickFromArray } from '../util/random';

const tips = require('../data/tips.json');

const EMPTY_INTERVAL_DURATION = 1000;
const EMPTY_MAX_COUNTER = 5;

export default {
  data() {
    return {
      emptyInterval: null,
      counter: EMPTY_MAX_COUNTER,
    };
  },
  created() {
    this.emptyInterval = setInterval(() => {
      this.emptyMsgTask();
    }, EMPTY_INTERVAL_DURATION);
  },
  methods: {
    emptyMsgTask() {
      this.counter -= 1;
      if (this.counter === 0) {
        this.updateEmptyMsg();
        this.counter = EMPTY_MAX_COUNTER;
      }
    },
    updateEmptyMsg() {
      const newMsg = pickFromArray(tips);
      this.$store.dispatch('msg/sendMsg', newMsg);
    },
  },
  computed: {
    ...mapState('msg', ['msgs', 'flag']),
  },
  watch: {
    flag(val, oldVal) {
      if (val === oldVal) return;
      this.counter = EMPTY_MAX_COUNTER;
    },
  },
};
</script>
<style lang="less" scoped>
.msgbox-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2rem;
  border: 1px solid black;
  overflow: hidden;
  background: black;
  color: white;

  ul {
    margin: 0;

    li {
      line-height: 2rem;
    }
  }

}
</style>
