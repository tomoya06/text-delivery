<template>
  <div>
    <div id="market-queue">
      <div>
        <span>搶單市場 {{ queue.length }} / {{ maxQueueLength }}</span>
        <span>搶單等級{{ grade }}</span>
        <button @click="updateQueues">
          <span>刷新</span>
        </button>
      </div>
      <ul>
        <li v-for="pkg in queue" :key="pkg.id">
          <button @click="() => handleChoosePackage(pkg)">
            <span>搶單</span>
          </button>
          <span>
            <span>{{ pkg.from }} -> {{ pkg.to }}: {{ pkg.good }} ({{ pkg.value }})</span>
            <span> -- {{ pkg.distance | distanceFilter }}</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      intId: null,
      market: [],
    };
  },
  created() {
    this.updateQueues();
  },
  methods: {
    updateQueues() {
      this.$store.dispatch('market/updateQueues');
    },
    handleChoosePackage(pkg) {
      this.$store
        .dispatch('player/pickPackageFromMarket', pkg.id)
        .catch(() => {
          this.sendMsg('你的待送配額已滿。去氪金擴充吧');
        });
    },
  },
  computed: {
    ...mapState('market', ['queue', 'maxQueueLength']),
    ...mapGetters('market', ['grade']),
  },
};
</script>
