<template>
  <div class="block-container">
    <div>
      <b>電摩概況</b>
      <hr />
    </div>
    <table class="info-container">
      <tr>
        <td width="200"></td>
        <td></td>
      </tr>
      <tr>
        <td>
          <span>电摩状况：{{ status }}</span>
        </td>
        <td>
          <span>縂里程數：{{ mileage | distanceFilter }}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span>最高車速：{{ curSS }}</span>
        </td>
        <td>
          <span>充電速度：{{ curCS }}</span>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <span>电池续航：{{ duration | distanceFilter }}/{{ curDT | distanceFilter }}</span>
          <span style="margin: 0 0 0 1rem">
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
        </td>
      </tr>
    </table>
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
    ...mapState('car', ['status', 'mileage', 'duration']),
    ...mapGetters('car', ['grade', 'isCharging', 'curDT', 'curCS', 'curSS']),
  },
  methods: {
    triggerCharging() {
      return this.$store.dispatch('car/chargeYourCar');
    },
    handleTriggerCharging() {
      this.triggerCharging()
        .then(() => {
          this.sendMsg('用愛發電！！');
        })
        .catch((error) => {
          this.sendMsg(`危險！${error.message}`);
          this.handleDischarging();
        });
    },
    handleCharging() {
      this.triggerCharging()
        .then(() => {
          this.sendMsg('開始充電！！');
          this.chargingInterval = setInterval(() => {
            this.triggerCharging();
          }, this.timeSpeed);
        })
        .catch((error) => {
          this.sendMsg(`危險！${error.message}`);
          this.handleDischarging();
        });
    },
    handleDischarging() {
      clearInterval(this.chargingInterval);
      this.sendMsg('停止充電');
      this.$store.dispatch('car/stopCharging').catch(() => {});
    },
  },
};
</script>
