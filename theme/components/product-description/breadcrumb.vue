<template>
  <div class="breadcrumbs caption-normal">
    <span><fdk-link :link="'/'">Home</fdk-link>&nbsp;/&nbsp;</span>
    <span v-if="getPageConfigValue(page_config, 'show_products_breadcrumb')">
      <fdk-link :link="'/products'">Products</fdk-link>&nbsp;/&nbsp;</span
    >
    <span
      v-if="
        getPageConfigValue(page_config, 'show_category_breadcrumb') &&
        getCategory.name
      "
    >
      <fdk-link :link="`${getCategory.url || '/'}`">{{
        getCategory.name
      }}</fdk-link
      >&nbsp;/&nbsp;</span
    >
    <span
      v-if="
        getPageConfigValue(page_config, 'show_brand_breadcrumb') &&
        getBrand.name
      "
    >
      <fdk-link :link="`${getBrand.url || '/'}`">{{ getBrand.name }}</fdk-link
      >&nbsp;/&nbsp;</span
    >
    <span v-if="context.product && context.product.name" class="active"
      >{{ context.product.name }}
    </span>
  </div>
</template>

<style lang="less" scoped>
.breadcrumbs {
  margin: 0 0 24px;

  span {
    color: @TextDisabled;
    &.active {
      color: @ButtonPrimary;
    }
  }

  @media @tablet {
    margin: 16px 0 0;
  }
}
</style>

<script>
import { getPageConfigValue } from "../../helper/utils";
export default {
  name: "BreadCrumb",
  props: {
    context: {
      type: Object,
      default: () => {
        return {};
      },
    },
    page_config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {
    getPageConfigValue,
  },
  computed: {
    getBrand() {
      return this.context?.product?.brand || {};
    },
    getCategory() {
      const category = this.context?.product?.categories?.[0] || {};
      let updatedCategory = {};
      const categorySlug = category?.action?.page?.query?.category?.[0] || "";

      updatedCategory["name"] = category.name || "";
      updatedCategory["url"] =
        categorySlug && `/products/?category=${categorySlug}`;

      return updatedCategory;
    },
  },
};
</script>
