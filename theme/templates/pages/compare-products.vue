<template>
  <div
    class="container"
  >
    <div class="compare-header">Compare</div>
    <jm-compare
      :compared_products="context.compared_products"
      :compare_slugs="context.compare_slugs"
      :global_config="global_config"
    ></jm-compare>
  </div>
</template>

<script>
import jmCompareVue from "./../../global/components/jm-compare.vue";
export default {
  components: {
    "jm-compare": jmCompareVue,
  },
  props: ["global_config"],
};
</script>

<style lang="less" scoped>
.compare-header {
  background: #f8f8f8;
  color: #000000;
  // text-align: center;
  padding: 20px 15px;
  font-weight: bold;
  font-size: 25px;
}
</style>
