<template>
  <div class="block-container">
    <div>
      <b>配送概況</b>
      <hr />
    </div>
    <div class="info-container">
      <span>當前狀態：{{ status }}</span>
      <span>我的待送包裹：{{ queue.length }}/{{ curQL }}</span>
      <!-- <span>penalty rate: {{ penaltyRate }}</span> -->
    </div>
    <div class="fieldset-container" v-if="showSummary">
      <fieldset>
        <legend>派送完成</legend>
        <div v-html="summary"></div>
      </fieldset>
    </div>
    <ul class="densed">
      <li v-for="pkg in queue" :key="pkg.id" class="expanded queue-item">
        <span class="queue-item-content">
          <span class="status">
            <span v-if="pkg.active">正在派送</span>
            <span v-else-if="pkg.finished">已送達</span>
            <span v-else>待派送</span>
          </span>
          <span class="value">{{ pkg.value | moneyFilter }}</span>
          <span class="distance">{{ pkg.distance | distanceFilter }}</span>
          <br />
          <span class="from">{{ pkg.from }}</span>
          <span>派送給</span>
          <span class="to">{{ pkg.to }}：</span>
          <br />
          <span class="good">{{ pkg.good }}</span>
        </span>
        <span class="action-button" v-if="!pkg.finished">
          <button @click="() => handleActivatePackage(pkg)" v-if="!pkg.active">
            <span>開始派送</span>
          </button>
          <button @click="handleSpeedUpPackage" v-else>
            <span>加速！</span>
          </button>
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

const FINALIZE_DELAY = 3000;

export default {
  data() {
    return {
      onTheRoadInterval: null,
      showSummary: false,
      showSummaryTimeout: null,
      summary: '',
    };
  },
  computed: {
    ...mapState(['timeSpeed', 'status']),
    ...mapState('player', ['queue', 'penaltyRate']),
    ...mapGetters('player', ['curQL']),
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
          .then(({ cp }) => {
            const { stock, bonus, penalty } = cp;
            clearTimeout(this.showSummaryTimeout);

            this.summary = `<span>本單進賬+${this.$options.filters.moneyFilter(
              stock.value,
            )}。</span><br>`;
            this.summary
              += bonus.value > 0
                ? `<span>小費+${this.$options.filters.moneyFilter(bonus.value)}。</span><br>`
                : '';
            this.summary
              += penalty && penalty.value
                ? `<b>罰款${this.$options.filters.moneyFilter(penalty.value)}(${
                  penalty.name
                })。</b>`
                : '';
            this.showSummary = true;
            this.$store.dispatch('player/getFree', finishedPackage.id);

            this.showSummaryTimeout = setTimeout(() => {
              this.showSummary = false;
              this.summary = '';
            }, FINALIZE_DELAY);
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
    handleSpeedUpPackage() {
      this.triggerOneStep();
      this.$store.dispatch('player/increasePenaltyRate');
    },
  },
};
</script>
