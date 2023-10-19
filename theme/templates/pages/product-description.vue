<template>
  <pdp-skeleton v-if="showShimmer" />
  <div class="main-container font-body" v-else>
    <bread-crumb
      :context="context"
      :page_config="page_config"
      class="is-desktop"
    />
    <div
      class="product-desc-container"
      v-if="context && context.product && context.product.medias"
    >
      <div class="left">
        <image-gallery
          :images="getMedias"
          :product="context.product"
          :iconColor="getPageConfigValue(page_config, 'icon_color')"
          :global_config="global_config"
        />
      </div>
      <div class="right">
        <div class="product">
          <bread-crumb
            :context="context"
            :page_config="page_config"
            class="is-mobile"
          />
          <h1 class="product__title h2 font-header">
            {{ context.product.name }}
          </h1>
          <div class="product__price">
            <span
              class="mrp-label mrp-label--effective"
              style="marginleft: 0"
              v-if="
                getPageConfigValue(page_config, 'mrp_label') &&
                getProductPrice('effective') === getProductPrice('marked')
              "
            >
              MRP:
            </span>
            <h4 class="product__price--effective">
              {{ getProductPrice("effective") }}
            </h4>
            <span
              class="mrp-label mrp-label--marked"
              v-if="
                getPageConfigValue(page_config, 'mrp_label') &&
                getProductPrice('effective') !== getProductPrice('marked')
              "
            >
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
            v-if="getPageConfigValue(page_config, 'tax_label')"
            class="caption-normal tax-label"
          >
            {{ getPageConfigValue(page_config, "tax_label") }}
          </div>

          <div
            v-if="
              getReviewRatingInfo.avg_ratings ||
              getReviewRatingInfo.review_count
            "
            class="review-rating-container"
          >
            <div v-if="getReviewRatingInfo.avg_ratings" class="rating-wrapper">
              <span class="b1">{{ getReviewRatingInfo.avg_ratings }}</span>
              <svg-wrapper :svg_src="'star'" class="rating-icon" />
            </div>
            <div
              v-if="
                getReviewRatingInfo.avg_ratings &&
                getReviewRatingInfo.review_count
              "
              class="separator"
            >
              &nbsp;
            </div>
            <div
              v-if="getReviewRatingInfo.review_count"
              class="review-wrapper caption-normal"
            >
              {{
                getReviewRatingInfo.review_count +
                ` Review${getReviewRatingInfo.review_count > 1 ? "s" : ""}`
              }}
            </div>
          </div>

          <!-- Extension Slot (Below Price Component) -->
          <fdk-extension
            v-if="getTemplates('below_price_component').length"
            :templates="getTemplates('below_price_component')"
          />

          <p
            v-if="context.product && context.product.short_description"
            class="b2 font-body short-description"
          >
            {{ context.product.short_description }}
          </p>

          <fdk-pdp-size-stores ref="sizeContainer">
            <template slot-scope="sellerData">
              <div class="bottom-spacing" v-if="showVariants || showSeller">
                <product-variants
                  v-if="showVariants"
                  :product="context.product"
                  :variants="context.product_variants.variants.variants"
                ></product-variants>
                <div class="seller-info font-body" v-if="showSeller">
                  <div class="store-seller caption-normal">
                    <span class="sold-by-label">Seller :</span>
                    <div
                      :class="[
                        'name-wrapper',
                        {
                          selectable: getPageConfigValue(
                            page_config,
                            'seller_store_selection'
                          ),
                        },
                      ]"
                      @click="onSellerClick(sellerData.loadStores)"
                    >
                      <p class="store-seller-name">
                        {{
                          `${
                            storeInfoSelected.seller &&
                            storeInfoSelected.seller.name
                              ? storeInfoSelected.seller.name
                              : ""
                          }`
                        }}
                      </p>
                      <span
                        v-if="store_count > 1"
                        class="caption-semi-bold other-sellers"
                        >&nbsp;&&nbsp;{{
                          `${store_count - 1} Other${
                            store_count > 2 ? "s" : ""
                          }`
                        }}
                      </span>
                      <svg-wrapper
                        v-if="
                          getPageConfigValue(
                            page_config,
                            'seller_store_selection'
                          )
                        "
                        :svg_src="'arrow-down'"
                        class="dropdown-arrow"
                      />
                    </div>
                  </div>
                  <store-modal
                    :is-open="showStoreModal"
                    :active-store-info="storeInfo"
                    :all_stores_info="all_stores_info"
                    :seller-data="sellerData"
                    :product-name="context.product.name"
                    @closedialog="toggleStoreSidebar"
                    @store-filter="updateStoreFilter"
                    @store-item-select="setStoreInfo"
                  ></store-modal>
                </div>
              </div>

              <div v-if="isSizeSelectionBlock" class="size-selection">
                <p class="b2 size-selection__label">
                  <span>Size :</span>
                  {{ selectedSize }}
                </p>
                <div class="size-selection__wrapper">
                  <div
                    v-for="(size, index) in getProductSizes"
                    :key="index"
                    class="b2 size-selection__block"
                    :class="{
                      'size-selection__block--disable': size.quantity === 0,
                      'size-selection__block--selectable': size.quantity !== 0,
                      'size-selection__block--selected':
                        selectedSize === size.display,
                    }"
                    :title="size.display"
                    @click="onSizeSelection(size, sellerData)"
                  >
                    {{ size.display }}
                    <svg v-if="size.quantity === 0">
                      <line x1="0" y1="100%" x2="100%" y2="0" />
                    </svg>
                  </div>
                </div>
              </div>

              <template
                v-if="getPageConfigValue(page_config, 'show_size_guide')"
              >
                <button
                  @click="showSizeGuide = true"
                  class="product__size--guide button-font font-body"
                  v-if="
                    (context.product_meta.size_chart &&
                      context.product_meta.size_chart.sizes &&
                      context.product_meta.size_chart.sizes.length > 0) ||
                    true
                  "
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
              </template>

              <div class="size-cart-container" ref="addToCartBtn1">
                <div
                  v-if="isSizeSelectionDropdown"
                  class="size-wrapper"
                  v-click-outside="closeSizeDropdown"
                >
                  <button
                    :class="[
                      'size-button',
                      'flex-align-center',
                      'justify-between',
                      'font-body',
                      {
                        'disabled-button': !(
                          getProductSizes && getProductSizes.length
                        ),
                      },
                    ]"
                    @click="showSizeDropdown = !showSizeDropdown"
                    :disabled="!(getProductSizes && getProductSizes.length)"
                  >
                    <p
                      class="button-font selected-size"
                      :title="
                        selectedSize ? `Size : ${selectedSize}` : 'SELECT SIZE'
                      "
                    >
                      {{
                        selectedSize ? `Size : ${selectedSize}` : "SELECT SIZE"
                      }}
                    </p>
                    <svg-wrapper
                      :svg_src="'arrow-down'"
                      :class="[
                        'dropdown-arrow',
                        { 'rotate-arrow': showSizeDropdown },
                      ]"
                    />
                  </button>
                  <ul class="size-dropdown" v-show="showSizeDropdown">
                    <li
                      v-for="(size, index) in getProductSizes"
                      :key="index"
                      @click="onSizeSelection(size, sellerData)"
                      :class="[
                        {
                          selected_size: selectedSize === size.display,
                        },
                        size.quantity === 0
                          ? 'disabled_size'
                          : 'selectable_size',
                      ]"
                    >
                      {{ size.display }}
                    </li>
                  </ul>
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
                    <button
                      v-else-if="
                        context.product_meta && !context.product_meta.sellable
                      "
                      disabled
                      class="button btn-primary not-available font-body"
                    >
                      PRODUCT NOT AVAILABLE
                    </button>
                  </template>
                </fdk-cart>
              </div>
            </template>
          </fdk-pdp-size-stores>

          <p class="u-error" v-if="sizeError">Select a size first</p>

          <fdk-cart>
            <template slot-scope="cart">
              <button
                class="button btn-primary buy-now font-body"
                @click="addProductForCheckout(cart, true)"
                v-if="
                  !getGlobalConfigValue('disable_cart') &&
                  context?.product_meta?.sellable
                "
              >
                <svg-wrapper :svg_src="'buy-now'" class="buy-now__icon" />
                BUY NOW
              </button>
            </template>
          </fdk-cart>
          <mobile-addtocart
            v-if="isCartBtnSticky"
            :context="context"
            :global_config="global_config"
            :page_config="page_config"
            :productSizes="getProductSizes"
            :getProductPrice="getProductPrice"
            :onSizeSelection="onSizeSelection"
            :selectedSize="selectedSize"
            :addProductForCheckout="addProductForCheckout"
          />
          <!--Delivery Info-->
          <delivery-info
            ref="deliveryInfo"
            v-if="showUserPincodeModal || storeInfo"
            :showUserPincodeModal="showUserPincodeModal"
            :storeInfo="storeInfo"
            :id="getCategoryId"
            @pincodeChanged="onPincodeChanged($event)"
            @hideTatError="onHideTatError"
            :pincode="pincode"
            :selectPincodeError="selectPincodeError"
            @disableSelectPincodeError="disableSelectPincodeError"
            @onPincodeError="onPincodeError"
            @hidePincodeError="hidePincodeError"
            :showError="showPincodeError"
            :errMessage="pincodeErrorMsg"
            @changeCurrentPincodeValue="changeCurrentPincodeValue"
          ></delivery-info>
          <compare-action-modal
            v-if="showCompareActionModal"
            :compare_slugs="context.compare_slugs"
            :compare_msg="compareMsg"
            :product_uid="context.product.slug"
            :global_config="global_config"
            @hide-compare-action-modal="hideCompareModal"
            :addProductForCheckout="addProductForCheckout"
          ></compare-action-modal>
          <div class="book-appt-n-compare">
            <!-- <fdk-compare-action
              v-if="page_config && page_config.props.add_to_compare"
            >
              <template slot-scope="compare">
                <div
                  class="compare-container compare-text"
                  @click="
                    addCompareProducts(compare.addCompare, context.product.slug)
                  "
                >
                  <div class="compare-icon">
                    <svg-wrapper
                      :svg_src="'compare-icon'"
                      class="compare-icon"
                    ></svg-wrapper>
                  </div>
                  <p>Add to Compare</p>
                </div>
              </template>
            </fdk-compare-action> -->
          </div>

          <ul class="product-detail font-body">
            <template
              v-if="getPageConfigValue(page_config, 'return') && returnConfig"
            >
              <li v-if="returnConfig.returnable" class="b2">
                {{ `${returnConfig.time} ${returnConfig.unit}` }} return
              </li>
              <li v-else-if="returnConfig.returnable === false" class="b2">
                No return available on this product
              </li>
            </template>
            <li v-if="getManufacturingTime" class="b2">
              Shipping within
              {{
                `${getManufacturingTime.manufacturing_time} ${getManufacturingTime.manufacturing_time_unit}`
              }}
            </li>
            <li
              v-if="
                getPageConfigValue(page_config, 'item_code') &&
                context.product &&
                context.product.item_code
              "
              class="b2"
            >
              Item code : {{ context.product.item_code }}
            </li>
          </ul>

          <badges :page_config="page_config" />

          <!-- Extension Slot (Below Product Info) -->
          <fdk-extension
            v-if="getTemplates('below_product_info').length"
            :templates="getTemplates('below_product_info')"
            class="top-spacing"
          />
        </div>
      </div>
    </div>

    <product-desc :product="context.product" :page_config="page_config" />

    <!-- Extension Slot (Bottom of Product description) -->
    <fdk-extension
      v-if="getTemplates('product_description_bottom').length"
      :templates="getTemplates('product_description_bottom')"
    />
    <toast :id="'pdp'" ref="pdpToast" :content="toast_message"></toast>
  </div>
