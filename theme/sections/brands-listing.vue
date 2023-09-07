<template>
  <section :style="dynamicStyles">
    <fdk-infinite-scrolling :loadingData="loading">
      <div>
        <div>
          <h2
            class="section-heading font-header"
            :class="{ 'logo-only': getSectionPropValue(settings, 'logoOnly') }"
            v-if="getSectionPropValue(settings, 'heading')"
          >
            {{ getSectionPropValue(settings, "heading") }}
          </h2>
          <p
            class="section-description b-small font-body"
            v-if="getSectionPropValue(settings, 'description')"
          >
            {{ getSectionPropValue(settings, "description") }}
          </p>
        </div>
        <div
          :class="`categories-block ${
            getSectionPropValue(settings, 'logoOnly')
              ? 'logoWidth'
              : 'nonLogoMaxWidth'
          } card-count-${getSectionPropValue(settings, 'per_row')}`"
          :style="`--brand-item:${getSectionPropValue(settings, 'per_row')}`"
          v-if="isMounted && showStackedView"
        >
          <div v-for="(card, index) in getBrandCount" :key="index">
            <fdk-link :link="`/products/?brand=${card.slug}`">
              <div :data-cardtype="'BRANDS'" class="pos-relative">
                <emerge-image
                  :class="{
                    'brand-image': !getSectionPropValue(settings, 'logoOnly'),
                    streach: getSectionPropValue(settings, 'img_fill'),
                  }"
                  :src="
                    getSectionPropValue(settings, 'logoOnly')
                      ? card?.logo?.url
                      : card?.banners?.portrait?.url
                  "
                  :aspectRatio="
                    getSectionPropValue(settings, 'logoOnly') ? 1 : 0.8
                  "
                  :mobileAspectRatio="
                    getSectionPropValue(settings, 'logoOnly') ? 1 : 0.8
                  "
                  :sources="[
                    { breakpoint: { min: 1024 }, width: 450 },
                    { breakpoint: { min: 769 }, width: 416 },
                    { breakpoint: { max: 768 }, width: 232 },
                    { breakpoint: { max: 480 }, width: 136 },
                  ]"
                />

                <div
                  class="brand-info"
                  v-if="
                    card?.name?.length > 0 &&
                    !getSectionPropValue(settings, 'logoOnly')
                  "
                >
                  <div class="brand-logo">
                    <emerge-image
                      :src="card?.logo?.url"
                      :aspectRatio="1"
                      :mobileAspectRatio="1"
                      :sources="[
                        { breakpoint: { min: 769 }, width: 60 },
                        { breakpoint: { max: 768 }, width: 60 },
                        { breakpoint: { max: 480 }, width: 60 },
                      ]"
                    />
                  </div>
                  <span class="font-body">{{ card?.name }}</span>
                </div>
              </div>
            </fdk-link>
          </div>
        </div>
        <div
          v-else-if="isMounted && showScrollView"
          class="categories-horizontal"
          :class="[
            `card-count-${getSectionPropValue(settings, 'per_row')}`,
            { logoWidth: getSectionPropValue(settings, 'logoOnly') },
          ]"
          :style="`--brand-item:${getSectionPropValue(settings, 'per_row')}`"
        >
          <glideCarouselVue
            :class="{
              'brands-carousel': !getSectionPropValue(settings, 'logoOnly'),
            }"
            :glideOptions="glideOptions"
            :has-arrows="true"
            showPerPage
            v-if="brands && brands.length > 0 && !isLoading"
          >
            <glideSlideVue v-for="(card, index) in getBrandCount" :key="index">
              <fdk-link :link="`/products/?brand=${card.slug}`">
                <div :data-cardtype="'BRANDS'" style="position: relative">
                  <emerge-image
                    :class="{
                      'brand-image': !getSectionPropValue(settings, 'logoOnly'),
                      streach: getSectionPropValue(settings, 'img_fill'),
                    }"
                    :src="
                      getSectionPropValue(settings, 'logoOnly')
                        ? card?.logo?.url
                        : card?.banners?.portrait?.url
                    "
                    :aspectRatio="
                      getSectionPropValue(settings, 'logoOnly') ? 1 : 0.8
                    "
                    :mobileAspectRatio="
                      getSectionPropValue(settings, 'logoOnly') ? 1 : 0.8
                    "
                    :sources="[
                      { breakpoint: { min: 1024 }, width: 450 },
                      { breakpoint: { min: 769 }, width: 416 },
                      { breakpoint: { max: 768 }, width: 232 },
                      { breakpoint: { max: 480 }, width: 136 },
                    ]"
                  />

                  <div
                    class="brand-info"
                    v-if="
                      card?.name?.length > 0 &&
                      !getSectionPropValue(settings, 'logoOnly')
                    "
                  >
                    <div class="brand-logo">
                      <emerge-image
                        :src="card?.logo?.url"
                        :aspectRatio="1"
                        :mobileAspectRatio="1"
                        :sources="[
                          { breakpoint: { min: 769 }, width: 60 },
                          { breakpoint: { max: 768 }, width: 60 },
                          { breakpoint: { max: 480 }, width: 60 },
                        ]"
                      />
                    </div>
                    <span class="font-body">{{ card?.name }}</span>
                  </div>
                </div>
              </fdk-link>
            </glideSlideVue>
          </glideCarouselVue>
        </div>
        <div
          :class="`defaultBrandBlock ${
            getSectionPropValue(settings, 'logoOnly')
              ? 'logoWidth'
              : 'nonLogoMaxWidth'
          } card-count-4`"
          v-if="isDemoBlock"
        >
          <div v-for="index in 4" :key="index">
            <div :data-cardtype="'BRANDS'" class="pos-relative">
              <emerge-image
                class="streach"
                :class="{
                  'brand-image': !getSectionPropValue(settings, 'logoOnly'),
                }"
                :src="getPlaceHolder"
                :aspectRatio="
                  getSectionPropValue(settings, 'logoOnly') ? 1 : 0.8
                "
                :mobileAspectRatio="
                  getSectionPropValue(settings, 'logoOnly') ? 1 : 0.8
                "
                :sources="[
                  { breakpoint: { min: 1024 }, width: 450 },
                  { breakpoint: { min: 769 }, width: 416 },
                  { breakpoint: { max: 768 }, width: 232 },
                  { breakpoint: { max: 480 }, width: 136 },
                ]"
              />

              <div
                class="brand-info"
                v-if="!getSectionPropValue(settings, 'logoOnly')"
              >
                <div class="brand-logo">
                  <emerge-image
                    :src="logoPlaceholderSrc"
                    :aspectRatio="1"
                    :mobileAspectRatio="1"
                    :sources="[
                      { breakpoint: { min: 769 }, width: 60 },
                      { breakpoint: { max: 768 }, width: 60 },
                      { breakpoint: { max: 480 }, width: 60 },
                    ]"
                  />
                </div>
                <span class="font-body">{{ `BRAND ` + index }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-justify-center gap-above-button">
          <fdk-link :link="'/brands/'">
            <button
              class="btn-secondary section-button font-body"
              v-if="
                getSectionPropValue(settings, 'button_text') &&
                getSectionPropValue(settings, 'button_text').length
              "
            >
              {{ getSectionPropValue(settings, "button_text") }}
            </button>
          </fdk-link>
        </div>
      </div>
    </fdk-infinite-scrolling>
  </section>
</template>

<!-- #region  -->
<settings>
{
    "name": "brands_listing",
    "label": "Brands Listing",
    "props": [
    {
      "type":"range",
      "id":"per_row",
      "label":"Display brands per row (desktop)",
      "min":"3",
      "max":"5",
      "step":"1",
      "info":"It'll not work for mobile layout",
      "default":"4"
    },
    {
      "type": "checkbox",
      "id": "logoOnly",
      "default": false,
      "label": "Logo Only",
      "info":"Show Logo of brands"
    },
    {
      "id": "layout_mobile",
      "type": "select",
      "options": [
        {
          "value": "stacked",
          "text": "Stack"
        },
        {
          "value": "horizontal",
          "text": "Horizontal"
        }
      ],
      "default": "stacked",
      "label": "Mobile Layout",
      "info": "Alignment of content"
    },
    {
      "id": "layout_desktop",
      "type": "select",
      "options": [
        {
          "value": "grid",
          "text": "Stack"
        },
        {
          "value": "horizontal",
          "text": "Horizontal"
        }
      ],
      "default": "grid",
      "label": "Desktop Layout",
      "info": "Alignment of content"
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
      "default": "Our Top Brands",
      "label": "Heading",
      "info":"Heading text of the section"
    },
    {
      "type": "textarea",
      "id": "description",
      "default": "All is unique no matter how you put it",
      "label": "Description",
      "info":"Description text of the section"
    },
    {
      "type": "text",
      "id": "button_text",
      "default": "VIEW ALL",
      "label": "Button Text"
    }
  ],
  "blocks": [
    {
      "type": "category",
      "name": "Brand Item",
      "props": [
       {
          "type": "brand",
          "id": "brand",
          "label": "Select Brand"
       }
      ]
    }
  ],
  "preset": {
      "blocks": [
        {
          "name": "Brand Item"
        },
        {
          "name": "Brand Item"
        },
        {
          "name": "Brand Item"
        },
         {
          "name": "Brand Item"
        }
      ]
    }
}
</settings>
<!-- #endregion -->
<script>
import emergeImageVue from "../global/components/common/emerge-image.vue";
import glideCarouselVue from "../global/components/glide-carousel.vue";
import glideSlideVue from "../global/components/glide-slide.vue";
import { getSectionPropValue, getGlobalConfigValue } from "../helper/utils";
import { isBrowser } from "browser-or-node";
export default {
  props: ["settings", "apiSDK", "serverProps", "global_config"],
  data() {
    return {
      isLoading: false,
      brands: this.serverProps || [],
      windowWidth: isBrowser ? window.innerWidth : 0,
      isMounted: false,
      blockWidth: 3,
      glideOptions: {
        startAt: 0,
        focusAt: 0,
        gap: this.getGapValue(24),
        perView: this.getSectionPropValue(this.settings, "per_row"),
        breakpoints: {
          768: {
            perView: 3,
            gap: getSectionPropValue(this.settings, "logoOnly")
              ? this.getGapValue(11)
              : this.getGapValue(12),
          },
          480: {
            perView: getSectionPropValue(this.settings, "logoOnly") ? 3 : 1,
            gap: getSectionPropValue(this.settings, "logoOnly")
              ? this.getGapValue(11)
              : this.getGapValue(8),
            peek: {
              before: 0,
              after: getSectionPropValue(this.settings, "logoOnly")
                ? 0
                : this.getAfterValue(1, 50),
            },
          },
        },
      },
    };
  },
  components: {
    "emerge-image": emergeImageVue,
    glideCarouselVue,
    glideSlideVue,
  },
  initializeServerProps({ settings, apiSDK }) {
    const brands =
      settings?.blocks?.reduce((acc, b) => {
        if (b?.props?.brand?.value.id)
          return [...acc, b?.props?.brand?.value.id];
      }, []) || [];
    if (brands.length !== 0) {
      return Promise.all(
        brands.map((slug) => {
          return apiSDK.catalog.getBrandDetailBySlug({
            slug,
          });
        })
      )
        .then((results) => {
          return results;
        })
        .catch((e) => console.log(e));
    }
  },
  watch: {
    settings: {
      handler: function (newVal, oldVal) {
        if (
          newVal.props?.layout_mobile?.value !==
            oldVal.props?.layout_mobile?.value ||
          newVal.props?.layout_desktop?.value !==
            oldVal.props?.layout_desktop?.value ||
          this.isBlocksChanged(newVal.blocks, oldVal.blocks)
        ) {
          this.brands = [];
          this.fetchBrands();
        }
      },
      deep: true,
    },
    getBrandCount: {
      handler() {
        this.glideOptions = {
          startAt: 0,
          focusAt: 0,
          gap: this.getGapValue(24),
          perView: this.getSectionPropValue(this.settings, "per_row"),
          breakpoints: {
            768: {
              perView: 3,
              gap: getSectionPropValue(this.settings, "logoOnly")
                ? this.getGapValue(11)
                : this.getGapValue(12),
            },
            480: {
              perView: getSectionPropValue(this.settings, "logoOnly") ? 3 : 1,
              gap: getSectionPropValue(this.settings, "logoOnly")
                ? this.getGapValue(11)
                : this.getGapValue(8),
              peek: {
                before: 0,
                after: getSectionPropValue(this.settings, "logoOnly")
                  ? 0
                  : this.getAfterValue(1, 50),
              },
            },
          },
        };
      },
      deep: true,
    },
  },
  methods: {
    getSectionPropValue,
    isBlocksChanged(newBlocks, oldBlocks) {
      return JSON.stringify(newBlocks) !== JSON.stringify(oldBlocks);
    },
    fetchBrands() {
      const promisesArr = [];
      this.isLoading = true;
      this.settings.blocks.forEach((block) => {
        if (block.props?.brand?.value) {
          this.isLoading = true;
          promisesArr.push(
            this.$apiSDK.catalog.getBrandDetailBySlug({
              slug: block.props.brand.value.id,
            })
          );
        }
      });
      Promise.all(promisesArr).then((responses) => {
        this.brands = responses;
        this.isLoading = false;
      });
      this.isLoading = false;
    },
    onResize() {
      this.windowWidth = isBrowser ? window.innerWidth : 0;
    },
    getAfterValue(perView, value) {
      return this.getBrandCount?.length > perView ? value : 0;
    },
    getGapValue(gap) {
      return this.getBrandCount?.length === 1 ? 0 : gap;
    },
  },
  computed: {
    getPlaceHolder() {
      return getSectionPropValue(this.settings, "logoOnly")
        ? require("../assets/images/placeholder1X1.png")
        : require("../assets/images/placeholder9x16.png");
    },
    logoPlaceholderSrc() {
      return require("../assets/images/placeholder1X1.png");
    },
    showStackedView() {
      const hasBrands = (this.brands || []).length > 0;
      if (this.windowWidth <= 768) {
        return (
          hasBrands &&
          this.getSectionPropValue(this.settings, "layout_mobile").includes(
            "stacked"
          )
        );
      }
      return (
        hasBrands &&
        this.getSectionPropValue(this.settings, "layout_desktop").includes(
          "grid"
        )
      );
    },
    showScrollView() {
      const hasBrands = (this.brands || []).length > 0;
      if (this.windowWidth <= 768) {
        return (
          hasBrands &&
          this.getSectionPropValue(this.settings, "layout_mobile").includes(
            "horizontal"
          )
        );
      } else {
        return (
          hasBrands &&
          this.getSectionPropValue(this.settings, "layout_desktop").includes(
            "horizontal"
          )
        );
      }
    },
    getBrandCount() {
      let perRowItem = this.getSectionPropValue(this.settings, "per_row");
      if (getSectionPropValue(this.settings, "logoOnly")) {
        if (this.showScrollView) {
          if (this.windowWidth >= 768 && this.windowWidth < 830) {
            return this.brands?.slice(0, 12);
          } else if (this.windowWidth < 768) {
            return this.brands?.slice(0, 12);
          } else {
            return this.brands?.slice(0, perRowItem * 4);
          }
        } else if (this.showStackedView) {
          if (this.windowWidth >= 768 && this.windowWidth < 830) {
            return this.brands?.slice(0, 9);
          } else if (this.windowWidth < 768) {
            return this.brands?.slice(0, 9);
          } else {
            return this.brands?.slice(0, perRowItem * 2);
          }
        }
      } else {
        if (this.showScrollView) {
          if (this.windowWidth >= 768 && this.windowWidth < 830) {
            return this.brands?.slice(0, 12);
          } else if (this.windowWidth < 768) {
            return this.brands?.slice(0, 4);
          } else {
            return this.brands?.slice(0, perRowItem * 4);
          }
        } else if (this.showStackedView) {
          if (this.windowWidth >= 768 && this.windowWidth < 830) {
            return this.brands?.slice(0, 6);
          } else if (this.windowWidth < 768) {
            return this.brands?.slice(0, 4);
          } else {
            return this.brands?.slice(0, perRowItem * 2);
          }
        }
      }

      return [];
    },
    dynamicStyles() {
      return {
        padding: "16px 0",
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
    isDemoBlock() {
      const brands =
        this.settings?.blocks?.reduce((acc, b) => {
          if (b?.props?.brand?.value?.id)
            return [...acc, b?.props?.brand?.value?.id];
        }, []) || [];
      return brands.length === 0;
    },
  },
  mounted() {
    this.isMounted = true;
    isBrowser && window.addEventListener("resize", this.onResize);
    this.fetchBrands();
  },
  beforeDestroy() {
    isBrowser && window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style lang="less" scoped>
.brands-carousel {
  ::v-deep .bullet-arrow-container {
    @media @mobile {
      display: none;
    }
  }
}
div[data-cardtype="BRANDS"] {
  border-radius: @ImageRadius;
  -webkit-mask-image: -webkit-radial-gradient(white, black); //safari fix

  cursor: pointer !important;
  ::v-deep img {
    transition: 300ms all cubic-bezier(0, 0, 0.2, 1);
  }
  &:hover {
    ::v-deep img {
      transform: scale(1.1);
    }
  }
  .streach {
    ::v-deep img {
      object-fit: cover !important;
      height: 100% !important;
    }
    ::v-deep picture {
      background-color: var(--bg-color) !important;
    }
  }
}
.section-heading {
  text-align: center;
  margin-bottom: 4px;
  @media @desktop {
    margin-bottom: 16px;
  }
  &.logo-only {
    margin-bottom: 8px;
    @media @desktop {
      margin-bottom: 16px;
    }
  }
}
.section-description {
  text-align: center;
  padding: 0 16px;
  margin-bottom: 24px;
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
  @media @tablet {
    margin-bottom: 16px;
  }
  @media @desktop {
    margin-bottom: 32px;
  }
}
.categories-block {
  padding: 0 16px;
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr;
  .grid-gap(10px);
  @media @mobile-up {
    padding: 0 24px;
    .grid-gap(24px, 12px);
    grid-template-columns: repeat(auto-fit, calc((100% - 24px) / 3));
  }
  @media @desktop {
    padding: 0 40px;
    .grid-gap(32px, 24px);
    grid-template-columns: repeat(
      auto-fit,
      calc((100% - (24px * (var(--brand-item) - 1))) / var(--brand-item))
    );
    &.card-count-4 {
      .grid-gap(24px);
    }
  }
}
.defaultBrandBlock {
  padding: 0 16px;
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr;
  .grid-gap(10px);
  @media @mobile-up {
    padding: 0 24px;
    .grid-gap(24px, 12px);
    grid-template-columns: repeat(auto-fit, calc((100% - 24px) / 3));
  }
  @media @desktop {
    padding: 0 40px;
    .grid-gap(32px, 24px);
    grid-template-columns: repeat(
      auto-fit,
      calc((100% - (24px * (4 - 1))) / 4)
    );
    &.card-count-4 {
      .grid-gap(24px);
    }
  }
}
.categories-horizontal {
  padding: 0 0 0 16px;
  @media @mobile-up {
    padding: 0 24px;
  }
  @media @desktop {
    padding: 0 40px;
  }
  &.single-card {
    padding: 0 16px;
  }
}
.brand-info {
  position: absolute;
  border: none;
  background-color: @color-white;
  height: 60px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: @ButtonRadius;
  .brand-logo {
    width: 50px;
    margin-right: 16px;
  }
}
.pos-relative {
  position: relative;
}
.logoWidth {
  border-radius: @ImageRadius;
  grid-template-columns: repeat(auto-fit, calc((100% - 22px) / 3));
  .grid-gap(11px);
  padding: 0 16px;
  @media @mobile-up {
    grid-template-columns: repeat(auto-fit, calc((100% - 24px) / 3));
    padding: 0 120px;
  }
  @media @desktop {
    margin: 0 auto;
    padding: 0 40px;
    .grid-gap(24px);
    grid-template-columns: repeat(
      auto-fit,
      calc((100% - (24px * (var(--brand-item) - 1))) / var(--brand-item))
    );
    &.card-count-3 {
      max-width: 737px;
    }
    &.card-count-4 {
      max-width: 964px;
    }
    &.card-count-5 {
      max-width: 1191px;
    }
  }
}
.gap-above-button {
  margin: 24px 0 4px;
  @media @desktop {
    margin: 32px 0 4px;
  }
}
.section-button {
  padding: 12px 24px;
  background-color: transparent;
  text-transform: uppercase;
  cursor: pointer;
}
/deep/ .glide--swipeable {
  cursor: auto;
}
</style>
