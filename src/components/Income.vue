<template>
  <div class="info-container">
    <span>收入：{{ earning | moneyFilter }}</span>
    <span>總共配送：{{ totalFinished }}</span>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('player', ['share']),
    ...mapState(['earning']),
    ...mapState('player', ['totalFinished']),
  },
};
</script>
