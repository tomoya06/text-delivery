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
    <PlayerControl></PlayerControl>
    <MarketCenter></MarketCenter>
    <CarControl></CarControl>
    <add-on></add-on>
  </div>
</template>

<script>
import './assets/css/common.less';
import './assets/css/app.less';
import './assets/css/animation.less';

import CarControl from './components/CarControl.vue';
import Income from './components/Income.vue';
import MarketCenter from './components/MarketCenter.vue';
import PlayerControl from './components/PlayerControl.vue';
import MessageBox from './components/MessageBox.vue';
import AddOn from './components/AddOn.vue';

export default {
  name: 'App',
  components: {
    CarControl,
    MarketCenter,
    PlayerControl,
    Income,
    MessageBox,
    AddOn,
  },
};
</script>
<style lang="less" scoped>
#app {
  padding: 0 0 4rem 0 ;
}
</style>
