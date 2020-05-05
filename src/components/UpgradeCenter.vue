<template>
  <div>
    <div class="fieldset-container">
      <fieldset>
        <legend>愛車升級區</legend>
        <div>
          <button @click="handleUpgradeCharging" v-if="canUpgradeCS" class="larger-button">
            <span>只需{{ upgradeCScost | moneyFilter }}，</span>
            <br />
            <span>升級愛車充電速度</span>
            <span>至{{ nextCS }}</span>
          </button>
          <button @click="handleUpgradeDuration" v-if="canUpgradeDT" class="larger-button">
            <span>不要{{ (upgradeDTcost * 1.5) | roundMoneyFilter }}，</span>
            <span>也不要{{ (upgradeDTcost * 1.2) | roundMoneyFilter }}，</span>
            <span>只要{{ upgradeDTcost | roundMoneyFilter }}，</span>
            <br />
            <span>升級電池續航</span>
            <span>至{{ nextDT | distanceFilter }}</span>
          </button>
          <button @click="handleUpgradeStepSize" v-if="canUpgradeSS" class="larger-button">
            <span>{{ upgradeSScost | roundMoneyFilter }}，快來爆改愛車</span>
            <br />
            <span>車速飆升至{{ nextSS }}</span>
          </button>
        </div>
      </fieldset>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('car', [
      'curCS',
      'nextCS',
      'upgradeCScost',
      'canUpgradeCS',
      'curDT',
      'canUpgradeDT',
      'nextDT',
      'upgradeDTcost',
      'canUpgradeSS',
      'curSS',
      'nextSS',
      'upgradeSScost',
    ]),
  },
  methods: {
    handleUpgradeCharging() {
      this.$store
        .dispatch('car/upgradeChargingSpeed')
        .then((newChargingSpeed) => {
          this.sendMsg(`電摩充電速度升級至${newChargingSpeed}`);
        })
        .catch((error) => {
          this.sendMsg(error);
        });
    },
    handleUpgradeDuration() {
      this.$store
        .dispatch('car/upgradeDuration')
        .then((newDuration) => {
          this.sendMsg(`電摩續航升級至${this.$options.filters.distanceFilter(newDuration)}`);
        })
        .catch((error) => {
          this.sendMsg(error);
        });
    },
    handleUpgradeStepSize() {
      this.$store
        .dispatch('car/upgradeStepSize')
        .then((newSpeed) => {
          this.sendMsg(`電摩速度升級至${newSpeed}`);
        })
        .catch((error) => {
          this.sendMsg(error);
        });
    },
  },
};
</script>
<style lang="less">
.larger-button {
  line-height: 1rem;
  padding: 0.6rem 0.4rem;
  margin: 0.4rem 0.4rem 0.4rem 0;
}
</style>
