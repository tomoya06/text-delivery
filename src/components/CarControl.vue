<template>
  <div>
    <div id="hud-container">
      <span>電摩等级 {{ grade }}</span>
      <span>电池续航：{{ duration | distanceFilter }}/{{ maxDuration | distanceFilter }}</span>
      <span>电摩状况：{{ carStatus }}</span>
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
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import { carState } from '../data/player';

export default {
  data() {
    return {
      chargingInterval: null,
    };
  },
  computed: {
    ...mapState(['timeSpeed']),
    ...mapState('car', ['duration', 'maxDuration', 'status']),
    ...mapGetters('car', ['grade', 'isCharging', 'curCS', 'nextCS', 'upgradeCScost', 'canUpgradeCS']),
    carStatus() {
      switch (this.status) {
        case carState.fine:
          return '良好';
        case carState.outOfGas:
          return '沒電了';
        case carState.broken:
          return '壞掉了';
        case carState.charging:
          return '充電中';
        case carState.driving:
          return '在開著';
        default:
          return '不知道咋回事兒';
      }
    },
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
          console.log(`upgrade charging speed to ${newSpeed}`);
        })
        .catch((error) => {
          console.log(`upgrade error ${error}`);
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
