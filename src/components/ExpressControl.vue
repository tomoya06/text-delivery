<template>
  <div>
    <div id="my-queue">
      <div id="info-container">
        <span>我的待送包裹：{{ myQueue.length }}/{{ maxQueueLength }}</span>
        <span>當前狀態：{{ myState }}</span>
        <span v-if="showSummary">{{ summary }}</span>
      </div>
      <ul>
        <li v-for="pkg in myQueue" :key="pkg.id">
          <button @click="() => handleActivatePackage(pkg)">
            <span v-if="!pkg.active">開始派送</span>
            <span v-else>加速！</span>
          </button>
          <span>
            <span v-if="pkg.active">正在派送</span>
            <span v-else-if="pkg.finished">已送達</span>
            <span v-else>待派送</span>
          </span>
          <span> ---- </span>
          <span>
            <span>{{ pkg.from }} -> {{ pkg.to }}: {{ pkg.good }} ({{ pkg.value }})</span>
            <span> -- {{ pkg.distance | rawDistanceFilter }}</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import _ from 'lodash';

const TimeUtil = require('../util/time');
const RandomUtil = require('../util/random');
const { playerState } = require('../data/player');

export default {
  data() {
    return {
      onTheRoadInterval: null,
      showSummary: false,
      summary: '',
    };
  },
  computed: {
    myState() {
      switch (this.curPlayerState) {
        case playerState.free:
          return '正在閑逛';
        case playerState.gettingPackage:
          return '正在前往賣家';
        case playerState.sendingPackageOnCar:
        case playerState.startSendingPackage:
          return '正在派送';
        case playerState.sendingPackageOnFoot:
          return '正在狂奔派送';
        case playerState.finishedPackage:
          return '正在清算';
        default:
          return '我也不知道你在幹嘛';
      }
    },
    ...mapState({
      curPlayerState: (state) => state.status,
    }),
    ...mapState(['timeSpeed']),
    ...mapState('player', {
      myQueue: (state) => state.queue,
      maxQueueLength: (state) => state.maxQueueLength,
    }),
  },
  watch: {
    curPlayerState(val, oldVal) {
      if (val === oldVal) return;
      if (val === playerState.finishedPackage) {
        console.log('finished express');
        const finishedPackage = _.find(this.myQueue, { finished: true });
        this.$store.dispatch('car/stopTheCar')
          .then(() => this.$store.dispatch('player/finalizePackage', finishedPackage.id))
          .then(({ stock, bonus }) => {
            this.summary = `本單進賬${stock.toFixed(1)}元`;
            this.summary += bonus > 0 ? `，獲得小費${bonus.toFixed(1)}元` : '';
            this.showSummary = true;
            return TimeUtil.delay(1000);
          }).then(() => {
            this.$store.dispatch('player/getFree', finishedPackage.id);
            this.showSummary = false;
            this.summary = '';
          });
      }
    },
  },
  methods: {
    handleActivatePackage(pkg) {
      if (pkg.active) {
        this.$store.dispatch('player/deliverPackage');
      } else if (!pkg.finished) {
        this.$store
          .dispatch('player/startDeliver', pkg.id)
          .then(() => TimeUtil.delay(RandomUtil.generateRandomTime()))
          .then(() => this.$store.dispatch('player/startSendingPackage'))
          .then(() => this.startSending())
          .catch(() => {
            this.sendMsg('不行。老闆説你不可以這樣派送');
          });
      }
    },
    startSending() {
      if (!this.$store.getters.isSending) {
        clearInterval(this.onTheRoadInterval);
      }
      this.onTheRoadInterval = setInterval(() => {
        this.triggerOneStep();
      }, this.timeSpeed);
    },
    triggerOneStep() {
      this.$store.dispatch('player/deliverPackage');
    },
  },
};
</script>
<style lang="less" scoped>
#my-queue {
  #info-container {
    span {
      padding: 0 1rem 0 0;
    }
  }
}
</style>
