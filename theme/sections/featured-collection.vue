<template>
  <div class="section-main-container" :style="dynamicStyles">
    <div class="image-container" :style="getFlexDirection">
      <fdk-link
        :link="getCollectionURL"
        class="banner-image"
        v-if="
          getSectionPropValue(settings, 'desktop_layout') ===
          'banner_horizontal_carousel'
        "
      >
        <emerge-image
          :class="
            getSectionPropValue(settings, 'img_fill')
              ? 'streach emerge-image'
              : 'emerge-image'
          "
          :src="getSrcBanner"
          :sources="[
            { breakpoint: { min: 1024 }, width: 700 },
            { breakpoint: { min: 768 }, width: 768 },
            { breakpoint: { min: 481 }, width: 481 },
            { breakpoint: { max: 390 }, width: 390 },
          ]"
          :aspectRatio="0.8"
          :mobileAspectRatio="0.8"
          :placeholder="''"
        />
      </fdk-link>

      <template>
        <div
          :style="getCarouselWidth"
          :class="['section-carousel', { 'pl-32': checkBannerScrollView }]"
        >
          <div
            :class="[
              'details-container',
              { 'left-aligned-text': checkBannerScrollView },
            ]"
          >
            <h2
              v-if="getSectionPropValue(settings, 'heading').length > 0"
              class="section-heading mb-16 font-header"
            >
              {{ getSectionPropValue(settings, "heading") }}
            </h2>

            <p
              class="section-description b-small font-body"
              :class="{ 'max-width': checkBannerScrollView }"
            >
              {{ getSectionPropValue(settings, "description") }}
            </p>
          </div>

          <fdk-link
            :link="getCollectionURL"
            class="mobile-banner-image"
            v-if="
              getSectionPropValue(settings, 'mobile_layout').includes('banner')
            "
          >
            <emerge-image
              :class="
                getSectionPropValue(settings, 'img_fill') ? 'streach' : ''
              "
              :src="bannerImage"
              :aspectRatio="0.8"
              :mobileAspectRatio="0.8"
              :showSkeleton="false"
            />
          </fdk-link>

          <div
            class="stacked-view-container"
            :style="getColumns"
            v-if="isMounted && showStackedView"
          >
            <div
              v-for="(product, index) in productsForStackedView"
              :key="index"
            >
              <ProductCard
                v-if="showFeatImage"
                :product="product"
                :mobileAspectRatio="getProductImgAspectRatio"
                :aspectRatio="getProductImgAspectRatio"
                :imgFill="getSectionPropValue(settings, 'img_fill')"
                :bgColor="getSectionPropValue(settings, 'img_container_bg')"
              />
            </div>
          </div>

          <template v-else-if="isMounted && showScrollView">
            <GlideCarousel
              class="side-spacing"
              :class="{
                'plr-72': checkHorizontalScrollView,
                'left-aligned-slides': checkBannerScrollView,
              }"
              :glideOptions="getGlideOptions"
              :hasArrows="true"
              :hasControls="showGlideBullets"
              :showCarouselArrows="!showGlideBullets"
              :showPerPage="true"
            >
              <GlideSlide
                v-for="(product, index) in productsForScrollView"
                :key="index"
              >
                <ProductCard
                  v-if="showFeatImage"
                  :product="product"
                  :mobileAspectRatio="getProductImgAspectRatio"
                  :aspectRatio="getProductImgAspectRatio"
                  :checkBannerScrollView="checkBannerScrollView"
                  :imgFill="getSectionPropValue(settings, 'img_fill')"
                  :bgColor="getSectionPropValue(settings, 'img_container_bg')"
                />
              </GlideSlide>
            </GlideCarousel>
          </template>

          <template v-else-if="isDemoBlock">
            <div :class="['side-spacing', 'defaultGrid']">
              <div v-for="index in 3" :key="index">
                <emerge-image
                  class="streach emerge-image"
                  :src="require('../assets/images/placeholder1X1.png')"
                  :sources="[
                    { breakpoint: { min: 1024 }, width: 350 },
                    { breakpoint: { min: 768 }, width: 250 },
                    { breakpoint: { min: 481 }, width: 270 },
                    { breakpoint: { max: 390 }, width: 250 },
                  ]"
                  :alt="index"
                  :aspectRatio="getProductImgAspectRatio"
                  :mobileAspectRatio="getProductImgAspectRatio"
                  :placeholder="''"
                />
              </div>
            </div>
          </template>

          <fdk-link
            :link="getCollectionURL"
            v-if="getSectionPropValue(settings, 'cta_button_text')"
          >
            <button class="btn-secondary cta-button font-body">
              {{ getSectionPropValue(settings, "cta_button_text") }}
            </button>
          </fdk-link>
        </div>
      </template>
    </div>
  </div>
