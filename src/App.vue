<template>
  <div id="app">
    <hud></hud>
    <income></income>
    <panel></panel>
    <MarketCenter></MarketCenter>
    <message-box></message-box>
  </div>
</template>

<script>
import './assets/common.less';

import Hud from './components/CarControl.vue';
import Income from './components/Income.vue';
import MarketCenter from './components/MarketCenter.vue';
import Panel from './components/PlayerControl.vue';
import MessageBox from './components/MessageBox.vue';

export default {
  name: 'App',
  components: {
    Hud,
    MarketCenter,
    Panel,
    Income,
    MessageBox,
  },
};
</script>
<style lang="less" scoped>
</style>
