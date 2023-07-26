<template>
  <div class="container">
    <div class="heading"><image-skeleton :aspectRatio="11.33" /></div>
    <div class="images">
      <image-skeleton :aspectRatio="0.79" v-for="index in count" :key="index" />
    </div>
    <div class="glides"><image-skeleton :aspectRatio="14.64" /></div>
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
      default: 6,
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
  margin-bottom: 32px;

  @media @tablet {
    width: 20%;
    margin: 0 auto 24px;
  }
}
.images {
  margin-bottom: 32px;
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(5, 1fr);
  @media @tablet {
    grid-template-columns: repeat(3, 2fr);
  }
}
.glides {
  margin: auto;
  width: 39%;
}
</style>
