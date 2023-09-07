<template>
  <div
    class="collections__template"
    :class="[
      `desktop-${getSectionPropValue(this.settings, 'layout_desktop')}`,
      `mob-${getSectionPropValue(this.settings, 'layout_mobile')}`,
      `cards-${getSectionPropValue(this.settings, 'per_row')}`,
    ]"
    :style="dynamicStyles"
  >
    <template>
      <div class="section-title-block">
        <h2 class="section-title font-header">
          {{ getSectionPropValue(settings, "heading") }}
        </h2>
        <p class="section-description b2 font-body">
          {{ getSectionPropValue(settings, "description") }}
        </p>
      </div>
      <div
        class="collection-grid"
        :style="getColumns"
        v-if="isMounted && showStackedView"
      >
        <div
          class="collection-block"
          v-for="(card, index) in collectionsForStackedView"
          :key="'COLLECTIONS' + index"
        >
          <div class="card-img" :data-cardtype="'COLLECTIONS'">
            <fdk-link :action="card?.action" class="font-body button-font">
              <emerge-image
                v-if="showCollectionImage"
                :src="card?.banners?.portrait?.url"
                :aspect-ratio="0.8"
                :mobileAspectRatio="0.8"
                :class="
                  getSectionPropValue(settings, 'img_fill')
                    ? 'streach group-item-img'
                    : 'group-item-img'
                "
                :sources="[
                  {
                    breakpoint: { min: 1023 },
                    width: 500,
                  },
                  {
                    breakpoint: { min: 481 },
                    width: 416,
                  },
                  {
                    breakpoint: { max: 480 },
                    width: 266,
                  },
                ]"
              />
              <div class="collection-title-block">
                <div class="background"></div>
                <h3
                  class="collection-title font-header"
                  v-if="card.name"
                  :title="card.name"
                >
                  {{ card.name }}
                </h3>

                <span
                  :title="getSectionPropValue(settings, 'button_text')"
                  class="inline-block collection-button"
                >
                  {{ getSectionPropValue(settings, "button_text") }}
                </span>
              </div>
            </fdk-link>
          </div>
        </div>
      </div>
      <div
        v-else-if="isMounted && showScrollView"
        class="collection-horizontal"
        :class="{ 'single-card': collectionsForScrollView.length === 1 }"
      >
        <glideCaraousel
          :glideOptions="glideOptions"
          v-if="collections?.length > 0"
          :has-arrows="true"
          :showPerPage="true"
        >
          <glideSlide
            v-for="(card, index) in collectionsForScrollView"
            :key="'COLLECTIONS' + index"
          >
            <div class="collection-block">
              <div class="card-img" :data-cardtype="'COLLECTIONS'">
                <fdk-link :action="card?.action" class="font-body button-font">
                  <emerge-image
                    v-if="showCollectionImage"
                    :src="card?.banners?.portrait?.url"
                    :aspect-ratio="0.8"
                    :mobileAspectRatio="0.8"
                    :class="
                      getSectionPropValue(settings, 'img_fill')
                        ? 'streach group-item-img'
                        : 'group-item-img'
                    "
                    :sources="[
                      {
                        breakpoint: { min: 1023 },
                        width: 306,
                      },
                      {
                        breakpoint: { min: 481 },
                        width: 416,
                      },
                      {
                        breakpoint: { max: 767 },
                        width: 300,
                      },
                    ]"
                  />
                  <div class="collection-title-block">
                    <div class="background"></div>
                    <h3
                      class="collection-title font-header"
                      v-if="card.name"
                      :title="card.name"
                    >
                      {{ card.name }}
                    </h3>

                    <span
                      :title="getSectionPropValue(settings, 'button_text')"
                      class="inline-block collection-button"
                    >
                      {{ getSectionPropValue(settings, "button_text") }}
                    </span>
                  </div>
                </fdk-link>
              </div>
            </div>
          </glideSlide>
        </glideCaraousel>
      </div>
      <div v-else-if="isDemoBlock" class="defaultGrid">
        <div v-for="index in 3" :key="'COLLECTIONS' + index">
          <div class="collection-block">
            <div class="card-img" :data-cardtype="'COLLECTIONS'">
              <fdk-link :action="card?.action" class="font-body button-font">
                <emerge-image
                  :src="getPlaceHolder"
                  :aspect-ratio="0.8"
                  :mobileAspectRatio="0.8"
                  class="streach group-item-img"
                  :sources="[
                    {
                      breakpoint: { min: 1023 },
                      width: 406,
                    },
                    {
                      breakpoint: { min: 481 },
                      width: 416,
                    },
                    {
                      breakpoint: { max: 480 },
                      width: 266,
                    },
                  ]"
                />
                <div class="collection-title-block">
                  <div class="background"></div>
                  <h3
                    class="collection-title font-header"
                    :title="'COLLECTION' + index"
                  >
                    {{ "COLLECTION " + index }}
                  </h3>

                  <span
                    :title="getSectionPropValue(settings, 'button_text')"
                    class="inline-block collection-button"
                  >
                    {{ getSectionPropValue(settings, "button_text") }}
                  </span>
                </div>
              </fdk-link>
            </div>
          </div>
        </div>
      </div>
    </template>
    <fdk-loader v-if="isLoading" class="infi-loader" />
  </div>
