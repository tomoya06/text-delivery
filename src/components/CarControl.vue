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
        <button @click="handleDischarging" v-else>
          <span>不充了</span>
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
    ...mapGetters('car', ['grade', 'isCharging']),
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
    handleCharging() {
      this.chargingInterval = setInterval(() => {
        this.$store.dispatch('car/chargeYourCar')
          .then(() => {
            console.log('charge');
          }).catch((err) => {
            console.log('charge error', err);
          });
      }, this.timeSpeed);
    },
    handleDischarging() {
      clearInterval(this.chargingInterval);
      this.$store.dispatch('car/stopCharging').catch(() => {});
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
