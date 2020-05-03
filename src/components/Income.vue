<template>
  <div>
    <span>收入 {{ earning }}</span>
    <span>分成 {{ share }}</span>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('player', ['share', 'earning']),
  },
};
</script>
