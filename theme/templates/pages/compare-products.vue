<template>
  <div class="container font-body">
    <div class="breadcrumbs caption-normal">
      <span><fdk-link :link="'/'">Home</fdk-link>&nbsp;/&nbsp;</span>
      <span>
        <fdk-link :link="'/products'">Products</fdk-link>&nbsp;/&nbsp;</span
      >
      <span v-if="getCategory.name">
        <fdk-link :link="`${getCategory.url || '/'}`">{{
          getCategory.name
        }}</fdk-link
        >&nbsp;/&nbsp;</span
      >
      <!-- <span v-if="getBrand.name">
        <fdk-link :link="`${getBrand.logo.url || '/'}`">{{
          getBrand.name
        }}</fdk-link
        >&nbsp;/&nbsp;</span
      > -->
      <span class="breadcrumbs comparecrumb">
        <span class="active-product">Compare Products</span></span
      >
    </div>
    <div class="compare-header font-header h1">Compare Products</div>
    <jm-compare
      :context="context"
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
  watch: {
    context: {
      handler(newValue) {},
      deep: true,
    },
  },
  mounted() {},
  methods: {},
  props: {
    context: {},
    page_config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    global_config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    getCategory() {
      const category =
        this.context?.compared_products?.data?.items?.[0]?.categories?.[0] ||
        {};
      let updatedCategory = {};
      const categorySlug = category?.action?.page?.query?.category?.[0] || "";

      updatedCategory["name"] = category.name || "";
      updatedCategory["url"] =
        categorySlug && `/products/?category=${categorySlug}`;

      return updatedCategory;
    },
    getBrand() {
      return this.context?.compared_products?.data?.items?.[0]?.brand || {};
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 16px 40px 80px 40px;
  @media @tablet {
    padding: 24px;
  }
  @media @mobile {
    padding: 0px 16px 80px 16px;
  }
}
.breadcrumbs {
  color: @TextSecondary;
  .breadcrumbs {
    color: @ButtonPrimary;
  }
}
.compare-header {
  display: flex;
  height: 52px;
  justify-content: center;
  color: @TextHeading;
  text-align: center;
  letter-spacing: -1.08px;
  padding-top: 24px;
  @media @tablet {
    font-size: 28px;
  }
  @media @mobile {
    padding-top: 16px;
    justify-content: flex-start;
  }
}
</style>
