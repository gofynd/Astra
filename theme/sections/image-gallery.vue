<template>
  <div>
    <div
      :style="dynamicStyles"
      v-if="imagesForStackedView.length > 0 || imagesForScrollView.length > 0"
    >
      <div class="title-block">
        <h2
          class="section-heading font-header"
          v-if="
            getSectionPropValue(settings, 'title') ||
            getSectionPropValue(settings, 'cta_text')
          "
        >
          {{ getSectionPropValue(settings, "title") }}
        </h2>
        <p
          class="description b2 font-body"
          v-if="getSectionPropValue(settings, 'cta_text')"
        >
          {{ getSectionPropValue(settings, "cta_text") }}
        </p>
      </div>
      <template v-if="getGallery.length">
        <div
          v-if="isMounted && showStackedView"
          class="image-grid"
          :class="{ 'single-item': imagesForStackedView.length == 1 }"
          :style="`--per_row:${getSectionPropValue(
            settings,
            'item_count'
          )};--brand-item:${getWidthByCount || 1}`"
        >
          <div v-for="(block, index) in imagesForStackedView" :key="index">
            <fdk-link :link="getSectionPropValue(block, 'link')">
              <emerge-image
                class="gallery-item"
                :src="getImageSrc(block)"
                :sources="[
                  { breakpoint: { min: 1024 }, width: 450 },
                  { breakpoint: { min: 768 }, width: 250 },
                  { breakpoint: { min: 481 }, width: 200 },
                  { breakpoint: { max: 390 }, width: 200 },
                ]"
              >
              </emerge-image>
            </fdk-link>
          </div>
        </div>
        <div v-else-if="isMounted && showScrollView" class="sliderView">
          <no-ssr>
            <GlideCarousel
              :glideOptions="glideOptions"
              hasArrows
              hasBullets
              showPerPage
            >
              <GlideSlide
                v-for="(block, index) in imagesForScrollView"
                :key="index"
              >
                <fdk-link :link="getSectionPropValue(block, 'link')">
                  <emerge-image
                    v-if="showImages"
                    class="gallery-item"
                    :src="getImageSrc(block)"
                    :sources="[
                      { breakpoint: { min: 1024 }, width: 450 },
                      { breakpoint: { min: 768 }, width: 250 },
                      { breakpoint: { min: 481 }, width: 480 },
                      { breakpoint: { max: 390 }, width: 390 },
                    ]"
                  ></emerge-image>
                </fdk-link>
              </GlideSlide>
            </GlideCarousel>
          </no-ssr>
        </div>
      </template>
      <!-- <template v-else>
      <placeholder-items
        :count="getSectionPropValue(settings, 'item_count') * 2"
        :items_per_row="getSectionPropValue(settings, 'item_count')"
        type="image"
        text=""
        :layout="getSectionPropValue(settings, 'desktop_layout')"
      />
    </template> -->
    </div>
  </div>
</template>
<!-- #region  -->

<settings>
{
    "name": "image_gallery",
    "label": "Image Gallery",
    "props": [
      {
         "type": "checkbox",
            "id": "autoplay",
            "default": false,
            "label": "Auto Play Slides"
      },
       {
          "type":"range",
          "id":"play_slides",
          "min":1 ,
          "max":10 ,
          "step":1,
          "unit":"sec",
          "label":"Change slides every",
          "default":3
          
        },
       {
            "type": "range",
            "id": "item_count",
            "min": 3,
            "max": 5,
            "step": 1,
            "unit": "",
            "label": "Items per row(Desktop)",
            "default": 4,
            "info": "Maximum items allowed per row for Horizontal view, for gallery max 5 are viewable and only 5 blocks are required"
        },
        {
            "id": "mobile_layout",
            "type": "select",
            "options": [
                {
                    "value": "grid",
                    "text": "Stack"
                },
                {
                    "value": "horizontal",
                    "text": "Horizontal scroll "
                }
            ],
            "default": "grid",
            "label": "Mobile Layout",
            "info": "Alignment of content"
        },
        {
          "id": "desktop_layout",
          "type": "select",
          "options": [
              {
                  "value": "grid",
                  "text": "Stack"
              },
              {
                  "value": "horizontal",
                  "text": "Horizontal scroll"
              }
          ],
          "default": "horizontal",
          "label": "Desktop Layout",
          "info": "Alignment of content"
        },
        {
          "type": "text",
          "id": "title",
          "default": "A True Style",
          "label": "Heading"
        },
        {
            "type": "text",
            "id": "cta_text",
            "default": "Be exclusive, Be Devine, Be yourself",
            "label": "Description"
        }
    ],
    "blocks": [
        {
            "type": "gallery_image",
            "name": "Image",
            "props": [
                {
                    "type": "image_picker",
                    "id": "image",
                    "label": "Image",
                    "default": "",
                    "options": {
                      "aspect_ratio": "1:1",
                      "aspect_ratio_strict_check":true
                    }
                },
               
                {
                    "type": "url",
                    "id": "link",
                    "label": "Redirect",
                    "default": "",
                    "info": "Search Link Type"
                }
            ]
        }
    ],
    "preset": {
      "blocks": [
        {
          "name": "Image"
        },
        {
          "name": "Image"
        },
        {
          "name": "Image"
        }
      ]
    }
   
}
</settings>
<!-- #endregion -->
<style scoped lang="less">
.title-block {
  padding: 0 40px;
  @media @tablet {
    padding: 0 16px;
  }
  .section-heading {
    margin-bottom: 16px;
    text-align: center;
    @media @tablet {
      margin-bottom: 8px;
    }
  }
  .description {
    text-align: center;
    margin-bottom: 32px;
    @media @tablet {
      margin-bottom: 24px;
    }
  }
}

::v-deep .image-wrapper {
  img {
    transition: 300ms all cubic-bezier(0, 0, 0.2, 1);

    &:hover {
      transform: scale(1.1);
    }
  }
}

/deep/ .glide__slides {
  border-radius: @ImageRadius;
  -webkit-mask-image: -webkit-radial-gradient(white, black); //safari fix
}
/deep/ .image-wrapper {
  border-radius: @ImageRadius;
  -webkit-mask-image: -webkit-radial-gradient(white, black); //safari fix
}
/deep/ .glide--swipeable {
  cursor: auto;
}
.sliderView {
  padding: 0 40px;
  @media @tablet {
    padding: 0 24px;
  }
  @media @mobile {
    padding-left: 16px;
    padding-right: var(--p-right-mob, 16px);
  }
  ::v-deep .bullet-arrow-container {
    @media @mobile {
      display: none;
    }
  }
}

.image-grid {
  display: grid;
  .grid-gap(32px, 24px);
  padding: 0 40px;
  grid-template-columns: repeat(var(--per_row), 1fr);

  &.single-item {
    display: flex;
    justify-content: center;
    & > * {
      flex: 0 1 calc(100% / var(--per_row));
      @media @mobile {
        flex: 1;
      }
    }
  }
  @media @tablet {
    grid-template-columns: repeat(var(--brand-item), 1fr);
    .grid-gap(24px, 16px);
    padding: 0 24px;
  }
  @media @mobile {
    .grid-gap(14px);
    grid-template-columns: repeat(2, 1fr);
    padding: 0 16px;
  }
}
</style>
<script>
import { isBrowser } from "browser-or-node";
import NoSSR from "vue-no-ssr";
import {
  getSectionPropValue,
  getGlobalConfigValue,
  throttle,
} from "../helper/utils";
import GlideCarousel from "./../global/components/glide-carousel.vue";
import GlideSlide from "./../global/components/glide-slide.vue";
import emergeImage from "../global/components/common/emerge-image.vue";
export default {
  props: ["settings", "global_config"],
  components: {
    "no-ssr": NoSSR,
    "emerge-image": emergeImage,
    GlideCarousel,
    GlideSlide,
  },
  watch: {
    settings: {
      handler(newVal) {
        if (newVal.props?.autoplay?.value) {
          this.glideOptions.autoplay = newVal.props?.play_slides?.value * 1000;
        } else {
          this.glideOptions.autoplay = false;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.isMounted = true;
    isBrowser && window.addEventListener("resize", this.onResize);
    if (isBrowser) {
      this.observerImg = new IntersectionObserver(this.handleIntersection, {
        root: null,
        rootMargin: "0px",
        threshold: [0, 1],
      });
      this.observerImg.observe(this.$el);
    }
  },
  computed: {
    getGallery() {
      return this.settings?.blocks?.length === 0
        ? this.settings?.preset?.blocks
        : this.settings?.blocks;
    },
    imagesForStackedView() {
      const itemCount = this.getSectionPropValue(this.settings, "item_count");

      if (!this.getGallery) return [];

      if (this.windowWidth <= 480) {
        return this.getGallery.slice(0, 8);
      } else if (this.windowWidth <= 768) {
        return this.getGallery.slice(0, 9);
      } else {
        return this.getGallery.slice(0, itemCount * 2);
      }
    },
    imagesForScrollView() {
      const itemCount = this.getSectionPropValue(this.settings, "item_count");

      if (!this.getGallery) return [];

      if (this.windowWidth <= 480) {
        return this.getGallery;
      } else if (this.windowWidth <= 768) {
        return this.getGallery.slice(0, 12);
      } else {
        return this.getGallery.slice(0, itemCount * 4);
      }
    },
    showStackedView() {
      if (this.windowWidth <= 768) {
        return (
          this.getSectionPropValue(this.settings, "mobile_layout") === "grid"
        );
      }

      return (
        this.getSectionPropValue(this.settings, "desktop_layout") === "grid"
      );
    },
    showScrollView() {
      if (this.windowWidth <= 768) {
        return (
          this.getSectionPropValue(this.settings, "mobile_layout") ===
          "horizontal"
        );
      }

      return (
        this.getSectionPropValue(this.settings, "desktop_layout") ===
        "horizontal"
      );
    },
    getWidthByCount() {
      if (this.windowWidth <= 768) {
        return this.getGallery?.length <= 3 ? this.getGallery?.length : 3;
      }
      return this.getGallery?.length <
        this.getSectionPropValue(this.settings, "item_count")
        ? this.getGallery?.length
        : this.getSectionPropValue(this.settings, "item_count");
    },

    dynamicStyles() {
      return {
        padding: "16px 0",
        "margin-bottom": `${getGlobalConfigValue(
          this.global_config,
          "section_margin_bottom"
        )}px`,
        "--p-right-mob": `${this.imagesForScrollView.length > 1 ? "0" : ""}`,
      };
    },
  },
  data: function () {
    return {
      isMounted: false,
      windowWidth: isBrowser ? window.innerWidth : 0,
      observer: null,
      showImages: false,
      glideOptions: {
        type: "slider",
        startAt: 0,
        gap: 24,
        focusAt: 0,
        perView: getSectionPropValue(this.settings, "item_count"),
        autoplay: getSectionPropValue(this.settings, "autoplay")
          ? getSectionPropValue(this.settings, "play_slides") * 1000
          : false,
        swipeThreshold: 40,
        dragThreshold: false,
        breakpoints: {
          768: {
            perView: 3,
            gap: 16,
          },
          480: {
            perView: 1,
            gap: 12,
            peek: {
              before: 0,
              after: 50,
            },
          },
        },
      },
    };
  },
  beforeMount() {
    this.glideOptions = {
      ...this.glideOptions,
      gap: this.getGallery?.length === 1 ? 0 : 24,
      breakpoints: {
        768: {
          perView: 3,
          gap: this.getGallery?.length === 1 ? 0 : 16,
          swipeThreshold: 80,
          dragThreshold: 120,
        },
        480: {
          perView: 1,
          gap: this.getGallery?.length === 1 ? 0 : 12,
          swipeThreshold: 80,
          dragThreshold: 120,
          peek: {
            before: 0,
            after: this.getGallery?.length === 1 ? 0 : 100,
          },
        },
      },
    };
  },
  methods: {
    getSectionPropValue,
    onResize: throttle(function () {
      this.windowWidth = isBrowser ? window.innerWidth : 0;
    }, 500),
    getImageSrc(block) {
      return (
        this.getSectionPropValue(block, "image") ||
        require("../assets/images/placeholder1X1.png")
      );
    },
    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.showImages = true;
          this.observerImg.unobserve(this.$el);
        }
      });
    },
  },

  beforeDestroy() {
    isBrowser && window.removeEventListener("resize", this.onResize);
    if (this.observerImg && isBrowser) {
      this.observerImg.disconnect();
    }
  },
};
</script>
