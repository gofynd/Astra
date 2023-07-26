<template>
  <div class="product-card">
    <div class="product-image">
      <image-skeleton :aspectRatio="0.8" />
    </div>
    <div class="product-des w-75">
      <image-skeleton :aspectRatio="13.5" />
    </div>
    <div class="product-des">
      <image-skeleton :aspectRatio="12" />
    </div>
    <div class="product-des w-60">
      <image-skeleton :aspectRatio="11" />
    </div>

    <div class="product-des w-40">
      <image-skeleton :aspectRatio="10" />
    </div>
  </div>
</template>
<script>
import imageSkeleton from "../skeletons/image-skeleton.vue";
export default {
  // props: {
  //   aspectRatio: {
  //     type: Number,
  //     default: 1,
  //   },
  //   showSkeleton: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   mobileAspectRatio: {
  //     type: Number,
  //     default: 1,
  //   },
  //   width: {
  //     type: Number,
  //     default: 100,
  //   },
  // },
  components: {
    "image-skeleton": imageSkeleton,
  },
};
</script>
<style lang="less" scoped>
.product-card {
  width: 100%;
  margin: 5px;
}
.product-image {
  margin-bottom: 2px;
  div {
    border-radius: 10%;
  }
}
.product-des {
  margin: 2px;
  div {
    border-radius: 5%;
  }
  &.w-75 {
    width: 75%;
  }
  &.w-60 {
    width: 60%;
  }
  &.w-40 {
    width: 60%;
  }
}
</style>
