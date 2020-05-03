<template>
  <div>
    <span>收入 {{ earning | moneyFilter }}</span>
    <span>分成 {{ share | percentFilter }}</span>
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
