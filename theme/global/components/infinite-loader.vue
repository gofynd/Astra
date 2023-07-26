<template>
  <div class="loader-container">
    <svg-wrapper
      class="rotate svg_color"
      :svg_src="'infinite-loader'"
    ></svg-wrapper>
  </div>
</template>

<script>
import svgWrapper from "../../components/common/svg-wrapper.vue";
export default {
  components: { svgWrapper },
};
</script>

<style lang="less" scoped>
.loader-container {
  display: flex;
  justify-content: center;
  height: 35px;
}

.rotate {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

.svg_color {
  ::v-deep svg {
    path {
      stroke: var(--buttonPrimary);
    }
  }
}
</style>