</template>
<!-- #region  -->

<settings>
{
  "props": [
    {
      "type": "checkbox",
      "id": "seller_store_selection",
      "label": "Seller Store Selection",
      "default": true
    },
   
    {
      "type": "checkbox",
      "id": "show_seller",
      "label": "Show Seller",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "return",
      "label": "Return",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "item_code",
      "label": "Show Item code",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "product_details_bullets",
      "label": "Show Bullets in Product Details",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "show_size_guide",
      "label": "Show Size Guide",
      "default": true
    },
    {
      "type": "color",
      "id": "icon_color",
      "label": "Play video icon color",
      "default": "#D6D6D6"
    },
    {
      "type": "checkbox",
      "id": "mrp_label",
      "label": "Display MRP label text",
      "default": true
    },
    {
      "type": "text",
      "id": "tax_label",
      "label": "Price tax label text",
      "default": "Price inclusive of all tax"
    },
    {
      "type": "checkbox",
      "id": "mandatory_pincode",
      "label": "Mandatory Pincode",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "hide_single_size",
      "label": "Hide single size",
      "default": false
    },
    {
      "type": "checkbox",
      "id": "preselect_size",
      "label": "Preselect size",
      "info": "Applicable only for multiple-size products",
      "default": true
    },
    {
      "type": "radio",
      "id": "size_selection_style",
      "label": "Size selection style",
      "default": "dropdown",
      "options": [
        {
          "value": "dropdown",
          "text": "Dropdown style"
        },
        {
          "value": "block",
          "text": "Block style"
        }
      ]
    },
    {
      "type": "checkbox",
      "id": "show_products_breadcrumb",
      "label": "Show Products breadcrumb",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "show_category_breadcrumb",
      "label": "Show Category breadcrumb",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "show_brand_breadcrumb",
      "label": "Show Brand breadcrumb",
      "default": true
    },
    {
      "type": "extension",
      "id": "extension",
      "label": "Extension Positions",
      "info": "Handle extension in these positions",
      "positions": [
        {
          "value": "below_price_component",
          "text": "Below Price Component"
        },
        {
          "value": "below_product_info",
          "text": "Below Delivery location"
        },
        {
          "value": "product_description_bottom",
          "text": "Below Product Description"
        }
      ],
      "default": {}
    },
    {
      "type": "image_picker",
      "id": "badge_logo_1",
      "label": "Badge logo 1",
      "default": "",
      "options": {
        "aspect_ratio": "1:1",
        "aspect_ratio_strict_check": true
      }
    },
    {
      "type": "text",
      "id": "badge_label_1",
      "label": "Badge label 1",
      "default": ""
    },
    {
      "type": "url",
      "id": "badge_url_1",
      "label": "Badge URL 1",
      "default": ""
    },
    {
      "type": "image_picker",
      "id": "badge_logo_2",
      "label": "Badge logo 2",
      "default": "",
      "options": {
        "aspect_ratio": "1:1",
        "aspect_ratio_strict_check": true
      }
    },
    {
      "type": "text",
      "id": "badge_label_2",
      "label": "Badge label 2",
      "default": ""
    },
    {
      "type": "url",
      "id": "badge_url_2",
      "label": "Badge URL 2",
      "default": ""
    },
    {
      "type": "image_picker",
      "id": "badge_logo_3",
      "label": "Badge logo 3",
      "default": "",
      "options": {
        "aspect_ratio": "1:1",
        "aspect_ratio_strict_check": true
      }
    },
    {
      "type": "text",
      "id": "badge_label_3",
      "label": "Badge label 3",
      "default": ""
    },
    {
      "type": "url",
      "id": "badge_url_3",
      "label": "Badge URL 3",
      "default": ""
    },
    {
      "type": "image_picker",
      "id": "badge_logo_4",
      "label": "Badge logo 4",
      "default": "",
      "options": {
        "aspect_ratio": "1:1",
        "aspect_ratio_strict_check": true
      }
    },
    {
      "type": "text",
      "id": "badge_label_4",
      "label": "Badge label 4",
      "default": ""
    },
    {
      "type": "url",
      "id": "badge_url_4",
      "label": "Badge URL 4",
      "default": ""
    },
    {
      "type": "image_picker",
      "id": "badge_logo_5",
      "label": "Badge logo 5",
      "default": "",
      "options": {
        "aspect_ratio": "1:1",
        "aspect_ratio_strict_check": true
      }
    },
    {
      "type": "text",
      "id": "badge_label_5",
      "label": "Badge label 5",
      "default": ""
    },
    {
      "type": "url",
      "id": "badge_url_5",
      "label": "Badge URL 5",
      "default": ""
    }
  ]
}
</settings>
<!-- #endregion -->

