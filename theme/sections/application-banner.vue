<template>
  <div :style="dynamicStyles">
    <fdk-link :link="getSectionPropValue(settings, 'banner_link')">
      <emerge-image
        :src="getDesktopImage()"
        :aspectRatio="19 / 6"
        :mobileAspectRatio="4 / 5"
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
          },

          {
            breakpoint: { max: 767 },
            width: 400,
            url: getMobileImage(),
          },
        ]"
        :placeholder="''"
      />
    </fdk-link>
  </div>
</template>
<settings>
{
  "name": "application_banner",
  "label": "Application Banner",
  "props": [
      {
        "type": "image_picker",
        "id": "image_desktop",
        "label": "Desktop Image",
        "default": "",
         "options": {
            "aspect_ratio": "19:6",
            "aspect_ratio_strict_check":true
          }
      },
      {
        "type": "image_picker",
        "id": "image_mobile",
        "label": "mobile Image",
        "default": "",
         "options": {
            "aspect_ratio": "4:5",
            "aspect_ratio_strict_check":true
          }
      },                  
    {
      "type": "url",
      "id": "banner_link",
      "default": "",
      "label": "Redirect Link"
    }   
  ]
}
</settings>
<script>
import emergeImageVue from "../global/components/common/emerge-image.vue";

import {
  getSectionPropValue,
  getGlobalConfigValue,
  detectMobileWidth,
} from "../helper/utils";
export default {
  props: ["settings", "context", "global_config"],

  components: {
    "emerge-image": emergeImageVue,
  },
  data: function () {
    return {
      isMobile: false,
    };
  },
  methods: {
    getSectionPropValue,

    getMobileImage() {
      return (
        getSectionPropValue(this.settings, "image_mobile") ||
        require("../assets/images/placeholder4x5.png")
      );
    },
    getDesktopImage() {
      return (
        getSectionPropValue(this.settings, "image_desktop") ||
        require("../assets/images/placeholder19x6.png")
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
  },
  mounted() {
    this.isMobile = detectMobileWidth();
  },
};
</script>
<style lang="less" scoped>
::v-deep .image-wrapper {
  @media @tablet-strict {
    .aspect-ratio(19/6);
  }
  img {
    transition: 300ms all cubic-bezier(0, 0, 0.2, 1);

    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
