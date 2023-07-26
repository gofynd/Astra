<template>
  <div class="accordion">
    <div
      class="accordion__header flex-align-center justify-between user-select-none"
      @click="toggleAccordion"
    >
      <div class="accordion__title">
        <slot name="accordion-title"></slot>
      </div>
      <svg-wrapper
        class="accordion__icon"
        :class="{ rotate: isOpenState }"
        :svg_src="'accordion-arrow'"
      ></svg-wrapper>
    </div>
    <div class="accordion__content" v-show="isOpenState">
      <slot name="accordion-content"></slot>
    </div>
  </div>
</template>

<script>
import svgWrapper from "../../components/common/svg-wrapper.vue";
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    "svg-wrapper": svgWrapper,
  },
  data() {
    return {
      isOpenState: this.isOpen,
    };
  },
  methods: {
    toggleAccordion() {
      this.isOpenState = !this.isOpenState;
    },
  },
};
</script>

<style scoped lang="less">
.accordion {
  width: 100%;
  padding: 12px 0;
  overflow: hidden;
  border-bottom: 1px solid #d4d1d1;
  @media @tablet {
    width: 100%;
  }
  &__icon {
    width: 16px;
    height: 16px;
    &.rotate {
      transform: rotate(180deg);
    }
  }
}
</style>
