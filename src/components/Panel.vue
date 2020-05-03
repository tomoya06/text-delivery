<template>
  <div>
    <div id="my-queue">
      <div id="info-container">
        <span>我的待送包裹：{{ myQueue.length }}/{{ maxQueueContent }}</span>
        <span>當前狀態：{{ myState }}</span>
        <span v-if="showSummary">{{ summary }}</span>
      </div>
      <ul>
        <li v-for="pkg in myQueue" :key="pkg.id">
          <button @click="() => handleActivatePackage(pkg)">
            <span v-if="pkg.active">正在派送 --- </span>
            <span v-if="pkg.finished">已送達 --- </span>
            <span>{{ pkg.from }} -> {{ pkg.to }}: {{ pkg.good }} ({{ pkg.value }})</span>
            <span> -- {{ pkg.distance | distanceFilter }}m</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import _ from 'lodash';

const TimeUtil = require('../util/time');
const RandomUtil = require('../util/random');
const { playerState } = require('../store/playerModule');

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
    ...mapState('player', {
      myQueue: (state) => state.queue,
      curPlayerState: (state) => state.state,
    }),
    ...mapGetters('player', ['maxQueueContent']),
  },
  watch: {
    curPlayerState(val, oldVal) {
      if (val === oldVal) return;
      if (val === playerState.finishedPackage) {
        console.log('finished express');
        const finishedPackage = _.find(this.myQueue, { finished: true });
        this.$store.dispatch('player/finalizePackage', finishedPackage.id)
          .then(({ stock, bonus }) => {
            this.summary = `本單進賬${stock}元`;
            this.summary += bonus > 0 ? `，獲得小費${bonus}元` : '';
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
      } else {
        this.$store
          .dispatch('player/startDeliver', pkg.id)
          .then(() => TimeUtil.delay(RandomUtil.generateRandomTime()))
          .then(() => this.$store.dispatch('player/startSendingPackage'))
          .then(() => this.startSending())
          .catch((error) => {
            console.log('oops', error);
          });
      }
    },
    startSending() {
      if (!this.$store.getters['player/isSending']) {
        clearInterval(this.onTheRoadInterval);
      }
      this.onTheRoadInterval = setInterval(() => {
        this.triggerOneStep();
      }, 100);
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
