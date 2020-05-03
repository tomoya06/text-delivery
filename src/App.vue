<template>
  <div id="app">
    <hud></hud>
    <income></income>
    <panel></panel>
    <MarketCenter></MarketCenter>
  </div>
</template>

<script>
import Hud from './components/HUD.vue';
import Income from './components/Income.vue';
import MarketCenter from './components/MarketCenter.vue';
import Panel from './components/Panel.vue';

export default {
  name: 'App',
  components: {
    Hud,
    MarketCenter,
    Panel,
    Income,
  },
};
</script>
