<template>
  <div>
    <div id="hud-container">
      <span>電摩等级 {{ grade }}</span>
      <span>电摩状况：{{ status }}</span>
      <span>
        <button @click="handleCharging" v-if="!isCharging">
          <span>充電</span>
        </button>
        <button @click="handleTriggerCharging" v-if="isCharging">
          <span>充快點</span>
        </button>
        <button @click="handleDischarging" v-if="isCharging">
          <span>不充了</span>
        </button>
      </span>
    </div>
    <div>
      <span>
        <span>充電速度：{{ curCS }}</span>
        <button @click="handleUpgradeCharging" v-if="canUpgradeCS">
          <span>只需 {{ upgradeCScost | moneyFilter }} </span>
          <span>升級愛車充電速度</span>
          <span>至 {{ nextCS }}</span>
        </button>
      </span>
    </div>
    <div>
      <span>电池续航：{{ curDt | distanceFilter }}/{{ curDt | distanceFilter }}</span>
      <button @click="handleUpgradeDuration" v-if="canUpgradeDt">
        <span>不要{{upgradeDtcost * 1.5 | roundMoneyFilter}}，</span>
        <span>不要{{upgradeDtcost * 1.2 | roundMoneyFilter}}，</span>
        <span>只要{{upgradeDtcost | roundMoneyFilter}}，</span>
        <span>升級電池續航</span>
        <span>至{{nextDt | distanceFilter}}</span>
      </button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      chargingInterval: null,
    };
  },
  computed: {
    ...mapState(['timeSpeed']),
    ...mapState('car', ['status']),
    ...mapGetters('car', [
      'grade', 'isCharging', 'curCS', 'nextCS', 'upgradeCScost', 'canUpgradeCS',
      'curDt', 'canUpgradeDt', 'nextDt', 'upgradeDtcost',
    ]),
  },
  methods: {
    triggerCharging() {
      this.$store
        .dispatch('car/chargeYourCar')
        .then(() => {
          console.log('charge');
        })
        .catch((err) => {
          console.log('charge error', err);
        });
    },
    handleTriggerCharging() {
      this.triggerCharging();
      this.sendMsg('手動充電！！');
    },
    handleCharging() {
      this.sendMsg('開始充電！！');
      this.chargingInterval = setInterval(() => {
        this.triggerCharging();
      }, this.timeSpeed);
    },
    handleDischarging() {
      clearInterval(this.chargingInterval);
      this.$store.dispatch('car/stopCharging').catch(() => {});
    },
    handleUpgradeCharging() {
      this.$store
        .dispatch('car/upgradeChargingSpeed')
        .then((newSpeed) => {
          this.sendMsg(`電摩速度升級至${newSpeed}`);
        })
        .catch((error) => {
          this.sendMsg(error.message);
        });
    },
    handleUpgradeDuration() {
      this.$store.dispatch('car/upgradeDuration')
        .then((newDuration) => {
          this.sendMsg(`電摩續航升級至${this.$options.filters.distanceFilter(newDuration)}`);
        })
        .catch((error) => {
          this.sendMsg(error.message);
        });
    },
  },
};
</script>
<style lang="less" scoped>
#hud-container {
  span {
    padding: 0 1rem 0 0;
  }
}
</style>