</template>
<!-- #region  -->

<settings>
{
  "name": "featured_collection",
  "label": "Featured Collection",
  "props": [
    {
      "type": "collection",
      "id": "collection",
      "label": "Collection",
      "info": "Select a collection to display its products"
    },
    {
      "id": "desktop_layout",
      "type": "select",
      "options": [
        {
          "value": "horizontal_scroll",
          "text": "Horizontal scroll"
        },
        {
          "value": "stacked",
          "text": "Stack"
        },
        {
          "value": "banner_horizontal_carousel",
          "text": "Banner with horizontal carousel"
        }
      ],
      "default": "banner_horizontal_carousel",
      "label": "Layout (Desktop)",
      "info": "Alignment of content in desktop"
    },
    {
      "id": "mobile_layout",
      "type": "select",
      "options": [
        {
          "value": "horizontal_scroll",
          "text": "Horizontal scroll"
        },
        {
          "value": "stacked",
          "text": "Stack"
        },
        {
          "value": "banner_horizontal_scroll",
          "text": "Banner with horizontal scroll"
        },
        {
          "value": "banner_stacked",
          "text": "Banner with Stack"
        }
      ],
      "default": "horizontal_scroll",
      "label": "Layout (Mobile)",
      "info": "Alignment of content in mobile"
    },
    {
      "type": "color",
      "id": "img_container_bg",
      "category": "Image Container",
      "default": "#00000000",
      "label": "Container Background Color",
      "info": "This color will be used as the container background color of the Product/Collection/Category/Brand images wherever applicable"
    },
    {
      "type": "checkbox",
      "id": "img_fill",
      "category": "Image Container",
      "default": false,
      "label": "Fit image to the container",
      "info": "If the image aspect ratio is different from the container, the image will be clipped to fit the container. The aspect ratio of the image will be maintained"
    },
    {
      "type": "text",
      "id": "heading",
      "default": "Featured Collection",
      "label": "Heading",
      "info": "Heading text of the section"
    },
    {
      "type": "text",
      "id": "description",
      "default": "Featured Collection description here",
      "label": "Description",
      "info": "Description text of the section"
    },
    {
      "type": "text",
      "id": "cta_button_text",
      "default": "View all",
      "label": "Button text"
    },
    {
      "type": "range",
      "id": "items_per_row",
      "min": 3,
      "max": 5,
      "step": 1,
      "unit": "",
      "label": "Products per row (Desktop)",
      "default": 3,
      "info": "Maximum items allowed per row"
    }
  ]
}
</settings>
<!-- #endregion -->

<script>
import { isBrowser } from "browser-or-node";
import emergeImage from "./../global/components/common/emerge-image.vue";
import GlideCarousel from "./../global/components/glide-carousel.vue";
import GlideSlide from "./../global/components/glide-slide.vue";
import {
  getGlobalConfigValue,
  getSectionPropValue,
  throttle,
  getProductImgAspectRatio,
} from "../helper/utils";
import ProductCard from "../components/sections/featured-collection/product-card.vue";
// import { itemsInCollection } from "../helper/dummy-data";

