<template>
  <div id="hud-container">
    <span>等级 {{ grade }}</span>
    <span>电池续航 {{ duration | fixedNumberFilter }}/{{ maxDuration | fixedNumberFilter }}</span>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

export default {
  created() {
    console.log(this.$store);
  },
  computed: {
    ...mapState('car', ['duration', 'maxDuration']),
    ...mapGetters('player', ['grade']),
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