<script>
import { isBrowser } from "browser-or-node";

import sizeguide from "../../components/size-guide.vue";
import toast from "../../components/common/toast.vue";
import productVariants from "../../components/product-description/product-variants.vue";
import BreadCrumb from "../../components/product-description/breadcrumb.vue";
import imageGallery from "../../components/product-description/image-gallery.vue";
import deliveryInfo from "../../components/product-description/delivery-info.vue";
import productDesc from "../../templates/components/product-description/product-desc.vue";
import SvgWrapper from "../../components/common/svg-wrapper.vue";
import StoreModal from "../../components/product-description/store/store-modal.vue";
import PdpSkeleton from "../../global/components/skeletons/pdp-skeleton.vue";
import {
  getGlobalConfigValue,
  getPageConfigValue,
  getReviewRatingData,
  detectMobileWidth,
  currencyFormat,
} from "../../helper/utils";
import Badges from "../../components/product-description/badges.vue";
import stickyAddtocart from "../../components/product-description/sticky-addtocart.vue";
import compareActionModalVue from "./../../global/components/compare-action-modal.vue";

export default {
  components: {
    "size-guide": sizeguide,
    "product-variants": productVariants,
    "image-gallery": imageGallery,
    "delivery-info": deliveryInfo,
    "product-desc": productDesc,
    "svg-wrapper": SvgWrapper,
    "pdp-skeleton": PdpSkeleton,
    "store-modal": StoreModal,
    "bread-crumb": BreadCrumb,
    "mobile-addtocart": stickyAddtocart,
    "compare-action-modal": compareActionModalVue,
    badges: Badges,
    toast,
  },
  props: {
    context: {},
    page_config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mounted() {
    console.log("Categories=>", this.context);
    this.observer = new IntersectionObserver(this.onAddToCartIntersection, {
      threshold: 1.0,
    });
    this.isMounted = true;
  },
  watch: {
    showSizeGuide(newValue) {
      if (newValue) {
        document.querySelector("body").style.overflow = "hidden";
      }
    },
    storeInfo() {
      this.storeInfoSelected = Object.assign(
        {},
        this.storeInfoSelected,
        this.storeInfo
      );
    },
    $route(to, from) {
      if (to.path != from.path) {
        (this.ladderPrices = null),
          (this.storeInfoSelected = {}),
          (this.storeInfo = null),
          (this.selectedSize = "");
      }
    },
    context: function (newValue) {
      if (!newValue?.product_meta?.loading) {
        this.showShimmer = false;
        this.$nextTick(() => {
          this.observer.observe(this.$refs.addToCartBtn1);
        });
      }

      if (
        !this.selectedSize &&
        !newValue.product?.loading &&
        !newValue.product_meta?.loading
      ) {
        this.preSizeSelect();
      }
    },
  },
  data() {
    return {
      selectedSize: "",
      showSizeGuide: false,
      sizeError: false,
      pincode: this.context.user_pincode || "",
      isMounted: false,
      toast_message: "",
      storeInfo: null,
      showProductRequestModal: false,
      showUserPincodeModal: "",
      message: "",
      showMessage: false,
      showCompareActionModal: false,
      compareMsg: {
        title: "",
      },
      storeInfoSelected: {},
      all_stores_info: null,
      store_count: null,
      showStoreModal: false,
      ladderPrices: null,
      activeLadderIndex: null,
      activeLadder: null,
      showSizeDropdown: false,
      selectPincodeError: false,
      showPincodeError: false,
      pincodeErrorMsg: "",
      currentPincodeValue: this.context?.user_pincode || "",
      showShimmer: true,
      observer: null,
      isCartBtnSticky: false,
    };
  },
  computed: {
    getProductSizes() {
      return this.context?.product_meta?.sizes || [];
    },
    getReviewRatingInfo() {
      const customMeta = this.context?.product?._custom_meta || [];

      return getReviewRatingData(customMeta);
    },
    getManufacturingTime() {
      const custom_order = this.context?.product?.custom_order;

      if (
        custom_order?.manufacturing_time &&
        custom_order?.manufacturing_time_unit
      ) {
        return custom_order;
      }

      return false;
    },

    returnConfig() {
      return this.storeInfo?.return_config;
    },
    cartItem() {
      return this.cartObj[this.context.product.uid]?.item;
    },
    cartObj() {
      let cartData = {};
      for (let ele = 0; ele < this.context?.bag_data?.items?.length; ele++) {
        cartData[this.context?.bag_data?.items[ele].product.uid] = {
          item: this.context?.bag_data?.items[ele],
        };
      }
      return cartData;
    },
    ladderOffers() {
      return this.ladderPrices?.available_offers[0]?.offer_prices;
    },
    getMedias() {
      let images = [];
      if (this.context?.product?.medias.length > 0) {
        return this.context?.product?.medias;
      } else {
        images.push({
          type: "image",
          url: require("../../assets/images/image-gallery-placeholder.png"),
          alt: "",
        });
        return images;
      }
    },

    getCategoryId() {
      let product = this.context.product;
      if (product.categories && product.categories.length) {
        return product.categories[0].id;
      }
      return "";
    },
    showVariants() {
      return this.context?.product_variants?.variants?.variants;
    },
    showSeller() {
      return (
        this.getPageConfigValue(this.page_config, "show_seller") &&
        this.storeInfoSelected?.store?.name
      );
    },
    showSize() {
      return !(
        this.getProductSizes.length === 1 &&
        this.getPageConfigValue(this.page_config, "hide_single_size") &&
        this.storeInfo &&
        !this.storeInfo.set
      );
    },
    isSizeSelectionBlock() {
      const sizeSelectionType = this.getPageConfigValue(
        this.page_config,
        "size_selection_style"
      );

      return sizeSelectionType === "block" && this.showSize;
    },
    isSizeSelectionDropdown() {
      const sizeSelectionType = this.getPageConfigValue(
        this.page_config,
        "size_selection_style"
      );

      return sizeSelectionType === "dropdown" && this.showSize;
    },
  },
  methods: {
    getReviewRatingData,
    getPageConfigValue,
    getGlobalConfigValue(id) {
      return getGlobalConfigValue(this.global_config, id);
    },
    closeSizeDropdown() {
      this.showSizeDropdown = false;
    },
    changeCurrentPincodeValue(value) {
      this.currentPincodeValue = value;
    },
    onSellerClick(loadStores) {
      if (this.getPageConfigValue(this.page_config, "seller_store_selection")) {
        this.toggleStoreSidebar();
        this.loadStoreFunction = loadStores;
        this.getStores(loadStores);
      }
    },
    toggleStoreSidebar() {
      this.showStoreModal = !this.showStoreModal;

      if (isBrowser && typeof document !== "undefined") {
        const classList = document.body?.classList;

        this.showStoreModal && classList
          ? classList.add("remove-scroll")
          : classList.remove("remove-scroll");
      }
    },
    getStores(loadStores) {
      let options = {
        strategy: this.storeCompanyFilter || "",
        slug: this.context.product.slug,
        size: 100,
        page: 1,
      };
      loadStores(options)
        .then((res) => {
          this.all_stores_info = res;
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    },
    setStoreInfo(store) {
      this.storeInfoSelected = Object.assign({}, this.storeInfoSelected, store);
      this.storeInfo = this.storeInfoSelected;
      this.toggleStoreSidebar();
    },
    // resetStoreInfo(checkPincode, pincodeAct) {
    //   this.storeInfo = null;
    //   this.storeInfoSelected = {};
    //   checkPincode(pincodeAct);
    // },
    updateStoreFilter(filtertype) {
      this.storeCompanyFilter = filtertype;
      this.getStores(this.loadStoreFunction);
    },
    getTemplates(position) {
      return this.page_config.props?.extension?.[position] || [];
    },
    getProductPrice(key) {
      if (this.storeInfo && this.storeInfo.price) {
        const { is_set } = this.storeInfo;
        if (is_set) {
          const pricePerPiece = this.storeInfo?.price_per_piece;
          return currencyFormat(
            pricePerPiece[key],
            pricePerPiece?.currency_symbol
          );
        }
        return currencyFormat(
          this.storeInfo.price[key],
          this.storeInfo.price.currency_symbol
        );
      }
      if (this.context.product_meta?.price) {
        const priceDetails = this.context.product_meta.price[key];

        return priceDetails.min !== priceDetails.max
          ? currencyFormat(priceDetails.min, priceDetails.currency_symbol) +
              " - " +
              currencyFormat(priceDetails.max, priceDetails.currency_symbol)
          : currencyFormat(priceDetails.max, priceDetails.currency_symbol);
      }
    },
    sizeClicked(loadSellers, currentPincode = null) {
      let updatedPincode =
        currentPincode === null ? this.pincode : currentPincode;

      let options = {
        size: this.selectedSize,
        slug: this.context.product.slug,
        pincode: updatedPincode,
      };

      return loadSellers(options)
        .then((res) => {
          if (res && Object.keys(res).length) {
            this.storeInfo = res;
            this.store_count = res.store?.count;
          } else {
            throw {};
          }

          return true;
        })
        .catch((err = {}) => {
          const defaultErrMessage = "Something went wrong";
          const errMessage = err?.message || "";
          this.storeInfo = null;
          this.storeInfoSelected = {};

          if (
            errMessage.includes("serviceable") ||
            errMessage.includes("pincode")
          ) {
            this.onPincodeError(err?.message || defaultErrMessage);
          } else {
            this.toast_message = defaultErrMessage;
            this.$refs.pdpToast.showToast("error", "toast-error");
          }

          return false;
        });
    },
    onSizeSelection(size, sellerData) {
      if (size.quantity === 0) {
        return;
      }

      this.selectedSize = size.display;
      this.showUserPincodeModal = true;

      this.sizeClicked(sellerData.loadSellers);
      this.sizeError = false;
      this.showSizeDropdown = false;
    },
    preSizeSelect() {
      const sizes = this.context?.product_meta?.sizes || [];
      const preselectSize = !!this.getPageConfigValue(
        this.page_config,
        "preselect_size"
      );

      if (sizes.length === 1 || (sizes.length > 1 && preselectSize)) {
        const firstAvailableSize = sizes.find((size) => size.is_available);

        if (firstAvailableSize) {
          this.$nextTick(() => {
            let self = this;

            self.onSizeSelection(firstAvailableSize, self.$refs?.sizeContainer);
          });
        }
      }
    },
    focusPincodeInput() {
      const deliveryPincodeRef =
        this.$refs?.deliveryInfo?.$refs?.deliveryPincode;

      if (deliveryPincodeRef) {
        deliveryPincodeRef?.focus();

        if (isBrowser && !detectMobileWidth()) {
          const offsetY =
            deliveryPincodeRef.getBoundingClientRect()?.top +
            window?.scrollY -
            window?.innerHeight / 4;

          window?.scrollTo({
            top: offsetY,
            behavior: "smooth",
          });
        }
      }
    },
    addToCart(cart, isBuyNow) {
      let addItemData = {
        items: [
          {
            item_id: this.context.product.uid,
            item_size: this.selectedSize,
            quantity: 1,
            article_assignment: this.storeInfo.article_assignment,
            seller_id: this.storeInfo.seller.uid,
            store_id: this.storeInfo.store.uid,
          },
        ],
        buy_now: isBuyNow,
        is_redirection: !isBuyNow,
      };

      cart
        .addToCart(addItemData)
        .then((data) => {
          if (data.success) {
            this.hidePincodeError();
            if (!isBuyNow) {
              if (this.$refs.carousel) {
                this.$refs.carousel.$el.style.visibility = "hidden";
              }
              this.toast_message = "Added to Cart!";
              this.$refs.pdpToast.showToast("success", "add-cart");
            } else {
              this.$router.push(
                `/cart/checkout?id=${data?.cart?.id}&buy_now=true`
              );
            }
          } else {
            throw data;
          }
        })
        .catch((err = {}) => {
          this.toast_message = err?.message || "Something went wrong";
          this.$refs.pdpToast.showToast("error", "toast-error");
        });
    },
    addProductForCheckout(cart, isBuyNow) {
      if (!this.selectedSize) {
        this.toast_message = "Please select the size";
        this.$refs.pdpToast.showToast("error", "toast-error");
        return;
      }

      if (this.currentPincodeValue) {
        if (this.showPincodeError) {
          //Can show toast error message here
          return;
        } else {
          const deliveryInfoRef = this.$refs?.deliveryInfo;
          const pdpPincodeRef = deliveryInfoRef.$refs?.pdpPincode;

          deliveryInfoRef.checkPincode(pdpPincodeRef).then((isValid) => {
            if (isValid) {
              this.addToCart(cart, isBuyNow);
            } else {
              //Can show toast error message here
            }
          });
        }
      } else {
        const isEmptyStoreInfo = !Object.keys(this.storeInfo || {}).length;

        if (this.getPageConfigValue(this.page_config, "mandatory_pincode")) {
          this.selectPincodeError = true;
          this.showPincodeError = false;
          this.focusPincodeInput();
          return;
        }

        if (isEmptyStoreInfo) {
          isBrowser && localStorage.removeItem("m_userPincode");

          this.sizeClicked(
            this.$refs?.sizeContainer?.loadSellers,
            this.currentPincodeValue
          ).then((isValid) => {
            if (isValid) {
              this.addToCart(cart, isBuyNow);
            }
          });
        } else {
          this.addToCart(cart, isBuyNow);
        }
      }
    },
    addCompareProducts(promiseFn, productUid) {
      if (this.context.compare_slugs.length <= 3) {
        promiseFn(productUid)
          .then((res) => {
            //todo
          })
          .catch((err) => {
            //show error
            this.compareMsg.title =
              "Select products from the same category for comparison" ||
              "Something went wrong";
            this.showCompareActionModal = true;
          });
      } else {
        //show popup max upto 3
        this.compareMsg.title = "You can only compare 4 products at a time";
        this.showCompareActionModal = true;
      }
    },
    hideCompareModal() {
      this.showCompareActionModal = false;
      this.compareMsg.title = "";
    },
    onPincodeChanged(event) {
      this.pincode = event;
      this.sizeClicked(this.$refs?.sizeContainer?.loadSellers);
    },
    onTatError(err) {
      this.message = err;
      this.showMessage = true;
    },
    onHideTatError() {
      this.message = "";
      this.showMessage = false;
    },
    disableSelectPincodeError(isDisable) {
      this.selectPincodeError = isDisable;
    },
    onPincodeError(err) {
      this.showPincodeError = true;
      this.pincodeErrorMsg = err;
    },
    hidePincodeError() {
      this.showPincodeError = false;
      this.pincodeErrorMsg = "";
    },
    onAddToCartIntersection(entries) {
      if (entries?.[0].isIntersecting) {
        this.isCartBtnSticky = false;
      } else {
        this.isCartBtnSticky = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.svg-wrapper {
  position: relative;
  width: 24px;
  height: 24px;
}

/deep/.product-details {
  margin-top: 20px;
  padding: 0 20px 20px 20px;
  h2 {
    text-align: center;
    padding: 20px 0;
    font-size: 1.5625rem;
    font-weight: 600;
  }
  .product-long-description {
    line-height: 20px;
    font-size: 14px;
    overflow-wrap: break-word;
    b {
      font-weight: 700;
      margin-top: 25px;
      display: block;
    }
    br {
      content: "";
      display: block;
      margin-bottom: 10px;
    }
    p {
      margin-bottom: 10px;
      line-height: 20px;
      img {
        margin: 10px 0;
      }
    }
    video {
      max-width: 100% !important;
    }
  }
}

.main-container {
  padding: 1rem 2.5rem 0;
  color: @TextBody;

  .is-desktop {
    display: block;

    @media @tablet {
      display: none;
    }
  }
  .is-mobile {
    display: block;

    @media @desktop {
      display: none;
    }
  }

  @media @tablet {
    padding: 0;
    margin-top: 0;
  }
  .product-desc-container {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    @media @tablet {
      flex-direction: column;
    }
    .left {
      width: 58.18%;
      margin-right: 40px;

      @media @tablet {
        width: 100%;
        box-sizing: border-box;
      }
    }
    .right {
      width: 41.82%;
      box-sizing: border-box;
      position: relative;

      @media @tablet {
        width: 100%;
        box-sizing: border-box;
      }

      .preview {
        display: none;
        position: absolute;
        z-index: 1;
        margin-top: 15px;
        width: 100%;
      }
      .product {
        @media @mobile {
          padding: 0 1rem;
        }
        @media @tablet-strict {
          padding: 0 1.5rem;
        }

        &__title {
          line-height: 43px;

          @media @tablet {
            line-height: 37px;
            margin-top: 8px;
          }
        }

        .tax-label {
          color: @TextDisabled;
          margin-top: 2px;
          margin-bottom: 24px;

          @media @desktop {
            margin-bottom: 16px;
          }
        }

        .review-rating-container {
          background-color: @ThemeAccentL4;
          border-radius: 4px;
          display: flex;
          width: fit-content;
          align-items: center;
          padding: 4.5px 10px;
          margin: 16px 0 24px;

          @media @tablet {
            margin: 24px 0;
          }

          .rating-wrapper {
            display: flex;
            align-items: center;

            .rating-icon {
              width: 14px;
              height: 14px;
              margin-left: 4px;

              /deep/ svg path {
                fill: @ThemeAccentD2;
              }
            }
          }

          .separator {
            border-left: 1px solid @DividerStokes;
            height: 100%;
            margin: 0 6px;
            width: 1px;
          }

          .review-wrapper {
            color: @TextLabel;
          }
        }
        &__price {
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
            color: var(--textLabel, #7d7676);
            font-weight: 400;
            font-size: 12px;
            line-height: 14px;
            letter-spacing: -0.02em;
            &--effective {
              margin-right: 4px;
            }
            &--marked {
              margin-left: 0.25rem;
            }
          }
        }

        &__size {
          &--guide {
            cursor: pointer;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            border: none;
            color: @ButtonPrimary;
            background-color: transparent;

            span {
              margin-right: 2px;
            }

            .scale-icon {
              width: 25px;
              height: 12px;
            }
          }
        }
      }
    }
  }
}

.size-cart-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;

  .size-wrapper {
    position: relative;
    flex: 1;
    margin-right: 12px;
    max-width: 33.33%;

    @media @tablet {
      margin-right: 8px;
    }

    .size-button {
      padding: 11px 16px;
      border: 0.8px solid @DividerStokes;
      border-radius: @ButtonRadius;
      background-color: @White;
      width: 100%;
      height: 100%;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      color: @TextHeading;

      @media @tablet {
        font-size: 12px;
        line-height: 14px;
      }

      .selected-size {
        text-align: left;
        color: @TextHeading;
        border-radius: unset;
        .text-line-clamp();
      }

      .dropdown-arrow {
        height: 24px;
        width: 24px;
        flex: 0 0 24px;
      }

      .rotate-arrow {
        transform: rotate(180deg);
      }
    }
    .disabled-button {
      color: @TextDisabled;
    }
    .size-dropdown {
      position: absolute;
      background-color: @DialogBackground;
      top: 100%;
      min-width: 100%;
      white-space: nowrap;
      border: 1px solid #d4d1d1;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15),
        0px 12px 16px rgba(0, 0, 0, 0.16);
      border-radius: 8px;
      padding: 0.5rem;
      z-index: 1;

      li {
        padding: 8px 12px;
        border-radius: 4px;
      }

      .selected_size {
        background-color: @ThemeAccentL3;
      }

      .disabled_size {
        text-decoration-line: line-through;
        color: @TextDisabled;
      }

      .selectable_size {
        cursor: pointer;

        &:hover {
          background-color: @ThemeAccentL3;
        }
      }
    }
  }

  .cart-wrapper {
    flex: 2;

    .add-to-cart {
      padding: 19px !important;

      @media @desktop {
        &:hover {
          /deep/ svg path {
            fill: @ButtonSecondary !important;
          }
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
    }

    .not-available {
      background-color: @ButtonPrimaryL3;
      cursor: unset;
    }
  }
}

.button {
  width: 100%;
  text-transform: uppercase;
  padding: 20px;
  cursor: pointer;
  transition: all 0.4s;
  border: 0.8px solid @DividerStokes;
  border-radius: @ButtonRadius;

  @media @tablet {
    padding: 16px;
  }
}

.buy-now {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: unset;

  &__icon {
    width: 11px;
    height: 14px;
    margin-right: 6.83px;

    /deep/ svg path {
      fill: @ButtonSecondary !important;
    }
  }

  @media @tablet {
    margin-top: 8px;
  }
}

.compare-container {
  display: flex;
  padding: 12px 32px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: fit-content;
  border-radius: 4px;
  border: 0.8px solid @DividerStokes;
  color: @ButtonPrimary;
  background: @ButtonSecondary;
  margin: 24px 0;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.28px;
  text-transform: uppercase;
  cursor: pointer;
  @media @tablet {
    margin: 16px 0 32px 0;
    font-size: 12px;
    letter-spacing: -0.24px;
  }
}
.mt-2 {
  margin-top: 2rem;
}

.top-spacing {
  margin-top: 24px;
}

.product-detail {
  list-style: outside;
  padding-left: 1rem;
  margin-top: 24px;

  @media @tablet {
    margin-top: 32px;
  }
}

.seller-info {
  line-height: 20px;
  margin-top: 24px;

  .store-seller {
    display: flex;
    align-items: center;

    .sold-by-label {
      white-space: nowrap;
    }

    .selectable {
      border-bottom: 1px solid @TextBody;
      cursor: pointer;
    }

    .name-wrapper {
      display: flex;
      align-items: center;
      margin-left: 5px;
      overflow: hidden;

      .store-seller-name {
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .other-sellers {
        white-space: nowrap;
      }

      .dropdown-arrow {
        height: 12px;
        width: 12px;
        margin-left: 2px;

        /deep/ svg {
          width: 12px;
          height: 12px;
        }
      }
    }
  }
}

.bottom-spacing {
  margin-bottom: 24px;

  @media @tablet {
    margin-bottom: 32px;
  }
}

.short-description {
  margin: 24px 0;
}

/deep/ .toast {
  text-transform: unset;
}

.size-selection {
  margin: 24px 0;

  &__label {
    margin-bottom: 12px;

    span {
      font-weight: bold;
    }
  }

  &__wrapper {
    display: flex;
    flex-wrap: wrap;
    .grid-gap(8px);
  }

  &__block {
    border-radius: 4px;
    border: 1px solid @DividerStokes;
    padding: 6px 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    position: relative;

    &--selected {
      background-color: @ThemeAccent;
    }

    &--selectable {
      cursor: pointer;
    }

    &--disable {
      cursor: default;
      color: @TextDisabled;
    }

    svg {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      line {
        stroke: @DividerStokes;
        stroke-width: 1;
      }
    }
  }
}
</style>