export default {
  props: ["settings", "apiSDK", "serverProps", "global_config"],
  components: {
    "emerge-image": emergeImage,
    GlideCarousel,
    GlideSlide,
    ProductCard,
  },
  watch: {
    settings: {
      handler(newVal, oldVal) {
        if (newVal.props.collection.value !== oldVal.props.collection.value) {
          this.getCollectionData();
        }
      },
      deep: true,
    },
    bannerImage: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$forceUpdate();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.isMounted = true;
    isBrowser && window.addEventListener("resize", this.onResize);
    if (isBrowser) {
      this.featuredObserver = new IntersectionObserver(
        this.handleIntersection,
        {
          root: null,
          rootMargin: "0px",
          threshold: [0, 1],
        }
      );
      this.featuredObserver.observe(this.$el);
    }
    this.getCollectionData();
  },
  data: function () {
    return {
      products: this.serverProps?.products || {},
      bannerImage:
        this.serverProps?.bannerImage ||
        require("../assets/images/placeholder9x16.png"),
      windowWidth: isBrowser ? window.innerWidth : 0,
      isMounted: false,
      featuredObserver: null,
      showFeatImage: false,
      glideOptions: {
        type: "slider",
        startAt: 0,
        focusAt: 0,
        gap: 24,
        perView: 3,
        swipeThreshold: false,
        dragThreshold: false,
        breakpoints: {
          480: {
            perView: 1,
            gap: 12,
            peek: {
              before: 0,
              after: 50,
            },
            swipeThreshold: 80,
            dragThreshold: 120,
          },
          768: {
            perView: 3,
            gap: 12,
          },
        },
      },
    };
  },
  initializeServerProps({ settings, apiSDK }) {
    const { collection, desktop_layout, mobile_layout } = settings?.props || {};
    if (collection.value) {
      let promiseArr = [];
      promiseArr.push(
        apiSDK.catalog.getCollectionItemsBySlug({
          slug: collection.value,
          pageSize: 20,
        })
      );
      if (
        desktop_layout.value === "banner_horizontal_carousel" ||
        ["banner_stacked", "banner_horizontal_scroll"].includes(
          mobile_layout.value
        )
      ) {
        promiseArr.push(
          apiSDK.catalog.getCollectionDetailBySlug({
            slug: collection.value,
          })
        );
      }
      return Promise.all(promiseArr)
        .then((results) => {
          return {
            products: results?.[0],
            bannerImage: results?.[1]?.banners?.portrait?.url || "",
          };
        })
        .catch((e) => console.log(e));
    }
  },
  methods: {
    getGlobalConfigValue,
    getSectionPropValue,
    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.showFeatImage = true;
          this.featuredObserver.unobserve(this.$el);
        }
      });
    },
    getCollectionData() {
      const collectionSlug = this.getSectionPropValue(
        this.settings,
        "collection"
      );

      if (collectionSlug) {
        this.$apiSDK.catalog
          .getCollectionItemsBySlug({
            slug: collectionSlug,
            pageSize: 20,
          })
          .then((res) => {
            this.products = res || {};
          })
          .catch((e) => console.log(e));
        if (
          getSectionPropValue(this.settings, "desktop_layout") ===
            "banner_horizontal_carousel" ||
          ["banner_stacked", "banner_horizontal_scroll"].includes(
            getSectionPropValue(this.settings, "mobile_layout")
          )
        ) {
          this.$apiSDK.catalog
            .getCollectionDetailBySlug({
              slug: collectionSlug,
            })
            .then((res) => {
              this.bannerImage =
                res?.banners?.portrait?.url ||
                require("../assets/images/placeholder9x16.png");
            })
            .catch((e) => console.log(e));
        }
      }
    },

    onResize: throttle(function () {
      this.windowWidth = isBrowser ? window.innerWidth : 0;
    }, 450),
  },
  computed: {
    checkBannerScrollView() {
      if (this.windowWidth > 768) {
        return (
          getSectionPropValue(this.settings, "desktop_layout") ===
          "banner_horizontal_carousel"
        );
      }

      return false;
    },
    getSrcBanner() {
      return (
        this.bannerImage || require("../assets/images/placeholder9x16.png")
      );
    },
    checkHorizontalScrollView() {
      if (this.windowWidth > 768) {
        return (
          getSectionPropValue(this.settings, "desktop_layout") ===
          "horizontal_scroll"
        );
      }

      return false;
    },
    getCollectionURL() {
      const collectionSlug = this.getSectionPropValue(
        this.settings,
        "collection"
      );

      return collectionSlug ? `/collection/${collectionSlug}` : "#";
    },
    productsForStackedView() {
      let totalItems = 0;

      if (!this.products?.items?.length) {
        return [];
      }

      if (this.windowWidth <= 480) {
        totalItems = 4;
      } else if (this.windowWidth <= 768) {
        totalItems =
          this.getSectionPropValue(this.settings, "mobile_layout") ===
          "banner_stacked"
            ? 3
            : 6;
      } else {
        totalItems = getSectionPropValue(this.settings, "items_per_row") * 2;
      }

      return this.products?.items.slice(0, totalItems);
    },
    productsForScrollView() {
      let totalItems = getSectionPropValue(this.settings, "items_per_row") * 4;
      const desktopLayout = getSectionPropValue(
        this.settings,
        "desktop_layout"
      );

      if (this.products?.items && this.products?.items?.length) {
        if (this.windowWidth <= 480) {
          totalItems = 4;
        } else if (this.windowWidth <= 768) {
          totalItems = 12;
        } else if (desktopLayout === "banner_horizontal_carousel") {
          totalItems = 12;
        }

        return this.products?.items.slice(0, totalItems);
      }

      return [];
    },
    showStackedView() {
      const hasProducts = (this.productsForStackedView || []).length > 0;
      if (this.windowWidth <= 768) {
        return (
          hasProducts &&
          this.getSectionPropValue(this.settings, "mobile_layout").includes(
            "stacked"
          )
        );
      }

      return (
        hasProducts &&
        this.getSectionPropValue(this.settings, "desktop_layout").includes(
          "stacked"
        )
      );
    },
    showScrollView() {
      const hasProducts = (this.productsForScrollView || []).length > 0;
      if (this.windowWidth <= 768) {
        return (
          hasProducts &&
          ["horizontal_scroll", "banner_horizontal_scroll"].includes(
            this.getSectionPropValue(this.settings, "mobile_layout")
          )
        );
      }

      return (
        hasProducts &&
        ["horizontal_scroll", "banner_horizontal_carousel"].includes(
          this.getSectionPropValue(this.settings, "desktop_layout")
        )
      );
    },
    showGlideBullets() {
      const desktopLayout = this.getSectionPropValue(
        this.settings,
        "desktop_layout"
      );

      if (
        desktopLayout === "banner_horizontal_carousel" &&
        this.windowWidth > 768
      ) {
        return false;
      }

      return true;
    },
    getGlideOptions() {
      const updatedGlideOptions = { ...this.glideOptions };
      const desktopLayout = this.getSectionPropValue(
        this.settings,
        "desktop_layout"
      );

      updatedGlideOptions["perView"] = this.getSectionPropValue(
        this.settings,
        "items_per_row"
      );

      if (
        desktopLayout === "banner_horizontal_carousel" &&
        this.windowWidth > 768
      ) {
        updatedGlideOptions["perView"] = 2;
        updatedGlideOptions["peek"] = {
          before: 0,
          after: 150,
        };

        if (this.products?.items?.length > 2) {
          updatedGlideOptions["type"] = "carousel";
          updatedGlideOptions["startAt"] = 4;
        }
      }

      return updatedGlideOptions;
    },
    getCarouselWidth() {
      let desktopLayout = getSectionPropValue(this.settings, "desktop_layout");

      return {
        width:
          desktopLayout === "banner_horizontal_carousel" ? "52.5%" : "100%",
      };
    },
    getColumns() {
      let itemsPerRow = getSectionPropValue(this.settings, "items_per_row");

      return {
        "--grid-columns": itemsPerRow || 1,
      };
    },
    getFlexDirection() {
      const layout = this.getSectionPropValue(this.settings, "desktop_layout");

      if (layout === "banner_horizontal_carousel") {
        return `flex-direction: row`;
      }

      return `flex-direction: column`;
    },
    dynamicStyles() {
      return {
        "margin-bottom": `${getGlobalConfigValue(
          this.global_config,
          "section_margin_bottom"
        )}px`,
        "--bg-color": `${getSectionPropValue(
          this.settings,
          "img_container_bg"
        )}`,
      };
    },
    getProductImgAspectRatio() {
      return getProductImgAspectRatio(this.global_config);
    },
    isDemoBlock() {
      return !this.getSectionPropValue(this.settings, "collection");
    },
  },
  beforeDestroy() {
    isBrowser && window.removeEventListener("resize", this.onResize);
    if (this.featuredObserver && isBrowser) {
      this.featuredObserver.disconnect();
    }
  },
};
</script>

