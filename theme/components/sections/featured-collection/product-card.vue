<template>
  <fdk-link
    :link="`/product/${product.slug}`"
    v-if="product"
    class="product-card"
  >
    <div class="img">
      <emerge-image
        v-if="product && product.medias[0]"
        :src="product.medias.length > 0 ? product.medias[0].url : ''"
        :alt="product.name"
        :mobileAspectRatio="mobileAspectRatio"
        :aspectRatio="aspectRatio"
        :class="imgFill ? 'streach' : ''"
        :bgColor="bgColor"
        :style="dynamicStyles"
        :sources="[
          { breakpoint: { min: 1024 }, width: 350 },
          { breakpoint: { min: 768 }, width: 250 },
          { breakpoint: { min: 481 }, width: 270 },
          { breakpoint: { max: 390 }, width: 250 },
        ]"
      />
    </div>
    <div class="details">
      <div
        :class="[
          'title',
          `${checkBannerScrollView ? 'b2' : 'h4'}`,
          'font-body',
          { 'left-aligned-text': checkBannerScrollView },
        ]"
        :title="product.name"
      >
        {{ product.name }}
      </div>
      <div :class="['price', { 'left-aligned-text': checkBannerScrollView }]">
        <span
          :class="[`${checkBannerScrollView ? 'h5' : 'b2'}`, 'font-body']"
          v-if="product.price.effective"
          >{{
            getListingPrice(product, "effective") ||
            getProductPrice(product, "effective")
          }}</span
        >
        <span
          class="listing-price caption-normal font-body"
          v-if="
            getProductPrice(product, 'effective') !==
            getProductPrice(product, 'marked')
          "
          >{{
            getListingPrice(product, "marked") ||
            getProductPrice(product, "marked")
          }}</span
        >
      </div>
    </div>
  </fdk-link>
</template>

<script>
import EmergeImage from "../../../global/components/common/emerge-image.vue";
import { currencyFormat } from "../../../helper/utils";

export default {
  components: {
    "emerge-image": EmergeImage,
  },
  props: {
    product: {
      type: Object,
      default: () => {
        return {};
      },
    },
    aspectRatio: {
      type: Number,
      default: 1,
    },
    mobileAspectRatio: {
      type: Number,
      default: 1,
    },
    checkBannerScrollView: {
      type: Boolean,
      default: false,
    },
    imgFill: {
      type: String,
      default: "",
    },
    bgColor: {
      type: String,
      default: "#FFFFFF",
    },
  },
  computed: {
    dynamicStyles() {
      return {
        "--bg-color": `${this.bgColor}`,
      };
    },
  },
  methods: {
    getListingPrice(product, key) {
      let price = "";
      const priceDetails = product.price[key];

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
          //not handling this as its the default behaviour of getProductPrice
          break;
        default:
          break;
      }
      return price;
    },
    getProductPrice(product, key) {
      if (product.price) {
        const priceDetails = product.price[key];

        return priceDetails.min !== priceDetails.max
          ? currencyFormat(priceDetails.min, priceDetails.currency_symbol) +
              " - " +
              currencyFormat(priceDetails.max, priceDetails.currency_symbol)
          : currencyFormat(priceDetails.min, priceDetails.currency_symbol);
      }
      return "";
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .image-wrapper {
  @media @desktop {
    transition: transform 0.3s;
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.product-card {
  @media @desktop {
    &:hover {
      /deep/ .image-wrapper {
        transform: scale(1.1);
      }
    }
  }

  .img {
    transition: all 0.4s;
    border-radius: @ImageRadius;
    background: @White;
    overflow: hidden;
    -webkit-mask-image: -webkit-radial-gradient(white, black); //safari fix
  }

  .details {
    box-sizing: border-box;
    margin-top: 24px;

    @media @tablet {
      margin: 24px 0 16px;
    }
    .title {
      text-align: center;

      /** Text ellipsis */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .price {
      .listing-price {
        text-decoration: line-through;
        margin-left: 8px;
        color: @TextLabel;
      }
    }
  }
}

.left-aligned-text {
  text-align: left !important;
}

::v-deep .streach {
  img {
    object-fit: cover !important;
    height: 100% !important;
  }
  picture {
    background-color: var(--bg-color) !important;
  }
}
</style>
