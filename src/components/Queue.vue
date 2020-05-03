<template>
  <div>
    <div id="market-queue">
      <div>
        <span>搶單市場 {{ marketQueue.length }}</span>
      </div>
      <ul>
        <li v-for="pkg in marketQueue" :key="pkg.id">
          <button @click="() => handleChoosePackage(pkg)">
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
  data() {
    return {
      intId: null,
      market: [],
    };
  },
  created() {
    for (let i = 0; i < 10; i += 1) {
      this.generatePackage();
    }
  },
  methods: {
    generatePackage() {
      this.$store.dispatch('market/generatePackage');
    },
    handleChoosePackage(pkg) {
      this.$store
        .dispatch('player/pickPackageFromMarket', pkg.id)
        .catch(() => {
          console.log('Your Queue is Full');
        });
    },
  },
  computed: {
    marketQueue() {
      return this.$store.state.market.queue;
    },
  },
};
</script>
