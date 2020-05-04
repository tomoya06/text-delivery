<template>
  <div class="block-container">
    <div>
      <b>配送概況</b>
      <hr />
    </div>
    <div class="info-container">
      <span>總共配送：{{ totalFinished }}</span>
    </div>
    <div class="info-container">
      <span>我的待送包裹：{{ queue.length }}/{{ curQl }}</span>
      <span v-if="showSummary">{{ summary }}</span>
    </div>
    <div class="info-container">
      <span>當前狀態：{{ status }}</span>
    </div>
    <ul class="densed">
      <li v-for="pkg in queue" :key="pkg.id" class="expanded queue-item">
        <span>
          <button @click="() => handleActivatePackage(pkg)" v-if="!pkg.finished">
            <span v-if="!pkg.active">開始派送</span>
            <span v-else>加速！</span>
          </button>
        </span>
        <span class="queue-item-content">
          <span class="status">
            <span v-if="pkg.active">正在派送</span>
            <span v-else-if="pkg.finished">已送達</span>
            <span v-else>待派送</span>
          </span>
          <span>距離{{ pkg.distance | rawDistanceFilter }}</span>
          <span>{{ pkg.from }} ➡ {{ pkg.to }}: {{ pkg.good }}</span>
          <span>{{ pkg.value | moneyFilter }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import _ from 'lodash';

const TimeUtil = require('../util/time');
const RandomUtil = require('../util/random');
const { playerState } = require('../data/player');

const FINALIZE_DELAY = 2000;

export default {
  data() {
    return {
      onTheRoadInterval: null,
      showSummary: false,
      summary: '',
    };
  },
  computed: {
    ...mapState(['timeSpeed', 'status']),
    ...mapState('player', ['queue', 'totalFinished']),
    ...mapGetters('player', ['curQl']),
  },
  watch: {
    status(val, oldVal) {
      if (val === oldVal) return;
      if (val === playerState.finishedPackage) {
        console.log('finished express');
        const finishedPackage = _.find(this.queue, { finished: true });
        this.$store
          .dispatch('car/stopTheCar')
          .then(() => this.$store.dispatch('player/finalizePackage', finishedPackage.id))
          .then(({ stock, bonus }) => {
            this.summary = `本單進賬${stock.toFixed(1)}元`;
            this.summary += bonus > 0 ? `，獲得小費${bonus.toFixed(1)}元` : '';
            this.showSummary = true;
            return TimeUtil.delay(FINALIZE_DELAY);
          })
          .then(() => {
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
          .catch((error) => {
            this.sendMsg(error.message);
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
.queue-item {
  .queue-item-content {
    span {
      display: inline-block;
      margin: 0 0 0 0.4rem;
    }
  }
}
</style>
