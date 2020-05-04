<template>
  <div class="info-container">
    <span>收入：{{ earning | moneyFilter }}</span>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('player', ['share']),
    ...mapState(['earning']),
  },
};
</script>
