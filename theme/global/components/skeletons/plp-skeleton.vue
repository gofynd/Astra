<template>
  <div class="plp-shimmer-wrapper">
    <div class="left">
      <image-skeleton :aspectRatio="0.162" />
    </div>
    <div class="right">
      <div class="top-bar">
        <image-skeleton :aspectRatio="30.162" />
      </div>
      <div class="product-shimmer-card">
        <product-card class="product-border" v-for="index in 10" :key="index" />
        <!-- <product-card class="product-border" /> -->
      </div>
    </div>
  </div>
</template>
<script>
import imageSkeleton from "../skeletons/image-skeleton.vue";
import ProductCard from "../skeletons/product-card.vue";
export default {
  props: {
    aspectRatio: {
      type: Number,
      default: 1,
    },
    showSkeleton: {
      type: Boolean,
      default: false,
    },
    mobileAspectRatio: {
      type: Number,
      default: 1,
    },
    width: {
      type: Number,
      default: 100,
    },
  },
  components: {
    "image-skeleton": imageSkeleton,
    "product-card": ProductCard,
  },
  computed: {
    height() {
      return Math.floor(this.width / this.aspectRatio);
    },
    mobileHeight() {
      return Math.floor(
        this.width / (this.mobileAspectRatio || this.aspectRatio)
      );
    },
  },
};
</script>
<style lang="less" scoped>
.plp-shimmer-wrapper {
  padding: 0 16px;
  @media @mobile-up {
    padding: 0 40px;
  }
  @media @desktop {
    display: flex;
  }
  .left {
    flex: 0 0 259px;
    margin-right: 16px;
    @media @tablet {
      display: none;
    }
  }
  .right {
    flex-grow: 1;
  }
}
.product-shimmer-card {
  display: grid;
  grid-auto-rows: auto;
  grid-template-rows: 1fr;
  grid-template-columns: repeat(4, 1fr);
  .grid-gap(16px);
}
.top-bar {
  margin: 15px 0;
  height: 36px;
}
.product-border {
}
</style>
