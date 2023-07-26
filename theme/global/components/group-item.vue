<template>
  <div :class="['card-item', 'group-item-box', cardtype]" :title="getTitle">
    <fdk-link class="display-block" :action="card.action">
      <emerge-image
        :src="getImageURL"
        :aspectRatio="0.8"
        :mobileAspectRatio="0.8"
        :global_config="global_config"
        class="card-img"
        :sources="[
          { breakpoint: { min: 768 }, width: 400 },
          { breakpoint: { max: 767 }, width: 360 },
        ]"
      />
      <div
        class="card-desc flex-align-center"
        :class="{
          'emerge-center':
            cardtype === 'COLLECTIONS' || cardtype === 'CATEGORIES',
        }"
      >
        <div class="card-logo" v-if="cardtype === 'BRANDS'">
          <emerge-image
            :src="getCardLogo"
            :aspectRatio="1"
            :mobileAspectRatio="1"
            :sources="[{ width: 60 }]"
          />
        </div>
        <h5 class="title font-body" :class="{ b1: cardtype === 'BRANDS' }">
          {{ card.name }}
        </h5>
      </div>
    </fdk-link>
  </div>
</template>
<style lang="less" scoped>
.card-item {
  position: relative;
  border-radius: @ImageRadius;
  -webkit-mask-image: -webkit-radial-gradient(white, black); //safari fix

  overflow: hidden;
  &:hover {
    .card-img {
      transform: scale(1.1);
    }
  }
  .card-img {
    transition: 300ms transform cubic-bezier(0, 0, 0.2, 1);
  }
  .card-desc {
    padding: 7px 12px;
    border-radius: @ButtonRadius;
    justify-content: center;
    background: @ThemeAccentL5;
    border: 1px solid @DividerStokes;
    position: absolute;
    bottom: 12px;
    left: 12px;
    right: 12px;
    @media @desktop {
      padding: 14px;
      bottom: 24px;
      left: 43px;
      right: 43px;
    }
    &:hover {
      background: @ThemeAccentL3;
    }
    .title {
      text-transform: capitalize;
      text-align: center;
      .text-line-clamp();
      color: @TextBody;
    }
  }
  &.BRANDS {
    .card-desc {
      justify-content: center;
      .column-gap(16px);
      border-radius: @ButtonRadius;
      padding: 15px 27px 15px 15px;
      @media @desktop {
        bottom: 12px;
        left: 12px;
        right: 12px;
      }
      .title {
        color: @TextHeading;
        text-align: left;
        @media @tablet-strict {
          .text-line-clamp(2);
        }
      }
      .card-logo {
        ::v-deep picture {
          background-color: transparent;
        }
        ::v-deep .fy__img {
          max-height: 35px;
          @media @desktop {
            max-height: 31px;
          }
        }
        .image-wrapper {
          position: static;
          &::before {
            content: unset;
          }
          & > ::v-deep * {
            all: revert;
          }
        }
      }
    }
  }
}
</style>

<script>
import placeholderImage from "./../../assets/images/placeholder.png";
import emergeImage from "../../global/components/common/emerge-image.vue";
import { currencyFormat } from "../../helper/utils";
const placeholder = require("../../assets/images/placeholder1X1.png");

export default {
  name: "groupItem",
  components: {
    "emerge-image": emergeImage,
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
    cardtype: {
      type: String,
      enum: ["BRANDS", "CATEGORIES", "COLLECTIONS", "WISHLIST", "PRODUCT"],
    },
    global_config: {},
  },
  computed: {
    getTitle() {
      let title = this.card.name;
      if (this.card.product_name) {
        title += " " + this.card.product_name;
      }
      return title;
    },
    getCardLogo() {
      return this.card.logo?.url || placeholder;
    },
    getImageURL() {
      let imageURL = this.card.medias
        ? this.card.medias.url
        : Array.isArray(this.card.medias)
        ? this.card.medias[0].url
        : "";

      if (this.cardtype === "COLLECTIONS") {
        imageURL = this.card.banners.portrait.url;
      }
      if (this.cardtype === "BRANDS" && this.card.banners) {
        imageURL = this.card.banners.portrait.url;
      }
      if (this.cardtype === "CATEGORIES" && this.card.banners) {
        imageURL = this.card.banners.portrait.url;
      }
      return imageURL;
    },
    generateLink() {
      if (this.cardtype === "COLLECTIONS") {
        return "/collection/" + this.card.slug;
      }
      if (this.cardtype === "PRODUCT") {
        return "/product/" + this.card.slug;
      }
      if (this.cardtype === "BRANDS") {
        return "/products/?brand=" + this.card.slug;
      }
      return "/products/?" + this.card.slug;
    },
  },
  methods: {
    getProductPrice(key) {
      if (this.card.price) {
        const priceDetails = this.card.price[key];

        return priceDetails.min !== priceDetails.max
          ? currencyFormat(priceDetails.min, priceDetails.currency_symbol) +
              " - " +
              currencyFormat(priceDetails.max, priceDetails.currency_symbol)
          : currencyFormat(priceDetails.min, priceDetails.currency_symbol);
      }
      return "";
    },
    generateQuery() {
      let strQuery = "";
      for (let key in this.card.action.query) {
        for (let i = 0; i < this.card.action.query[key].length; i++) {
          strQuery += key + "=" + this.card.action.query[key][i] + "&";
        }
      }
      return strQuery;
    },
    validateCardType() {
      return (
        this.cardtype !== "BRANDS" &&
        this.cardtype !== "COLLECTIONS" &&
        this.cardtype !== "CATEGORIES"
      );
    },
    replaceByDefault(e) {
      e.target.src = placeholderImage;
    },
  },
};
</script>
