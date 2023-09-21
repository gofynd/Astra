<template>
  <div>
    <div class="Trust-marker-heading">
      <h2 class="section-title font-header">
        {{ getSectionPropValue(settings, "title") }}
      </h2>
      <div class="section-description b2 font-body">
        {{ getSectionPropValue(settings, "description") }}
      </div>
    </div>
    <div v-if="showStackedView" class="section Trust-marker">
      <div class="Trust-marker-image-container">
        <fdk-link
          :link="getSectionPropValue(block, 'marker_link')"
          v-for="(block, i) in getTrustMarker"
          :key="i"
          class="marker-link"
          ><emerge-image
            class="Trust-marker-image"
            :src="getSectionPropValue(block, 'marker_logo')"
          />
          <div class="trust-marker-data">
            <span class="marker-heading caption-semi-bold font-header">{{
              getSectionPropValue(block, "marker_heading")
            }}</span>
            <span class="marker-description b-small font-body">{{
              getSectionPropValue(block, "marker_description")
            }}</span>
          </div>
        </fdk-link>
      </div>
    </div>
    <div v-else-if="showScrollView" class="sliderView">
      <GlideCarousel
        :glideOptions="glideOptions"
        hasArrows
        hasBullets
        showPerPage
      >
        <GlideSlide v-for="(block, i) in getTrustMarker" :key="i">
          <fdk-link
            :link="getSectionPropValue(block, 'marker_link')"
            class="marker-link"
            ><emerge-image
              class="Trust-marker-image"
              :src="getSectionPropValue(block, 'marker_logo')"
            />
            <span class="marker-heading caption-semi-bold font-header">{{
              getSectionPropValue(block, "marker_heading")
            }}</span>
            <span class="marker-description b-small font-body">{{
              getSectionPropValue(block, "marker_description")
            }}</span>
          </fdk-link>
        </GlideSlide>
      </GlideCarousel>
    </div>
  </div>
</template>

<settings>
    {
    "name": "trustmarker",
    "label": "Trust Marker",
    "props": [
        {
            "type": "text",
            "id": "title",
            "default": "Title ",
            "label": "Heading"
        },
       {
        "type": "text",
        "id":"description",
        "default":"Add description",
        "label":"Description"
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
        }
    ],
    "blocks": [
        {
            "type": "trustmarker",
            "name": "Trust Marker",
            "props": [
                {
                    "type": "image_picker",
                    "id": "marker_logo",
                    "default": "",
                    "label": "Icon",
                    "options": {
                      "aspect_ratio": "1:1",
                      "aspect_ratio_strict_check":true
                    }
                },
                {
                    "type": "text",
                    "id": "marker_heading",
                    "default": "Free Delivery",
                    "label": "Heading"
                },
                {
                    "type": "text",
                    "id": "marker_description",
                    "default": "Don`t love it? Don`t worry.Return delivery is free.",
                    "label": "Description"
                },
                {
                    "type":"url",
                    "id":"marker_link",
                    "default":"",
                    "label":"Redirect link"
                }
            ]
        }
    ],
   "preset":{
    "blocks": [
                {
                  "name": "Trust Marker",
                  "props": {
                    "marker_heading": {
                      "type": "text",
                      "value": "Free Delivery"
                    },
                    "marker_description": {
                      "type": "textarea",
                      "value": "Don't love it? Don't worry.Return delivery is free."
                    }
                  }
                },
                {
                  "name": "Trust Marker",
                  "props": {
                    "marker_heading": {
                      "type": "text",
                      "value": "Satisfied or Refunded"
                    },
                    "marker_description": {
                      "type": "textarea",
                      "value": "Don't love it? Don't worry.Return delivery is free."
                    }
                  }
                },
                {
                  "name": "Trust Marker",
                  "props": {
                    "marker_heading": {
                      "type": "text",
                      "value": "Top-notch Support"
                    },
                    "marker_description": {
                      "type": "textarea",
                      "value": "Don't love it? Don't worry.Return delivery is free."
                    }
                  }
                },
                {
                  "name": "Trust Marker",
                  "props": {
                    "marker_heading": {
                      "type": "text",
                      "value": "Secure Payments"
                    },
                    "marker_description": {
                      "type": "textarea",
                      "value": "Don't love it? Don't worry.Return delivery is free."
                    }
                  }
                },
                {
                  "name": "Trust Marker",
                  "props": {
                    "marker_heading": {
                      "type": "text",
                      "value": "5.0 star rating"
                    },
                    "marker_description": {
                      "type": "textarea",
                      "value": "Don't love it? Don't worry.Return delivery is free."
                    }
                  }
                }
              ]
  }

}

