<template>
  <div class="container">
    <div>
      <image-skeleton :aspectRatio="28" class="heading" />
      <image-skeleton class="sub-heading" :aspectRatio="30" />
    </div>
    <div class="images">
      <image-skeleton :aspectRatio="1" v-for="index in count" :key="index" />
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
      default: 5,
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
  margin-bottom: 1px;
  height: 37px;
  @media @tablet {
    width: 40%;
    margin: 0 auto 8px;
  }
}
.sub-heading {
  margin-bottom: 32px;
  height: 14px;
  @media @tablet {
    width: 40%;
    margin: 0 auto 24px;
  }
}
.images {
  margin-bottom: 32px;
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(5, 1fr);
  width: 80%;
  margin: auto;
  @media @tablet {
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
  }
}
</style>
