<template>
  <div>
    <span>等级{{ grade }}</span>
    <span>电池续航{{ duration }}</span>
  </div>
</template>
<script>
export default {
  created() {
    console.log(this.$store);
  },
  computed: {
    grade() {
      return this.$store.getters['player/grade'];
    },
    duration() {
      return this.$store.getters['player/duration'];
    },
  },
};
</script>
