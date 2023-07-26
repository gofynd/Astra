<template>
  <div class="grp-list-wrap">
    <div
      class="group-cards"
      :class="{ 'logo-only-group': show_only_logo }"
      :data-card="cardtype"
      :style="getFlex"
    >
      <template v-if="cardtype === 'PRODUCT'">
        <group-item-product
          v-for="(item, index) in cardlist"
          :card="item"
          :key="cardtype + index"
          :global_config="global_config"
          :listing_price_config="listing_price_config"
        />
      </template>
      <template v-else-if="cardtype === 'GALLERY'">
        <gallery-item
          v-for="(item, index) in cardlist"
          :block="item"
          :key="'gallery-item' + index"
        />
      </template>
      <template v-else-if="show_only_logo">
        <group-item-logo
          v-for="(item, index) in cardlist"
          :card="item"
          :cardtype="cardtype"
          :key="'group-item-logo' + index"
          :global_config="global_config"
        />
      </template>
      <template v-else>
        <group-item
          v-for="(item, index) in cardlist"
          :card="item"
          :key="cardtype + index"
          :cardtype="cardtype"
          :global_config="global_config"
        />
      </template>
    </div>
  </div>
</template>

<script>
import groupItem from "./group-item.vue";
import groupItemProduct from "./group-item-product.vue";
import groupItemLogo from "./group-item-logo.vue";
import galleryItem from "./gallery-item.vue";

export default {
  name: "groupList",
  components: {
    "group-item": groupItem,
    "group-item-product": groupItemProduct,
    "gallery-item": galleryItem,
    "group-item-logo": groupItemLogo,
  },
  props: {
    cardlist: {
      type: Array,
    },
    cardtype: {
      type: String,
      enum: ["BRANDS", "CATEGORIES", "COLLECTIONS", "WISHLIST", "PRODUCT"],
    },
    show_only_logo: {
      type: Boolean,
      default: false,
    },
    listing_price_config: {
      type: String,
    },
    global_config: {},
  },
  computed: {
    getFlex() {
      return {
        "--itemcount": this.itemcount,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.group-cards {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto;
  grid-template-rows: 1fr;
  .grid-gap(16px);
  @media @mobile-up {
    .grid-gap(16px, 24px);
    grid-template-columns: repeat(4, 1fr);
  }
  &[data-card="BRANDS"] {
    @lg-min: 1024px;
    grid-template-columns: 1fr;
    @media @mobile-up {
      grid-template-columns: repeat(3, 1fr);
    }
    @media @desktop {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  &.logo-only-group {
    .grid-gap(12px);
    grid-template-columns: repeat(auto-fit, calc((100% - 24px) / 3));
    @media @mobile-up {
      padding: 0 80px;
    }
    @media @desktop {
      padding: 0 124px;
      .grid-gap(16px, 24px);
      grid-template-columns: repeat(auto-fit, calc((100% - 96px) / 5));
    }
  }
}
</style>
