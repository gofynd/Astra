<template>
  <section class="section testimonial-section" :style="dynamicStyles">
    <h2 class="section__title font-header">
      {{ getSectionPropValue(settings, "title") }}
    </h2>
    <GlideCarousel
      :glideOptions="getGlideOptions"
      showPerPage
      hasBullets
      hasArrows
    >
      <GlideSlide
        class="testimonial"
        v-for="(block, i) in getTestimonials"
        :key="i"
      >
        <emerge-image
          class="testimonial__image"
          v-if="getSectionPropValue(block, 'author_image')"
          :src="getSectionPropValue(block, 'author_image')"
          :sources="[
            { breakpoint: { min: 1024 }, width: 350 },
            { breakpoint: { min: 768 }, width: 350 },
            { breakpoint: { min: 481 }, width: 350 },
            { breakpoint: { max: 390 }, width: 350 },
          ]"
        />
        <div
          class="testimonial__info"
          :class="{ 'has-image': getSectionPropValue(block, 'author_image') }"
        >
          <div
            class="testimonial__info--text font-body"
            :title="getSectionPropValue(block, 'author_testimonial')"
          >
            "{{
              getSectionPropValue(block, "author_testimonial") ||
              "Add customer reviews and testimonials to showcase your store’s happy customers"
            }}"
          </div>
          <div class="testimonial__info--author">
            <h5
              class="name font-body"
              :title="getSectionPropValue(block, 'author_name')"
            >
              {{ getSectionPropValue(block, "author_name") || "Author Name" }}
            </h5>
            <div
              class="description caption-normal font-body"
              :title="getSectionPropValue(block, 'author_description')"
            >
              {{
                getSectionPropValue(block, "author_description") ||
                "Author Description"
              }}
            </div>
          </div>
        </div>
      </GlideSlide>
    </GlideCarousel>
  </section>
</template>
<!-- #region  -->
<settings>
{
    "name": "testimonials",
    "label": "Testimonial",
    "props": [
        {
            "type": "text",
            "id": "title",
            "default": "What People Are Saying About Us ",
            "label": "Heading"
        },
        {
            "type": "checkbox",
            "id": "autoplay",
            "default": false,
            "label": "AutoPlay Slides"
        },
        {
            "type": "range",
            "id": "slide_interval",
            "min": 1,
            "max": 10,
            "step": 1,
            "unit": "sec",
            "label": "Change slides every",
            "default": 2
        }
    ],
    "blocks": [
        {
            "type": "testimonial",
            "name": "Testimonial",
            "props": [
                {
                    "type": "image_picker",
                    "id": "author_image",
                    "default": "",
                    "label": "Image",
                    "options": {
                      "aspect_ratio": "1:1",
                      "aspect_ratio_strict_check":true
                    }
                },
                {
                    "type": "textarea",
                    "id": "author_testimonial",
                    "label": "Testimonial",
                    "default": "Add customer reviews and testimonials to showcase your store’s happy customers.",
                    "info": "Text for testimonial",
                    "placeholder": "Text"
                },
                {
                    "type": "text",
                    "id": "author_name",
                    "default": "Author Name",
                    "label": "Author Name"
                },
                {
                    "type": "text",
                    "id": "author_description",
                    "default": "Author Description",
                    "label": "Author Description"
                }
            ]
        }
    ],
   "preset":{
    "blocks": [
      {
                  "name": "Testimonial"
                },
                {
                  "name": "Testimonial"
                },
                {
                  "name": "Testimonial"
                }
    ]
  }

}
</settings>

