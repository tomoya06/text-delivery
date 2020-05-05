<template>
  <div>
    <div class="fieldset-container">
      <fieldset>
        <legend>幸運抽獎區</legend>
        <div class="info-container">
          <span>当前中奖概率：{{ couponRate }}</span>
        </div>
        <div class="info-container">
          <button @click="handleLottery" class="larger-button">
            <span>只要{{ couponPrice | roundMoneyFilter }}</span>
            <br />
            <span>抽奖有惊喜！</span>
          </button>
          <button class="larger-button" v-if="canUpgradeCP" @click="handleUpgradeCoupons">
            <span>想要一次保留更多奖券？</span>
            <br />
            <span>只要{{ upgradeCPcost | roundMoneyFilter }}，</span>
            <span>升级获得{{ nextCP }}个奖券槽</span>
          </button>
        </div>
        <fieldset>
          <legend>當前擁有的獎券 {{ coupons.length }}/{{ curCP }}</legend>
          <div>
            <ul class="densed">
              <li v-for="coupon in coupons" :key="coupon.id" class="queue-item">
                <span>{{ coupon.name }}</span>
                <span> 剩餘{{ coupon.times }}次</span>
              </li>
            </ul>
          </div>
        </fieldset>
      </fieldset>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState('player', ['coupons']),
    ...mapGetters('player', [
      'canUpgradeCP',
      'curCP',
      'nextCP',
      'upgradeCPcost',
      'couponRate',
      'couponPrice',
    ]),
  },
  methods: {
    handleLottery() {
      this.$store.dispatch('player/goodLuck')
        .then((cp) => {
          if (cp) {
            this.sendMsg('你中獎了！');
          } else {
            this.sendMsg('謝謝惠顧！');
          }
        }).catch((error) => {
          this.sendMsg(error.message);
        });
    },
    handleUpgradeCoupons() {
      this.$store.dispatch('player/upgradeMaxCouponLength')
        .then((cp) => {
          this.sendMsg(`成功升級獎券槽至${cp}個`);
        }).catch((error) => {
          this.sendMsg(error);
        });
    },
  },
};
</script>