</template>
<settings>
{
  "name": "collections_listing",
  "label": "Collections Listing",
  "props": [
    {
      "type": "text",
      "id": "heading",
      "default": "Top Collections",
      "label": "Heading",
      "info":"Heading text of the section"
    },
    {
      "type": "textarea",
      "id": "description",
      "default": "We stay on top so you can be on top",
      "label": "Description",
      "info":"Description text of the section"
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
      "default": "horizontal",
      "label": "Layout(Mobile)",
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
      "default": "horizontal",
      "label": "Layout(Desktop)",
      "info": "Alignment of content"
    },
    {
      "type": "text",
      "id": "button_text",
      "default": "Shop Now",
      "label": "Button Text"
    },
    {
      "type":"range",
      "id":"per_row",
      "label":"Display collections per row (desktop)",
      "min":"3",
      "max":"4",
      "step":"1",
      "info":"It'll not work for mobile layout",
      "default":"3"
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
    }
  ],
  "blocks": [
    {
      "type": "collection-item",
      "name": "Collection Item",
      "props": [
        {
          "type": "collection",
          "id": "collection",
          "label": "Select Collection"
        }
      ]
    }
  ],
  "preset": {
      "blocks": []
    }
}
</settings>
<script>
import { isBrowser } from "browser-or-node";
import { getSectionPropValue, getGlobalConfigValue } from "../helper/utils";
import glideCaraousel from "../global/components/glide-carousel.vue";
import glideSlide from "../global/components/glide-slide.vue";
import emergeImageVue from "../global/components/common/emerge-image.vue";
export default {
  props: ["settings", "apiSDK", "serverProps", "global_config"],
  data() {
    return {
      collections: this.serverProps || [],
      isLoading: false,
      windowWidth: isBrowser ? window.innerWidth : 0,
      isMounted: false,
      collectObserver: null,
      showCollectionImage: false,
      glideOptions: {
        startAt: 0,
        focusAt: 0,
        gap: this.getGapValue(24),
        perView: getSectionPropValue(this.settings, "per_row"),
        swipeThreshold: false,
        dragThreshold: false,
        breakpoints: {
          768: {
            perView: 3,
            gap: this.getGapValue(12),
          },
          480: {
            perView: 1,
            gap: this.getGapValue(12),
            peek: {
              before: 0,
              after: this.getAfterValue(1, 50),
            },
            swipeThreshold: 80,
            dragThreshold: 120,
          },
        },
      },
    };
  },
  components: {
    "emerge-image": emergeImageVue,
    glideCaraousel,
    glideSlide,
  },
  initializeServerProps({ settings, apiSDK }) {
    const collections =
      settings?.blocks?.reduce((acc, b) => {
        if (b?.props?.collection?.value)
          return [...acc, b?.props?.collection?.value];
      }, []) || [];
    if (collections.length !== 0) {
      return Promise.all(
        collections.map((slug) => {
          return apiSDK.catalog.getCollectionDetailBySlug({
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
          this.collections = [];
          this.fetchCollections();
        }
      },
      deep: true,
    },
    collectionsForScrollView: {
      handler() {
        this.glideOptions = {
          startAt: 0,
          focusAt: 0,
          gap: this.getGapValue(24),
          perView: getSectionPropValue(this.settings, "per_row"),
          swipeThreshold: false,
          dragThreshold: false,
          breakpoints: {
            768: {
              perView: 3,
              gap: this.getGapValue(12),
            },
            480: {
              perView: 1,
              gap: this.getGapValue(12),
              peek: {
                before: 0,
                after: this.getAfterValue(1, 50),
              },
              swipeThreshold: 80,
              dragThreshold: 120,
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
    onResize() {
      this.windowWidth = isBrowser ? window.innerWidth : 0;
    },
    fetchCollections() {
      const promisesArr = [];
      this.isLoading = true;
      this.settings.blocks.forEach((block) => {
        if (block.props?.collection?.value) {
          this.isLoading = true;
          promisesArr.push(
            this.$apiSDK.catalog.getCollectionDetailBySlug({
              slug: block.props.collection.value.split(" ").join("-"),
            })
          );
        }
      });
      Promise.all(promisesArr).then((responses) => {
        this.collections = responses;
        this.isLoading = false;
      });
      this.isLoading = false;
    },
    getAfterValue(perView, value) {
      return this.collectionsForScrollView?.length > perView ? value : 0;
    },
    getGapValue(gap) {
      return this.collectionsForScrollView?.length === 1 ? 0 : gap;
    },
    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.showCollectionImage = true;
          this.collectObserver.unobserve(this.$el);
        }
      });
    },
  },
  computed: {
    showStackedView() {
      const hasCollections =
        (this.collectionsForStackedView || [])?.length !== 0;
      if (this.windowWidth <= 768) {
        return (
          hasCollections &&
          this.getSectionPropValue(this.settings, "layout_mobile").includes(
            "stacked"
          )
        );
      }
      return (
        hasCollections &&
        this.getSectionPropValue(this.settings, "layout_desktop").includes(
          "grid"
        )
      );
    },
    collectionsForStackedView() {
      let totalItems = 0;

      if (this.collections && this.collections?.length) {
        if (this.windowWidth <= 480) {
          totalItems = 4;
        } else if (this.windowWidth <= 768) {
          totalItems = 6;
        } else {
          totalItems = getSectionPropValue(this.settings, "per_row") * 2;
        }

        return this.collections.slice(0, totalItems);
      }

      return [];
    },
    getPlaceHolder() {
      return require("../assets/images/placeholder9x16.png");
    },
    collectionsForScrollView() {
      let totalItems = 12;

      if (this.collections && this.collections?.length) {
        return this.collections.slice(0, totalItems);
      }

      return [];
    },
    showScrollView() {
      const hasCollections =
        (this.collectionsForScrollView || [])?.length !== 0;
      if (this.windowWidth <= 768) {
        return (
          hasCollections &&
          ["horizontal"].includes(
            this.getSectionPropValue(this.settings, "layout_mobile")
          )
        );
      }
      return (
        hasCollections &&
        ["horizontal"].includes(
          this.getSectionPropValue(this.settings, "layout_desktop")
        )
      );
    },
    getColumns() {
      let itemsPerRow = getSectionPropValue(this.settings, "per_row");
      return {
        "--grid-columns": itemsPerRow || 1,
      };
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
      const collections =
        this.settings?.blocks?.reduce((acc, b) => {
          if (b?.props?.collection?.value)
            return [...acc, b?.props?.collection?.value];
        }, []) || [];
      return collections.length === 0;
    },
  },
  mounted() {
    this.isMounted = true;
    isBrowser && window.addEventListener("resize", this.onResize);
    if (isBrowser) {
      this.collectObserver = new IntersectionObserver(this.handleIntersection, {
        root: null,
        rootMargin: "0px",
        threshold: [0, 1],
      });
      this.collectObserver.observe(this.$el);
    }
    this.fetchCollections();
  },

  beforeDestroy() {
    isBrowser && window.removeEventListener("resize", this.onResize);
    if (this.collectObserver && isBrowser) {
      this.collectObserver.disconnect();
    }
  },
};
</script>
<style lang="less" scoped>
/deep/.glide__arrows {
  @media @tablet {
    display: none;
  }
}
/deep/ .glide__bullets {
  @media @mobile {
    display: none;
  }
}
.collections__template {
  .section-title-block {
    text-align: center;
    padding: 0 16px;
    @media @mobile-up {
      padding: 0 24px;
    }
    @media @desktop {
      padding: 0 40px;
    }
    .section-title {
      margin-bottom: 8px;
      @media @mobile-up {
        margin-bottom: 4px;
      }
      @media @desktop {
        margin-bottom: 16px;
      }
    }
    .section-description {
      margin: 0 auto 32px;
      @media @desktop {
        max-width: 590px;
      }
    }
  }
  &.desktop-grid {
    &.cards-4 {
      .section-description {
        @media @desktop {
          margin-bottom: 24px;
        }
      }
    }
  }
  &.mob-horizontal {
    @media @mobile {
      .section-description {
        margin-bottom: 19px;
      }
    }
    @media @tablet {
      .section-title {
        margin-bottom: 4px;
      }
      .section-description {
        margin-bottom: 16px;
      }
    }
  }
}
.collection-block {
  @media only screen and (min-width: 769px) {
    position: relative;
  }
}

.collection-title-block {
  @lg-min: 840px;
  text-align: center;
  margin-top: 16px;
  transition: 300ms all ease-out;
  cursor: pointer;
  @media @desktop {
    display: flex;
    flex-direction: column;
    padding: 16px;
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 12px;
    border-radius: @ButtonRadius;
    align-items: center;
    overflow: hidden;
    isolation: isolate;
    .background {
      position: absolute;
      .inset(0);
      background: @Overlay;
      opacity: 0.6;
      z-index: -1;
    }
  }
  .collection-title {
    text-transform: capitalize;
    margin-bottom: 16px;
    .text-line-clamp(2);
    @media @desktop {
      color: @ThemeAccentL5;
    }
  }
  .collection-button {
    .button-font();
    cursor: pointer;
    text-transform: uppercase;
    padding: 12px 16px;
    color: @ButtonSecondary;
    background-color: @ButtonPrimary;
    border: none;
    min-width: auto;
    position: relative;
    span {
      .text-line-clamp();
    }
    @media @desktop {
      padding: 12px 10px;
      background-color: @ButtonSecondary;
      color: @ButtonPrimary;
      width: 100%;
      max-width: 216px;
    }
  }
}
.collection-grid {
  display: grid;
  justify-content: center;
  .grid-gap(16px);
  padding: 0 16px;
  grid-template-columns: repeat(1, 1fr);

  @media @mobile-up {
    padding: 0 24px;
    grid-template-columns: repeat(auto-fit, calc((100% - 24px) / 3));
    .grid-gap(24px,12px);
  }

  @media @desktop {
    padding: 0 40px;
    grid-template-columns: repeat(
      auto-fit,
      calc((100% - (24px * (var(--grid-columns) - 1))) / var(--grid-columns))
    );
    .grid-gap(24px);
  }
}

.defaultGrid {
  display: grid;
  justify-content: center;
  .grid-gap(16px);
  padding: 0 16px;
  grid-template-columns: repeat(1, 1fr);

  @media @mobile-up {
    padding: 0 24px;
    grid-template-columns: repeat(auto-fit, calc((100% - 24px) / 3));
    .grid-gap(24px,12px);
    > div {
      margin-bottom: 16px;
    }
  }

  @media @desktop {
    padding: 0 40px;
    grid-template-columns: repeat(
      auto-fit,
      calc((100% - (24px * (3 - 1))) / 3)
    );
    .grid-gap(24px);
  }
}

.collection-horizontal {
  padding: 0 0 0 16px;
  @media @tablet-strict {
    padding: 0 24px;
  }
  @media @desktop {
    padding: 0 40px;
  }
  &.single-card {
    @media @mobile {
      padding-right: 16px;
    }
  }
}
.collection-block {
  cursor: initial;
  transition: 300ms all ease-out;
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

div[data-cardtype="COLLECTIONS"] {
  overflow: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black); //safari fix
  cursor: pointer !important;
  .image-wrapper {
    border-radius: @ImageRadius;
  }
  ::v-deep img {
    transition: 300ms all cubic-bezier(0, 0, 0.2, 1);
  }
  &:hover {
    ::v-deep img {
      transform: scale(1.1);
    }
  }
}
/deep/ .glide--swipeable {
  cursor: auto;
}

/deep/ .bullet-arrow-container {
  @media @mobile {
    margin-top: unset;
  }
}
</style>
