<template>
  <div class="filter">
    <div
      class="filter__title flex-align-center justify-between"
      @click="isActive = !isActive"
      v-if="filter.values.length > 0"
    >
      <p class="name b2 font-body">
        {{ filter.key.display }}
      </p>
      <div>
        <svg-wrapper
          class="arrow-icon"
          :class="{ isOpen: isActive }"
          :svg_src="'arrow-down'"
        >
        </svg-wrapper>
      </div>
    </div>
    <FilterList :class="{ collapse: !isActive }" :filter="filter" />
  </div>
</template>

<script>
import SvgWrapper from "../../components/common/svg-wrapper.vue";
import FilterList from "./fy-filter-list.vue";

export default {
  components: {
    "svg-wrapper": SvgWrapper,
    FilterList,
  },
  props: {
    filter: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      isActive: true,
    };
  },
};
</script>

<style lang="less">
.filter {
  &__title {
    margin-bottom: 16px;
    cursor: pointer;
    .name {
      color: @TextHeading;
    }
    .arrow-icon {
      width: 24px;
      height: 24px;
      fill: @TextHeading;
      transition: all 0.25s ease;
      &.isOpen {
        transform: scale(1, -1);
      }
    }
  }
  &__list {
    transition: 300ms all cubic-bezier(0, 0, 0.2, 1);
    max-height: 3000px;
    margin-bottom: 22px;
    opacity: 1;
    visibility: visible;
    &.collapse {
      max-height: 0;
      margin-bottom: 0;
      opacity: 0;
      visibility: hidden;
      overflow: hidden;
    }
  }
}
</style>
