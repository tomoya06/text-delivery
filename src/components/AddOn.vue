<template>
  <div class="block-container">
    <div>
      <b>升級中心</b>
      <hr>
    </div>
    <upgrade-center />
    <cheating-center />
    <lottery-center />
  </div>
</template>
<script>
import UpgradeCenter from './UpgradeCenter.vue';
import LotteryCenter from './LotteryCenter.vue';
import CheatingCenter from './CheatingCenter.vue';

export default {
  components: {
    UpgradeCenter,
    LotteryCenter,
    CheatingCenter,
  },
};
</script>
