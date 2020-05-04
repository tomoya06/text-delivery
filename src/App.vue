<template>
  <div id="app">
    <MessageBox></MessageBox>
    <div class="header">
      <img src="./assets/img/deliveryman.gif" alt="">
    </div>
    <div>
      <span>輝哥派送</span>
      <hr>
    </div>
    <income></income>
    <CarControl></CarControl>
    <PlayerControl></PlayerControl>
    <MarketCenter></MarketCenter>
  </div>
</template>

<script>
import './assets/css/common.less';
import './assets/css/app.less';

import CarControl from './components/CarControl.vue';
import Income from './components/Income.vue';
import MarketCenter from './components/MarketCenter.vue';
import PlayerControl from './components/PlayerControl.vue';
import MessageBox from './components/MessageBox.vue';

export default {
  name: 'App',
  components: {
    CarControl,
    MarketCenter,
    PlayerControl,
    Income,
    MessageBox,
  },
};
</script>
<style lang="less" scoped>
#app {
  padding: 2rem 0 0 0;
}
</style>
