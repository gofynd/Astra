<template>
  <fdk-product-card
    class="product-card"
    :class="{ 'disable-cursor': !product.sellable }"
  >
    <template slot-scope="productData">
      <div class="image-container">
        <emerge-image
          v-if="!isMobile && hoverImageUrl"
          :src="hoverImageUrl"
          :alt="hoverImageAlt"
          :aspectRatio="getProductImgAspectRatio"
          :mobileAspectRatio="getProductImgAspectRatio"
          :global_config="global_config"
          class="product-image hover-image"
          :sources="[
            { breakpoint: { min: 1024 }, width: 550 },
            { breakpoint: { min: 768 }, width: 460 },
            { breakpoint: { min: 481 }, width: 350 },
            { breakpoint: { max: 390 }, width: 380 },
            { breakpoint: { max: 480 }, width: 460 },
          ]"
        />
        <emerge-image
          :src="imageUrl"
          :alt="imageAlt"
          :aspectRatio="getProductImgAspectRatio"
          :mobileAspectRatio="getProductImgAspectRatio"
          :global_config="global_config"
          class="product-image main-image"
          :sources="[
            { breakpoint: { min: 1024 }, width: 550 },
            { breakpoint: { min: 768 }, width: 460 },
            { breakpoint: { min: 481 }, width: 350 },
            { breakpoint: { max: 390 }, width: 380 },
            { breakpoint: { max: 480 }, width: 460 },
          ]"
        />
        <fdk-accounts class="wishlist-wrapper">
          <template slot-scope="accountsData">
            <div
              v-if="showWishlist && isMounted"
              @click.prevent.stop="
                accountsData.is_logged_in
                  ? onClickWishlist($event, productData, product)
                  : accountsData.openLogin()
              "
            >
              <svg-wrapper
                class="icon wishlist-icon"
                :class="{ active: product.follow }"
                :svg_src="'wishlist-plp'"
              ></svg-wrapper>
            </div>
          </template>
        </fdk-accounts>
        <div class="badge out-of-stock" v-if="!product.sellable">
          <span class="text font-body caption-normal">Out of stock</span>
        </div>
        <div
          class="badge sale"
          v-else-if="
            getGlobalConfigValue(global_config, 'show_sale_badge') &&
            product.discount &&
            product.sellable
          "
        >
          <span class="text font-body caption-normal">Sale</span>
        </div>
        <div class="badge" v-else-if="product.teaser_tag">
          <span class="text font-body caption-normal">{{
            product.teaser_tag.substring(0, 14)
          }}</span>
        </div>
        <div class="badge tag" v-else-if="product.tags?.[0]">
          <span class="text font-body caption-normal">{{
            product.tags?.[0].substring(0, 14)
          }}</span>
        </div>
        <div
          class="review caption-semi-bold font-body"
          v-if="getReviewRatingInfo.avg_ratings"
        >
          <span>{{ getReviewRatingInfo.avg_ratings }}</span>
          <svg-wrapper :svg_src="'star'" class="rating-icon" />
        </div>
        <div class="extension">
          <fdk-extension
            v-if="getTemplates('bottom_left_corner').length"
            :templates="getTemplates('bottom_left_corner')"
          />
        </div>
      </div>
      <div class="product-desc">
        <h5
          class="product-brand font-body"
          v-if="!getPageConfigValue(page_config, 'hide_brand') && product.brand"
        >
          {{ product.brand.name }}
        </h5>
        <h3 class="product-name b2 font-body" :title="product.name">
          {{ product.name }}
        </h3>
        <div class="product-price font-body">
          <span class="product-price--sale h4" v-if="product.price.effective">{{
            getListingPrice("effective")
          }}</span>
          <span
            class="product-price--regular caption-normal"
            v-if="hasDiscount"
            >{{ getListingPrice("marked") }}</span
          >
          <span
            class="product-price--discount caption-normal"
            v-if="hasDiscount"
            >({{ product.discount }})</span
          >
        </div>
        <div class="product-variants" v-if="shadeVariantsCount !== 0">
          <div v-if="currentShade" class="shade current-shade">
            <div
              class="shade-color"
              :style="`background-color: #${currentShade.color}`"
            ></div>
            <p class="shade-name font-body" v-if="currentShade.color_name">
              {{ currentShade.color_name }}
            </p>
          </div>
          <div class="shade all-shades">
            <div class="variant-container">
              <div
                class="shade-color"
                v-for="varaintItem in variants"
                :key="varaintItem.uid"
                :style="`background-color: #${varaintItem.color}`"
              ></div>
            </div>
            <div class="shade-count font-body">
              {{ shadeVariantsCount }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </fdk-product-card>
</template>

<script>
import {
  getPageConfigValue,
  getGlobalConfigValue,
  getReviewRatingData,
  getProductImgAspectRatio,
  detectMobileWidth,
  currencyFormat,
} from "../../helper/utils";
import emergeImage from "../../global/components/common/emerge-image.vue";
import SvgWrapper from "./../../components/common/svg-wrapper.vue";

export default {
  components: {
    "emerge-image": emergeImage,
    "svg-wrapper": SvgWrapper,
  },
  props: {
    product: {},
    showWishlist: {
      type: Boolean,
      default: false,
    },
    isWishListPage: {
      type: Boolean,
      default: false,
    },
    activeProductId: {
      default: 0,
    },
    global_config: {},
    page_config: {},
    listing_price_config: {
      type: String,
      default: "range",
    },
  },
  mounted() {
    this.isMounted = true;
    this.isMobile = detectMobileWidth();
  },
  data() {
    return {
      disable: false,
      isMounted: false,
      isMobile: true,
    };
  },
  methods: {
    getTemplates(position) {
      return this.page_config?.props?.extension?.[position] || [];
    },
    getPageConfigValue,
    getGlobalConfigValue,
    onClickWishlist(event, productData, product) {
      if (this.isWishListPage) {
        this.disable = true;
      }
      productData.updateWishList(event, product);
    },
    getListingPrice(key) {
      if (!this.product.price) return "";

      let price = "";
      const priceDetails = this.product.price[key];

      switch (this.listing_price_config) {
        case "min":
          price = currencyFormat(
            priceDetails.min,
            priceDetails.currency_symbol
          );
          break;
        case "max":
          price = currencyFormat(
            priceDetails.max,
            priceDetails.currency_symbol
          );
          break;
        case "range":
          price =
            priceDetails.min !== priceDetails.max
              ? `${currencyFormat(
                  priceDetails.min,
                  priceDetails.currency_symbol
                )} - ${currencyFormat(
                  priceDetails.max,
                  priceDetails.currency_symbol
                )}`
              : currencyFormat(priceDetails.min, priceDetails.currency_symbol);
          break;
        default:
          break;
      }
      return price;
    },
  },
  computed: {
    getProductImages() {
      return this.product?.medias.filter((media) => media.type === "image");
    },
    imageUrl() {
      return this.getProductImages?.[0]?.url || "";
    },
    imageAlt() {
      return (
        this.getProductImages?.[0]?.alt ||
        `${this.product?.brand?.name} | ${this.product?.name}`
      );
    },
    hoverImageUrl() {
      return this.getProductImages?.[1]?.url || "";
    },
    hoverImageAlt() {
      return (
        this.getProductImages?.[1]?.alt ||
        `${this.product?.brand?.name} | ${this.product?.name}`
      );
    },
    shadeVariants() {
      return this.product.variants?.find?.(
        (variant) => variant.display_type === "color"
      );
    },
    shadeVariantsCount() {
      return this.shadeVariants?.total - 1 || 0;
    },
    currentShade() {
      const slug = this.product?.slug;
      return this.shadeVariants?.items?.find?.(
        (variant) => slug === variant?.slug
      );
    },
    variants() {
      return this.shadeVariants?.items
        ?.filter((variant) => variant.slug !== this.currentShade?.slug)
        .slice(0, 2);
    },
    hasDiscount() {
      return (
        this.getListingPrice("effective") !== this.getListingPrice("marked")
      );
    },
    showSizes: {
      get: function () {
        return this.product.uid === this.activeProductId;
      },
    },
    getReviewRatingInfo() {
      const customMeta = this.product?._custom_meta || [];
      return getReviewRatingData(customMeta);
    },
    getProductImgAspectRatio() {
      return getProductImgAspectRatio(this.global_config);
    },
  },
};
</script>

<style scoped lang="less">
.product-card {
  .image-container {
    position: relative;
    margin-bottom: 12px;
    overflow: hidden;
    position: relative;
    border-radius: @ImageRadius;
    -webkit-mask-image: -webkit-radial-gradient(white, black); //safari fix

    .product-image {
      &.hover-image {
        position: absolute;
        .inset(0);
        visibility: hidden;
        opacity: 0;
        transition: 300ms transform cubic-bezier(0, 0, 0.2, 1);
      }
    }
    @lg-min: 860px;
    @media @desktop {
      &:hover {
        .hover-image + .main-image {
          visibility: hidden;
        }
        .hover-image {
          visibility: visible;
          opacity: 1;
          transform: scale(1.1);
        }
      }
    }
    .wishlist-wrapper {
      position: absolute;
      .wishlist-icon {
        width: 32px;
        height: 32px;
        fill: @ButtonPrimary;
        color: @ThemeAccentL5;
        cursor: pointer;
        &.active {
          color: @ButtonPrimary;
        }
        @media @desktop {
          &:hover {
            color: @ButtonPrimary;
          }
        }
      }
    }
    .badge {
      position: absolute;
      min-width: 50px;
      border-radius: 24px;
      padding: 6px 12px;
      text-align: center;
      background-color: @SaleBadgeBackground;
      color: @SaleBadgeText;
      white-space: nowrap;
      overflow: hidden;
      .text {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      &.out-of-stock {
        background-color: @ThemeAccentD5;
        color: @ThemeAccentL5;
      }
      &.sale {
        background-color: @SaleDiscountText;
        color: @ThemeAccentL5;
      }
    }
    .review {
      display: flex;
      .column-gap(4px);
      border-radius: 4px;
      padding: 4px 8px;
      background-color: @ThemeAccentL5;
      color: @ThemeAccentD5;
      position: absolute;
    }
    .extension {
      position: absolute;
    }
  }
  .product-desc {
    .product-brand {
      margin-bottom: 4px;
      .text-line-clamp();
      color: @TextBody;
    }
    .product-name {
      margin-bottom: 4px;
      .text-line-clamp();
      color: @TextHeading;
    }
    .product-price {
      margin-bottom: 8px;
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      &--sale {
        margin-right: 8px;
      }
      &--regular {
        text-decoration: line-through;
        color: @TextLabel;
        margin-right: 4px;
      }
      &--discount {
        color: @SaleDiscountText;
      }
    }
    .product-variants {
      .flex-align-center();
      gap: 8px;
      .shade {
        .flex-align-center();
        padding: 4px 8px;
        background-color: @ThemeAccentL5;
        border: 1px solid @DividerStokes;
        border-radius: 40px;
        .shade-color {
          width: 12px;
          height: 12px;
          border: 1px solid @DividerStokes;
          border-radius: 50%;
        }
        .shade-name,
        .shade-count {
          margin-left: 4px;
          font-size: 12px;
          line-height: 14px;
          color: @TextBody;
          text-transform: capitalize;
        }
      }
      .all-shades {
        .variant-container {
          display: flex;
          isolation: isolate;
          .shade-color:not(:first-child) {
            margin-left: -4px;
            z-index: -1;
          }
          .shade-color:last-child {
            z-index: -2;
          }
        }
      }
    }
  }
  &.mob-grid-1-card {
    .image-container {
      .wishlist-wrapper {
        top: 12px;
        right: 12px;
      }
      .badge {
        left: 12px;
        top: 17px;
      }
      .review {
        right: 16px;
        bottom: 16px;
      }
      .extension {
        left: 16px;
        bottom: 16px;
      }
    }
  }
  &.mob-grid-2-card {
    .image-container {
      .wishlist-wrapper {
        top: 4px;
        right: 4px;
      }
      .badge {
        left: 4px;
        top: 9px;
      }
      .review {
        right: 8px;
        bottom: 8px;
      }
      .extension {
        left: 8px;
        bottom: 8px;
      }
    }
    .product-desc {
      .product-brand {
        margin-bottom: 0px;
      }
      .product-name {
        margin-bottom: 7px;
      }
    }
  }
  @media @mobile-up {
    &.tablet-grid-2-card {
      .image-container {
        .wishlist-wrapper {
          top: 24px;
          right: 24px;
        }
        .badge {
          left: 24px;
          top: 29px;
        }
        .review {
          right: 24px;
          bottom: 24px;
        }
        .extension {
          left: 24px;
          bottom: 24px;
        }
      }
      .product-desc {
        .product-name {
          margin-bottom: 9px;
        }
      }
    }
    &.tablet-grid-3-card {
      .image-container {
        .wishlist-wrapper {
          top: 12px;
          right: 12px;
        }
        .badge {
          left: 12px;
          top: 17px;
        }
        .review {
          right: 12px;
          bottom: 12px;
        }
        .extension {
          left: 12px;
          bottom: 12px;
        }
      }
      .product-desc {
        .product-name {
          margin-bottom: 5px;
        }
      }
    }
  }
  @media @desktop {
    &.desktop-grid-2-card {
      .image-container {
        .wishlist-wrapper {
          top: 24px;
          right: 24px;
        }
        .badge {
          left: 24px;
          top: 29px;
        }
        .review {
          right: 24px;
          bottom: 24px;
        }
        .extension {
          left: 24px;
          bottom: 24px;
        }
      }
      .product-desc {
        .product-name {
          margin-bottom: 9px;
        }
      }
    }
    &.desktop-grid-4-card {
      .image-container {
        .wishlist-wrapper {
          top: 8px;
          right: 8px;
        }
        .badge {
          left: 8px;
          top: 13px;
        }
        .review {
          right: 12px;
          bottom: 12px;
        }
        .extension {
          left: 12px;
          bottom: 12px;
        }
      }
      .product-desc {
        .product-name {
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style>
