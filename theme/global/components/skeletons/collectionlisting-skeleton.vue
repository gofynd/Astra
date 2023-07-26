<template>
  <div class="container">
    <div>
      <image-skeleton :aspectRatio="28" class="heading" /><image-skeleton
        class="sub-heading"
        :aspectRatio="88"
      />
    </div>
    <div class="images">
      <image-skeleton
        :aspectRatio="0.788"
        v-for="index in count"
        :key="index"
      />
    </div>

    <div class="product-name">
      <image-skeleton :aspectRatio="12" v-for="index in count" :key="index" />
    </div>
    <div class="brand-name">
      <image-skeleton :aspectRatio="12" v-for="index in count" :key="index" />
    </div>
  </div>
</template>

<script>
import imageSkeleton from "../skeletons/image-skeleton.vue";

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
    count: {
      type: Number,
      default: 3,
    },
  },

  components: { imageSkeleton },

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
.container {
  width: 100%;
  position: relative;
  @media @mobile {
    display: none !important;
  }
}
.heading {
  margin-bottom: 2px;

  @media @tablet {
    width: 40%;
    margin: 0 auto 4px;
    height: 37px;
  }
}
.sub-heading {
  margin-bottom: 32px;

  @media @tablet {
    width: 40%;
    margin: 0 auto 24px;
    height: 14px;
  }
}
.images {
  margin-bottom: 32px;
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(3, 1fr);
  @media @tablet {
    grid-template-columns: repeat(3, 2fr);
  }
}
.product-name {
  width: 100%;
  display: none;
  @media screen and (max-width: 768px) {
    border-radius: 6px;
    display: grid;
    grid-gap: 24px;
    grid-template-columns: repeat(3, 1fr);
  }
}
.brand-name {
  width: 100%;
  display: none;
  @media screen and (max-width: 768px) {
    border-radius: 6px;
    display: grid;
    grid-gap: 24px;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
