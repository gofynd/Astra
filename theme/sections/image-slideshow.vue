<template>
  <div :style="dynamicStyles">
    <glideCaraousel
      :glideOptions="glideOptions"
      :has-bullets="getSlides.length === 1 ? false : true"
    >
      <glideSlide v-for="(block, index) in getSlides" :key="index">
        <fdk-link :link="getSectionPropValue(block, 'redirect_link')">
          <emerge-image
            :src="isMobile ? getMobileImage(block) : getDesktopImage(block)"
            :aspectRatio="16 / 5"
            :mobileAspectRatio="3 / 4"
            :sources="[
              {
                breakpoint: { min: 1400 },
                width: 1500,
              },
              {
                breakpoint: { min: 1023 },
                width: 1200,
              },
              {
                breakpoint: { min: 800 },
                width: 850,
              },
              {
                breakpoint: { min: 768 },
                width: 780,
                url: getMobileImage(block),
              },
              {
                breakpoint: { max: 767 },
                width: 380,
                url: getMobileImage(block),
              },
            ]"
            :placeholder="''"
          />
        </fdk-link>
      </glideSlide>
    </glideCaraousel>
  </div>
</template>
<!-- #region  -->

<settings>
{
  "name": "image_slideshow",
  "label": "Image Slideshow",
  "props": [
    {
      "type": "checkbox",
      "id": "autoplay",
      "default": false,
      "label": "Auto Play Slides",
      "info": "Check to autoplay slides"
    },
    {
      "type": "range",
      "id": "slide_interval",
      "min": 1,
      "max": 10,
      "step": 1,
      "unit": "sec",
      "label": "Change slides every",
      "default": 3,
      "info": "Autoplay slide duration"
    }
  ],
  "blocks": [
    {
      "type": "image_slide",
      "name": "Slide",
      "props": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Desktop Image",
          "options": {
            "aspect_ratio": "16:5",
            "aspect_ratio_strict_check":true
          }
        },
        
        {
          "type": "image_picker",
          "id": "mobile_image",
          "label": "Mobile Image",
          "options": {
            "aspect_ratio": "3:4",
            "aspect_ratio_strict_check":true
          }
        },
        {
          "type": "url",
          "id": "redirect_link",
          "label": "Slide Link"
        }
      ]
    }
  ],
  "preset": {
    "blocks": [{
                  "name": "Slide"
                },
                {
                  "name": "Slide"
                },
                {
                  "name": "Slide"
                }]
  }
}

</settings>
<!-- #endregion -->
<style scoped lang="less"></style>
<script>
import glideCaraousel from "../global/components/glide-carousel.vue";
import {
  getSectionPropValue,
  getGlobalConfigValue,
  detectMobileWidth,
} from "../helper/utils";
import glideSlide from "../global/components/glide-slide.vue";
import emergeImage from "../global/components/common/emerge-image.vue";

export default {
  props: ["settings", "global_config"],
  components: {
    "emerge-image": emergeImage,
    glideCaraousel,
    glideSlide,
  },
  watch: {
    settings: {
      handler(newValue) {
        if (newValue.props?.autoplay?.value) {
          this.glideOptions.autoplay =
            newValue.props?.slide_interval?.value * 1000;
        } else {
          this.glideOptions.autoplay = false;
        }
      },
      deep: true,
    },
  },
  data: function () {
    return {
      isMounted: false,
      isMobile: false,
      glideOptions: {
        autoplay: getSectionPropValue(this.settings, "autoplay")
          ? getSectionPropValue(this.settings, "slide_interval") * 1000
          : false,
        startAt: 0,
        gap: 0,
        perView: 1,
      },
    };
  },
  methods: {
    getSectionPropValue,
    getMobileImage(block) {
      return (
        getSectionPropValue(block, "mobile_image") ||
        require("../assets/images/placeholder3x4.png")
      );
    },
    getDesktopImage(block) {
      return (
        getSectionPropValue(block, "image") ||
        require("../assets/images/placeholder16x5.png")
      );
    },
  },
  computed: {
    dynamicStyles() {
      return {
        "padding-bottom": "16px",
        "margin-bottom": `${getGlobalConfigValue(
          this.global_config,
          "section_margin_bottom"
        )}px`,
      };
    },
    getSlides() {
      return this.settings?.blocks?.length === 0
        ? this.settings?.preset?.blocks
        : this.settings?.blocks;
    },
  },
  mounted() {
    this.isMobile = detectMobileWidth();
  },
};
</script>

<style lang="less" scoped>
::v-deep .bullet-arrow-container {
  @media @desktop {
    margin-top: 16px;
  }
}
</style>
