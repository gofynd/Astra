<template>
  <div class="pagination">
    <fdk-link
      class="prev"
      :link="value.has_previous && getPageUrl(value.current - 1)"
    >
      <svg-wrapper
        class="arrow-icon left-arrow"
        :class="{ disable: !value.has_previous }"
        :svg_src="'arrow-down'"
      />
    </fdk-link>
    <div class="page-container">
      <fdk-link
        class="page-btn b1 font-body"
        :class="{ active: value.current === getStartPage + index - 1 }"
        :link="getPageUrl(getStartPage + index - 1)"
        v-for="index in getPagesButton"
        :key="index"
      >
        {{ getStartPage + index - 1 }}
      </fdk-link>
    </div>
    <fdk-link
      class="next"
      :link="value.has_next && getPageUrl(value.current + 1)"
    >
      <svg-wrapper
        class="arrow-icon right-arrow"
        :class="{ disable: !value.has_next }"
        :svg_src="'arrow-down'"
      />
    </fdk-link>
  </div>
</template>

<script>
import SvgWrapper from "../../../components/common/svg-wrapper.vue";

const PAGES_TO_SHOW = 5;
const PAGE_OFFSET = 2;
export default {
  name: "fdk-plp",
  components: {
    "svg-wrapper": SvgWrapper,
  },
  props: {
    value: {
      type: Object,
      required: true,
      default: () => {
        return {
          current: 0,
          total: 0,
          has_previous: false,
          has_next: false,
        };
      },
    },
  },
  methods: {
    getPageUrl(pageNo) {
      const currentRoute = this.$route;
      const updatedQuery = {
        ...currentRoute.query,
        page_no: pageNo,
      };

      const resolvedRoute = this.$router.resolve({
        name: currentRoute.name,
        params: currentRoute.params,
        query: updatedQuery,
      });
      return resolvedRoute.href;
    },
  },
  computed: {
    getStartPage() {
      let startingPage = 1;

      const maxStartingPage =
        this.value.total - PAGES_TO_SHOW + PAGE_OFFSET + 1;

      if (this.value.current >= maxStartingPage) {
        startingPage =
          maxStartingPage - PAGE_OFFSET > 0 ? maxStartingPage - PAGE_OFFSET : 1;
      } else if (this.value.current > PAGE_OFFSET) {
        startingPage = this.value.current - PAGE_OFFSET;
      }
      return startingPage;
    },
    getPagesButton() {
      return this.value.total > PAGES_TO_SHOW
        ? PAGES_TO_SHOW
        : this.value.total;
    },
  },
};
</script>

<style lang="less" scoped>
@lg-min: 1024px;
.pagination {
  display: flex;
  align-items: center;
  .arrow-icon {
    width: 40px;
    height: 40px;
    padding: 7px;
    fill: @TextBody;
    &.disable {
      fill: @TextSecondary;
    }
    &.left-arrow {
      transform: rotate(90deg);
    }
    &.right-arrow {
      transform: rotate(-90deg);
    }
  }
  .page-container {
    display: flex;
    align-items: center;
    .column-gap(8px);
    .page-btn {
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: @TextBody;
      border: 1px solid @DividerStokes;
      border-radius: 50%;
      &.active {
        border-color: @ButtonPrimary;
      }
    }
  }
}
</style>
