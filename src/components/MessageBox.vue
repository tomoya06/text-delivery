<template>
  <div id="msg-container">
    <div>
      <span>訊息欄</span>
    </div>
    <ul>
      <li v-for="msgItem in msgs" :key="msgItem.id">
        <span>{{ msgItem.msg }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('msg', ['msgs']),
  },
};
</script>