</settings>

<script>
import { isBrowser } from "browser-or-node";
import { throttle } from "../helper/utils";
import emergeImage from "../global/components/common/emerge-image.vue";
import { getSectionPropValue } from "../helper/utils";
import glideSlide from "../global/components/glide-slide.vue";
import glideCarousel from "../global/components/glide-carousel.vue";

export default {
  components: {
    emergeImage,
    GlideSlide: glideSlide,
    GlideCarousel: glideCarousel,
  },
  props: ["settings", "global_config"],

  data() {
    return {
      windowWidth: isBrowser ? window.innerWidth : 0,
      glideOptions: {
        type: "slider",
        startAt: 0,
        focusAt: 0,
        gap: 12,
        perView: 5,
        swipeThreshold: false,
        dragThreshold: false,
        breakpoints: {
          768: {
            perView: 3,
            gap: 4,
            peek: {
              before: 0,
              after: 180,
            },
          },
          480: {
            perView: 1,
            gap: 12,
          },
        },
      },
    };
  },
  computed: {
    getTrustMarker() {
      const marker =
        this.settings.blocks.length === 0
          ? this.settings.preset.blocks
          : this.settings.blocks.filter((block) => {
              return (
                getSectionPropValue(block, "marker_logo") ||
                getSectionPropValue(block, "marker_heading") ||
                getSectionPropValue(block, "marker_description") ||
                getSectionPropValue(block, "marker_link")
              );
            });
      if (this.windowWidth > 480) {
        return marker.slice(0, 8);
      }
      return marker.slice(0, 12);
    },
    showStackedView() {
      return (
        this.windowWidth < 769 ||
        this.getSectionPropValue(this.settings, "desktop_layout") === "grid" ||
        this.getTrustMarker.length <= 5
      );
    },
    showScrollView() {
      if (this.getTrustMarker.length <= 5 || this.windowWidth < 769) {
        return false;
      }
      return (
        this.getSectionPropValue(this.settings, "desktop_layout") ===
        "horizontal"
      );
    },
  },
  methods: {
    getSectionPropValue,
    onResize: throttle(function () {
      this.windowWidth = isBrowser ? window.innerWidth : 0;
    }, 450),
  },
  mounted() {
    this.isMounted = true;
    isBrowser && window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    isBrowser && window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style lang="less" scoped>
.Trust-marker-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.section-title {
  padding-bottom: 16px;
  text-align: center;
}

.section-description {
  text-align: center;
}
.Trust-marker-image-container {
  padding: 32px 40px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  @media @tablet {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  @media @mobile {
    display: flex;
    padding: 16px;
    gap: 16px;
    flex-direction: column;
  }
}
.marker-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid @DividerStokes;
  padding: 24px;
  width: 100%;
  border-radius: @ImageRadius;
  @media @mobile {
    flex-direction: row;
    gap: 16px;
    padding: 16px;
  }
}
.Trust-marker-image {
  width: 100px;
  height: 100px;
  @media @mobile {
    width: 64px;
    height: 64px;
    flex: 0 0 64px;
  }
}

.trust-marker-data {
  display: flex;
  flex-direction: column;
}
.marker-heading {
  font-size: 20px;
  text-align: center;
  line-height: 18px;
  letter-spacing: -0.4px;
  padding-top: 8px;
  text-transform: capitalize;
  color: @TextHeading;
  @media @tablet {
    padding-top: 16px;
    font-size: 14px;
    letter-spacing: -0.28px;
  }
  @media @mobile {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.28px;
    padding-top: 0px;
    text-align: left;
  }
}

.marker-description {
  color: var(--text-headings, #261a1a);
  text-align: center;
  padding-top: 8px;
  @media @mobile {
    text-align: left;
  }
}

/deep/ .glide__slides {
  -webkit-mask-image: -webkit-radial-gradient(white, black); //safari fix
}
/deep/ .image-wrapper {
  -webkit-mask-image: -webkit-radial-gradient(white, black); //safari fix
}
/deep/ .glide--swipeable {
  cursor: auto;
}
/deep/ glide__slide--active {
  width: auto !important;
}
.sliderView {
  padding: 32px 40px;
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

::v-deep {
  .image-wrapper .fy__img {
    object-fit: cover;
  }
}
</style>