<!-- #endregion -->
<style scoped lang="less">
@lg-min: 1024px;
.testimonial-section {
  .section__title {
    margin-bottom: 24px;
    text-align: center;
    padding: 0 16px;
    @media @mobile-up {
      padding: 0 40px;
    }
    @media @desktop {
      margin-bottom: 32px;
    }
  }
  .glide {
    padding-left: 16px;
    padding-right: var(--p-right-mob);
    @media @mobile-up {
      padding-left: 24px;
      padding-right: var(--p-right-tablet);
    }
    @media @desktop {
      padding: 0 40px;
    }
    ::v-deep .bullet-arrow-container {
      @media @mobile {
        display: none;
      }
    }
    ::v-deep .glide__arrows {
      @media @tablet {
        display: none;
      }
    }
  }
  .testimonial {
    display: flex;
    border-radius: @ImageRadius;
    background-color: @ThemeAccentL5;
    border: 1px solid @DividerStokes;
    height: auto;
    @media @tablet {
      flex-direction: column;
      justify-content: center;
    }
    @media @desktop {
      align-items: center;
      padding: 16px;
      .column-gap(16px);
    }

    &__image {
      border-radius: @ImageRadius;
      @media @desktop {
        flex: 0 0 232px;
      }
    }
    &__info {
      @media @tablet {
        padding: 16px;
        &.has-image {
          flex-grow: 1;
        }
      }
      @media @desktop {
        flex: 1 0 0;
        min-width: 0;
      }
      &--text {
        font-style: italic;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 16px;
        .overflow-ellipsis();
        @media @desktop {
          margin-bottom: 24px;
        }
      }
      &--author {
        .name {
          margin-bottom: 4px;
          .overflow-ellipsis();
        }
        .description {
          .overflow-ellipsis();
        }
      }
    }
  }
  /deep/ .glide--swipeable {
    cursor: auto;
  }
}
</style>

<script>
import { isBrowser } from "browser-or-node";
import {
  getSectionPropValue,
  getGlobalConfigValue,
  throttle,
} from "../helper/utils";
import emergeImage from "./../global/components/common/emerge-image.vue";
import GlideCarousel from "../global/components/glide-carousel.vue";
import GlideSlide from "../global/components/glide-slide.vue";

export default {
  props: ["settings", "global_config"],
  components: {
    "emerge-image": emergeImage,
    GlideCarousel,
    GlideSlide,
  },
  data: function () {
    return {
      isMounted: false,
      windowWidth: isBrowser ? window.innerWidth : 0,
    };
  },
  computed: {
    dynamicStyles() {
      return {
        padding: "16px 0",
        "margin-bottom": `${getGlobalConfigValue(
          this.global_config,
          "section_margin_bottom"
        )}px`,
        "--p-right-tablet": `${this.testimonials?.length < 3 ? "24px" : ""}`,
        "--p-right-mob": `${this.testimonials?.length < 2 ? "16px" : ""}`,
      };
    },
    getGlideOptions() {
      return {
        type: "slider",
        startAt: 0,
        focusAt: 0,
        autoplay: getSectionPropValue(this.settings, "autoplay")
          ? getSectionPropValue(this.settings, "slide_interval") * 1000
          : false,
        gap: this.getGapValue(32),
        perView: 2,
        peek: {
          before: 0,
          after: this.getAfterValue(2, 250),
        },
        swipeThreshold: false,
        dragThreshold: false,
        breakpoints: {
          1440: {
            perView: 2,
            gap: this.getGapValue(32),
            peek: {
              before: 0,
              after: this.getAfterValue(2, 150),
            },
          },
          1023: {
            perView: 2,
            gap: this.getGapValue(32),
            peek: {
              before: 0,
              after: this.getAfterValue(2, 100),
            },
            swipeThreshold: 80,
            dragThreshold: 120,
          },
          768: {
            perView: 2,
            gap: this.getGapValue(32),
            peek: {
              before: 0,
              after: this.getAfterValue(2, 75),
            },
            swipeThreshold: 80,
            dragThreshold: 120,
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
    getTestimonials() {
      const testimonial =
        this.settings.blocks.length === 0
          ? this.settings.preset.blocks
          : this.settings.blocks.filter((block) => {
              return (
                getSectionPropValue(block, "author_image") ||
                getSectionPropValue(block, "author_testimonial") ||
                getSectionPropValue(block, "author_name") ||
                getSectionPropValue(block, "author_description")
              );
            });
      if (this.windowWidth > 480) {
        return testimonial.slice(0, 8);
      }
      return testimonial.slice(0, 12);
    },
  },
  mounted() {
    isBrowser && window.addEventListener("resize", this.onResize);
  },
  methods: {
    getSectionPropValue,
    onResize: throttle(function () {
      this.windowWidth = isBrowser ? window.innerWidth : 0;
    }, 500),
    getAfterValue(perView, value) {
      return this.getTestimonials?.length > perView ? value : 0;
    },
    getGapValue(gap) {
      return this.getTestimonials?.length === 1 ? 0 : gap;
    },
  },
  beforeDestroy() {
    isBrowser && window.removeEventListener("resize", this.onResize);
  },
};
</script>
