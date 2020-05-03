<template>
  <div id="app">
    <hud></hud>
    <panel></panel>
    <queue></queue>
  </div>
</template>

<script>
import Hud from './components/HUD.vue';
import Queue from './components/Queue.vue';
import Panel from './components/Panel.vue';

export default {
  name: 'App',
  components: {
    Hud,
    Queue,
    Panel,
  },
};
</script>
