<template>
  <div class="block-container">
    <div>
      <b>配送市場</b>
      <hr />
    </div>
    <div id="market-queue">
      <div>
        <span>搶單市場 {{ queue.length }} / {{ maxQueueLength }}</span>
        <span style="margin: 0 0 0 1rem">
          <button @click="updateQueues">
            <span>刷新</span>
          </button>
        </span>
      </div>
      <ul class="densed">
        <li v-for="pkg in queue" :key="pkg.id" class="queue-item expanded">
          <span>
            <button @click="() => handleChoosePackage(pkg)">
              <span>搶單</span>
            </button>
          </span>
          <span class="queue-item-content">
            <span class="value">{{ pkg.value | moneyFilter }}</span>
            <span class="distance">{{ pkg.distance | distanceFilter }}</span>
            <span class="from">{{ pkg.from }}</span>
            <span>派送給</span>
            <span class="to">{{ pkg.to }}：</span>
            <span class="good">{{ pkg.good }}</span>
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
      this.$store.dispatch('player/pickPackageFromMarket', pkg.id).catch(() => {
        this.sendMsg('你的待送配額已滿');
      });
    },
  },
  computed: {
    ...mapState('market', ['queue', 'maxQueueLength']),
    ...mapGetters('market', ['grade']),
  },
};
</script>
<style lang="less" scoped>
.queue-item {
  .queue-item-content {
    span {
      display: inline-block;
      margin: 0 0 0 .4rem;
    }
    .from {
      font-weight: 600;
    }
    .to {
      font-weight: 600;
      font-style: italic;
    }
    .good {
      text-decoration: underline;
    }
    .value {
      width: 4rem;
    }
    .distance {
      width: 4rem;
    }
  }
}
</style>
