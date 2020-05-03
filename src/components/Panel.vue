<template>
  <div>
    <div id="my-queue">
      <div>
        <span>我的派送 {{ myQueue.length }}</span>
      </div>
      <ul>
        <li v-for="pkg in myQueue" :key="pkg.id">
          <button @click="() => handleActivatePackage(pkg)">
            <span>{{ pkg.from }} -> {{ pkg.to }}: {{ pkg.good }} ({{ pkg.value }})</span>
            <span> -- {{ pkg.distance }}m</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    myQueue() {
      return this.$store.state.player.queue;
    },
  },
};
</script>
