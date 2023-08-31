<template>
  <div
    v-if="
      !getGlobalConfigValue('disable_cart') && context?.product_meta?.sellable
    "
    class="sticky-addtocart"
  >
    <button
      class="button btn-secondary flex-center add-to-cart font-body"
      @click="openSizeModal"
    >
      <svg-wrapper :svg_src="'cart'" class="cart-icon" />
      ADD TO CART
    </button>
    <modal-component
      :isOpen="isSizeModalOpen"
      :title="'Select Size'"
      @closedialog="closeSizeModal"
      class="custom-modal"
      ><div>
        <div class="size-guide">
          <span :style="`width:65%`">
            {{
              selectedSize ? `Style : Size (${selectedSize})` : "SELECT SIZE"
            }}</span
          >
          <div>
            <button
              @click="showSizeGuide = true"
              class="product__size--guide button-font font-body"
            >
              <span>SIZE GUIDE</span>
              <svg-wrapper :svg_src="'scale'" class="scale-icon" />
            </button>
            <size-guide
              class="size-guide"
              v-if="context.product_meta"
              :isOpen="showSizeGuide"
              :product_meta="context.product_meta"
              @closedialog="showSizeGuide = false"
            ></size-guide>
          </div>
        </div>
        <fdk-pdp-size-stores ref="sizeContainer">
          <template slot-scope="sellerData">
            <div class="sizes">
              <ul>
                <li
                  v-for="(size, index) in productSizes"
                  :key="index"
                  @click="onSizeSelection(size, sellerData)"
                  class="product__size"
                  :class="{
                    'product__size--selected': selectedSize === size.display,
                    'product__size--disabled': size.quantity === 0,
                  }"
                >
                  <span v-if="size.display.length < 15">{{
                    size.display
                  }}</span>
                  <span v-else>{{
                    size.display.substring(0, 15) + "..."
                  }}</span>
                </li>
              </ul>
            </div>
            <p class="u-error" v-if="sizeError">Select a size first</p>
          </template></fdk-pdp-size-stores
        >
      </div>
      <div class="price-block">
        <div class="product__price">
          <h4 class="product__price--effective">
            {{ getProductPrice("effective") }}
          </h4>
          <span class="mrp-label" v-if="getPageConfigValue('mrp_label')">
            MRP:
          </span>
          <span
            class="product__price--marked"
            v-if="getProductPrice('effective') !== getProductPrice('marked')"
          >
            {{ getProductPrice("marked") }}
          </span>
          <span
            class="product__price--discount"
            v-if="storeInfo && storeInfo.discount"
          >
            {{ storeInfo.discount }}
          </span>
        </div>
        <div
          v-if="getPageConfigValue('tax_label')"
          class="caption-normal tax-label"
        >
          {{ getPageConfigValue("tax_label") }}
        </div>
      </div>
      <fdk-cart class="cart-wrapper">
        <template slot-scope="cart">
          <button
            class="button btn-secondary flex-center add-to-cart font-body"
            @click="addProductForCheckout(cart, false)"
            v-if="
              !getGlobalConfigValue('disable_cart') &&
              context?.product_meta?.sellable
            "
          >
            <svg-wrapper :svg_src="'cart'" class="cart-icon" />
            ADD TO CART
          </button>
        </template>
      </fdk-cart>
    </modal-component>
  </div>
</template>

<script>
import { getGlobalConfigValue } from "../../helper/utils";
import svgWrapper from "../common/svg-wrapper.vue";
import modal from "../../global/components/modal.vue";
import { getPageConfigValue } from "../../helper/utils";
import sizeGuide from "../size-guide.vue";
export default {
  components: {
    "svg-wrapper": svgWrapper,
    "modal-component": modal,
    "size-guide": sizeGuide,
  },
  props: {
    context: {},
    global_config: {
      type: Object,
    },
    page_config: {
      type: Object,
    },
    productSizes: {
      type: Array,
    },
    getProductPrice: {
      type: Function,
    },
    selectedSize: {
      type: String,
    },
    onSizeSelection: {
      type: Function,
    },
    addProductForCheckout: {
      type: Function,
    },
  },
  mounted() {},
  watch: {},
  data() {
    return {
      isSizeModalOpen: false,
      showSizeGuide: false,
    };
  },
  computed: {},
  methods: {
    getGlobalConfigValue(id) {
      return getGlobalConfigValue(this.global_config, id);
    },
    getPageConfigValue(id) {
      return getPageConfigValue(this.page_config, id);
    },
    openSizeModal() {
      this.isSizeModalOpen = true;
    },
    closeSizeModal() {
      this.isSizeModalOpen = false;
    },
  },
};
</script>

<style lang="less" scoped>
.sticky-addtocart {
  padding: 16px;
  border-top: 1px solid @DividerStokes;
  background: @PageBackground;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  @media screen and (min-width: 481px) {
    display: none;
  }
}
.cart-icon {
  height: 14px;
  width: 13px;
  margin-right: 5px;

  /deep/ svg path {
    fill: @ButtonPrimary;
  }
}
.add-to-cart {
  padding: 12px 32px;
  border-radius: 4px;
  width: 100%;
}
.custom-modal {
  align-items: end !important;
  background: transparent;
  z-index: 63;
}
/deep/.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/deep/ .modal-container {
  width: 100% !important;
  border-radius: 8px 8px 0px 0px !important;
  padding: 24px !important;
  height: auto !important;
}
/deep/.modal-header {
  justify-content: space-between !important;
}
/deep/ .modal-title {
  margin: inherit !important;
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: -0.02em;
  text-align: left;
  color: @TextLabel;
}

.size-guide {
  display: flex;
  justify-content: space-between;
  color: @TextLabel;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.24px;
}
.scale-icon {
  width: 25px;
  height: 12px;
  margin-left: 2px;
}
.product__size--guide {
  cursor: pointer;
  display: flex;
  align-items: center;
  border: none;
  color: @ButtonPrimary;
  background-color: transparent;
}
.size-guide {
  margin-bottom: 8px;
}

ul {
  display: inline-flex;
  gap: 8px;
}
.product__price {
  font-size: 1rem;
  margin: 16px 0 2px;
  display: flex;
  align-items: center;

  @media @tablet {
    margin: 8px 0 2px;
  }

  &--effective {
    line-height: 23px;

    @media @tablet {
      line-height: 19px;
    }
  }

  &--marked {
    margin-left: 0.25rem;
    color: @TextLabel;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: -0.02em;
    text-decoration-line: line-through;
  }

  &--discount {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background-color: @SaleBadgeBackground;
    color: @SaleDiscountText;
    font-size: 12px;
    margin-left: 1rem;
    display: inline-block;

    @media @tablet {
      margin-left: 0.5rem;
    }
  }
  .mrp-label {
    margin-right: 4px;
    margin-left: 0.25rem;
    color: var(--textLabel, #7d7676);
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: -0.02em;
  }
}
.tax-label {
  color: @TextDisabled;
  margin-top: 2px;

  @media @desktop {
    margin-bottom: 16px;
  }
}
.sizes {
  width: 100%;
  overflow: scroll;
}
.sizes::-webkit-scrollbar {
  width: 0.5em;
}

.sizes::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.sizes {
  scrollbar-width: none;
}
.product__size {
  border-radius: 4px;
  display: flex;
  width: max-content;
  height: 40px;
  padding: 6px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: 1px solid @DividerStokes;
  &--selected {
    background-color: @ThemeAccentL3;
  }
  &--disabled {
    text-decoration-line: line-through;
    color: @TextDisabled;
  }
}
</style>