<style lang="less" scoped>
.section-main-container {
  text-align: center;
  padding: 0;
  margin-bottom: 16px;
}

.image-container {
  display: flex;
  align-items: center;
  flex-direction: column;

  .banner-image {
    width: 47.5%;

    @media @tablet {
      display: none;
    }

    .emerge-image {
      border-radius: 0px @ImageRadius @ImageRadius 0px;

      @media @desktop {
        margin-top: 16px;
      }
    }
  }
}

.section-carousel {
  position: relative;

  @media @tablet {
    width: 100% !important;
  }

  .details-container {
    padding: 16px;

    @media @desktop {
      margin-bottom: 16px;
      padding: 16px 40px;
    }

    .section-heading {
      font-size: 32px;
      font-weight: @bold;

      @media @tablet {
        font-size: 28px;
        margin-bottom: 4px;
      }
    }

    .section-description {
      color: @TextBody;
    }

    .max-width {
      max-width: 652px;
    }
  }

  .mobile-banner-image {
    margin-bottom: 39px;
    display: block;

    @media @desktop {
      display: none;
    }

    @media @mobile {
      margin-bottom: 24px;
    }
  }

  .stacked-view-container {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(
      auto-fit,
      calc((100% - (24px * (var(--grid-columns) - 1))) / var(--grid-columns))
    );
    padding: 0 40px;

    @media @mobile {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      padding: 0 16px;
    }

    @media @tablet-strict {
      grid-template-columns: repeat(auto-fit, calc((100% - 24px) / 3));
      padding: 0 24px;
      .grid-gap(12px);
    }

    @media @desktop {
      .grid-gap(24px);
    }
  }

  .defaultGrid {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(
      auto-fit,
      calc((100% - (24px * (3 - 1))) / 3)
    );
    padding: 0 40px;

    @media @mobile {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      padding: 0 16px;

      > div {
        margin-bottom: 16px;
      }
    }

    @media @tablet-strict {
      grid-template-columns: repeat(auto-fit, calc((100% - 24px) / 3));
      padding: 0 24px;
      .grid-gap(12px);
    }

    @media @desktop {
      .grid-gap(24px);
    }
  }
}

.cta-button {
  padding: 12px 24px;
  margin-top: 32px;
  cursor: pointer;
  text-transform: uppercase;
  height: 48px;

  @media @tablet {
    margin-top: 1rem;
  }
}

.mb-16 {
  margin-bottom: 16px;
}

.side-spacing {
  cursor: default;

  @media @tablet-strict {
    padding: 0 24px;
  }

  @media @mobile {
    padding-left: 16px;
  }
}

.plr-72 {
  padding: 0 40px;
}

.left-aligned-text {
  text-align: left;
  padding: 16px 0 !important;
}

.left-aligned-slides {
  /deep/ .glide__slides {
    margin-left: unset;
    margin-right: unset;
  }
}

/deep/ .bullet-arrow-container {
  margin-top: 32px;

  @media @tablet {
    margin-top: 0px;
  }

  @media @mobile {
    margin-left: -16px;
  }
}

/deep/ .svg-arrow {
  @media @tablet {
    display: none;
  }
}

/deep/ .glide {
  margin-bottom: unset;
}

.pl-32 {
  padding-left: 32px;
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
