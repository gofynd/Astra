<template>
  <div class="section-main-container" :style="dynamicStyles" ref="heroImg">
    <emerge-img
      :src="isMobile ? getMobileUrl() : getDesktopUrl()"
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
          url: getMobileUrl(),
        },
        {
          breakpoint: { max: 767 },
          width: 380,
          url: getMobileUrl(),
        },
      ]"
      :showOverlay="displayOverlay"
      :overlayColor="getOverlayColor"
      class="hero__image"
      :aspectRatio="16 / 9"
      :mobileAspectRatio="9 / 16"
      v-if="showHeroImages"
    />
    <div class="overlay-items" :style="getOverlayPositionStyles">
      <h1
        class="header font-header"
        v-if="getSectionPropValue(settings, 'heading')"
      >
        {{ getSectionPropValue(settings, "heading") }}
      </h1>
      <p
        class="description b-small font-body"
        v-if="getSectionPropValue(settings, 'description')"
      >
        {{ getSectionPropValue(settings, "description") }}
      </p>
      <fdk-link
        :link="getSectionPropValue(settings, 'button_link')"
        v-if="getSectionPropValue(settings, 'button_text')"
      >
        <button
          class="cta_button font-body"
          :class="[
            `${
              getSectionPropValue(settings, 'invert_button_color')
                ? 'btn-secondary'
                : 'btn-primary'
            }`,
          ]"
        >
          {{ getSectionPropValue(settings, "button_text") }}
        </button>
      </fdk-link>
    </div>
  </div>
</template>
<!-- #region  -->

<settings>
{
    "name": "hero_image",
    "label": "Hero Image",
    "props": [
        {
            "type": "text",
            "id": "heading",
            "default": "What your Brand Says",
            "label": "Heading",
            "info": "Heading text of the section"
        },
        {
            "type": "text",
            "id": "description",
            "default": "Add highlights of your brands",
            "label": "Description",
            "info": "Description text of the section"
        },
        {
            "id": "overlay_option",
            "type": "select",
            "options": [
                {
                    "value": "no_overlay",
                    "text": "No Overlay"
                },
                {
                    "value": "white_overlay",
                    "text": "White Overlay"
                },
                {
                    "value": "black_overlay",
                    "text": "Black Overlay"
                }
            ],
            "default": "no_overlay",
            "label": "Overlay Option",
            "info": "Use this option to add a black or white semi-transparent overlay on top of the image. This will help you to stand out your text content"
        },
        {
            "type": "text",
            "id": "button_text",
            "default": "Shop Now",
            "label": "Button Text"
        },
        {
            "type": "url",
            "id": "button_link",
            "default": "",
            "label": "Redirect Link"
        },
        {
            "type": "checkbox",
            "id": "invert_button_color",
            "default": false,
            "label": "Invert Button Color (Toggle)",
            "info": "Inverted color of the primary button"
        },
        {
            "id": "desktop_banner",
            "type": "image_picker",
            "label": "Desktop Banner",
            "default": "",
            "options": {
              "aspect_ratio": "16:9",
              "aspect_ratio_strict_check":true
            }
        },
        {
            "id": "text_placement_desktop",
            "type": "select",
            "options": [
                {
                    "value": "top_left",
                    "text": "Top-Left"
                },
                {
                    "value": "top_center",
                    "text": "Top-Center"
                },
                {
                    "value": "top_right",
                    "text": "Top-Right"
                },
                {
                    "value": "center_left",
                    "text": "Center-Left"
                },
                {
                    "value": "center_center",
                    "text": "Center-Center"
                },
                {
                    "value": "center_right",
                    "text": "Center-Right"
                },
                {
                    "value": "bottom_left",
                    "text": "Bottom-Left"
                },
                {
                    "value": "bottom_center",
                    "text": "Bottom-Center"
                },
                {
                    "value": "bottom_right",
                    "text": "Bottom-Right"
                }
            ],
            "default": "top_left",
            "label": "Text Placement (Desktop)"
        },
        {
            "id": "text_alignment_desktop",
            "type": "select",
            "options": [
                {
                    "value": "left",
                    "text": "Left"
                },
                {
                    "value": "center",
                    "text": "Center"
                },
                {
                    "value": "right",
                    "text": "Right"
                }
            ],
            "default": "left",
            "label": "Text Alignment (Desktop)"
        },
        {
            "id": "mobile_banner",
            "type": "image_picker",
            "label": "Mobile/Tablet Banner",
            "default": "",
            "options": {
              "aspect_ratio": "9:16",
              "aspect_ratio_strict_check":true
            }
        },
        {
            "id": "text_placement_mobile",
            "type": "select",
            "options": [
                {
                    "value": "top_left",
                    "text": "Top-Left"
                },
                {
                    "value": "top_center",
                    "text": "Top-Center"
                },
                {
                    "value": "top_right",
                    "text": "Top-Right"
                },
                {
                    "value": "center_left",
                    "text": "Center-Left"
                },
                {
                    "value": "center_center",
                    "text": "Center-Center"
                },
                {
                    "value": "center_right",
                    "text": "Center-Right"
                },
                {
                    "value": "bottom_left",
                    "text": "Bottom-Left"
                },
                {
                    "value": "bottom_center",
                    "text": "Bottom-Center"
                },
                {
                    "value": "bottom_right",
                    "text": "Bottom-Right"
                }
            ],
            "default": "top_left",
            "label": "Text Placement (Mobile)"
        },
        {
            "id": "text_alignment_mobile",
            "type": "select",
            "options": [
                {
                    "value": "left",
                    "text": "Left"
                },
                {
                    "value": "center",
                    "text": "Center"
                },
                {
                    "value": "right",
                    "text": "Right"
                }
            ],
            "default": "left",
            "label": "Text Alignment (Mobile)"
        }
    ]
}
</settings>
<!-- #endregion -->

<script>
import emergeImage from "../global/components/common/emerge-image.vue";
import {
  getSectionPropValue,
  getGlobalConfigValue,
  detectMobileWidth,
} from "../helper/utils";
import { isBrowser } from "browser-or-node";

export default {
  components: {
    "emerge-img": emergeImage,
  },
  props: ["settings", "global_config"],
  data() {
    return {
      isMobile: false,
      windowWidth: isBrowser ? window.innerWidth : 0,
      heroObserver: null,
      showHeroImages: false,
    };
  },

  methods: {
    getSectionPropValue,
    onResize() {
      this.windowWidth = isBrowser ? window.innerWidth : 0;
    },
    getMobileUrl() {
      return (
        getSectionPropValue(this.settings, "mobile_banner") ||
        require("../assets/images/placeholder9x16.png")
      );
    },
    getDesktopUrl() {
      return (
        getSectionPropValue(this.settings, "desktop_banner") ||
        require("../assets/images/placeholder16x9.png")
      );
    },
    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.showHeroImages = true;
          this.heroObserver.unobserve(this.$el);
        }
      });
    },
  },
  mounted() {
    isBrowser && window.addEventListener("resize", this.onResize);
    this.isMobile = detectMobileWidth();
    if (isBrowser) {
      this.heroObserver = new IntersectionObserver(this.handleIntersection, {
        root: null,
        rootMargin: "0px",
        threshold: [0, 1],
      });
      this.heroObserver.observe(this.$el);
    }
  },
  computed: {
    getOverlayPositionStyles() {
      const positions = {};
      const responsiveViews = ["mobile", "desktop"];

      responsiveViews.forEach((view) => {
        const overlayPosition = this.getSectionPropValue(
          this.settings,
          `text_placement_${view}`
        );

        const contentAlignment = this.getSectionPropValue(
          this.settings,
          `text_alignment_${view}`
        );

        const isMobile = this.windowWidth <= 480;

        const HORIZONTAL_SPACING_TABLET = "1.75rem";
        const HORIZONTAL_SPACING_DESKTOP = "2.5rem";

        const VERTICAL_SPACING_MOBILE = "1rem";
        const VERTICAL_SPACING_TABLET = "1.5rem";
        const VERTICAL_SPACING_DESKTOP = "4rem";

        if (contentAlignment) {
          positions[`--content-alignment-${view}`] = contentAlignment;
        }

        switch (overlayPosition) {
          case "top_left":
            if (view === "mobile" && isMobile) {
              positions[`--top-position-${view}`] = VERTICAL_SPACING_MOBILE;
            } else {
              positions[`--top-position-${view}`] =
                view === "mobile"
                  ? VERTICAL_SPACING_TABLET
                  : VERTICAL_SPACING_DESKTOP;
              positions[`--left-position-${view}`] =
                view === "mobile"
                  ? HORIZONTAL_SPACING_TABLET
                  : HORIZONTAL_SPACING_DESKTOP;
            }

            break;

          case "top_center":
            if (view === "mobile" && isMobile) {
              positions[`--top-position-${view}`] = VERTICAL_SPACING_MOBILE;
            } else {
              positions[`--top-position-${view}`] =
                view === "mobile"
                  ? VERTICAL_SPACING_TABLET
                  : VERTICAL_SPACING_DESKTOP;
              positions[`--left-position-${view}`] = "50%";
              positions[`--transform-${view}`] = "translateX(-50%)";
            }

            break;

          case "top_right":
            if (view === "mobile" && isMobile) {
              positions[`--top-position-${view}`] = VERTICAL_SPACING_MOBILE;
            } else {
              positions[`--top-position-${view}`] =
                view === "mobile"
                  ? VERTICAL_SPACING_TABLET
                  : VERTICAL_SPACING_DESKTOP;
              positions[`--right-position-${view}`] =
                view === "mobile"
                  ? HORIZONTAL_SPACING_TABLET
                  : HORIZONTAL_SPACING_DESKTOP;
            }

            break;

          case "center_left":
            positions[`--top-position-${view}`] = "50%";
            positions[`--transform-${view}`] = "translateY(-50%)";
            positions[`--left-position-${view}`] =
              view === "mobile"
                ? HORIZONTAL_SPACING_TABLET
                : HORIZONTAL_SPACING_DESKTOP;

            break;

          case "center_center":
            positions[`--top-position-${view}`] = "50%";

            if (view === "mobile" && isMobile) {
              positions[`--transform-${view}`] = "translateY(-50%)";
            } else {
              positions[`--left-position-${view}`] = "50%";
              positions[`--transform-${view}`] = "translate(-50%, -50%)";
            }

            break;

          case "center_right":
            positions[`--top-position-${view}`] = "50%";
            positions[`--transform-${view}`] = "translateY(-50%)";
            positions[`--right-position-${view}`] =
              view === "mobile"
                ? HORIZONTAL_SPACING_TABLET
                : HORIZONTAL_SPACING_DESKTOP;

            break;

          case "bottom_left":
            if (view === "mobile" && isMobile) {
              positions[`--bottom-position-${view}`] = VERTICAL_SPACING_MOBILE;
            } else {
              positions[`--bottom-position-${view}`] =
                view === "mobile"
                  ? VERTICAL_SPACING_TABLET
                  : VERTICAL_SPACING_DESKTOP;
              positions[`--left-position-${view}`] =
                view === "mobile"
                  ? HORIZONTAL_SPACING_TABLET
                  : HORIZONTAL_SPACING_DESKTOP;
            }

            break;

          case "bottom_center":
            if (view === "mobile" && isMobile) {
              positions[`--bottom-position-${view}`] = VERTICAL_SPACING_MOBILE;
            } else {
              positions[`--bottom-position-${view}`] =
                view === "mobile"
                  ? VERTICAL_SPACING_TABLET
                  : VERTICAL_SPACING_DESKTOP;
              positions[`--left-position-${view}`] = "50%";
              positions[`--transform-${view}`] = "translateX(-50%)";
            }

            break;

          case "bottom_right":
            if (view === "mobile" && isMobile) {
              positions[`--bottom-position-${view}`] = VERTICAL_SPACING_MOBILE;
            } else {
              positions[`--bottom-position-${view}`] =
                view === "mobile"
                  ? VERTICAL_SPACING_TABLET
                  : VERTICAL_SPACING_DESKTOP;
              positions[`--right-position-${view}`] =
                view === "mobile"
                  ? HORIZONTAL_SPACING_TABLET
                  : HORIZONTAL_SPACING_DESKTOP;
            }

            break;

          default:
            break;
        }
      });

      return positions;
    },
    displayOverlay() {
      const overlayOption = this.getSectionPropValue(
        this.settings,
        "overlay_option"
      );

      return !!(overlayOption && overlayOption !== "no_overlay");
    },
    getOverlayColor() {
      const overlayType = this.getSectionPropValue(
        this.settings,
        "overlay_option"
      );

      return overlayType === "black_overlay" ? "#000000" : "#ffffff";
    },
    dynamicStyles() {
      return {
        "--p-bottom": "16px",
        "margin-bottom": `${getGlobalConfigValue(
          this.global_config,
          "section_margin_bottom"
        )}px`,
      };
    },
  },
  beforeDestroy() {
    isBrowser && window.removeEventListener("resize", this.onResize);
    if (this.heroObserver && isBrowser) {
      this.heroObserver.disconnect();
    }
  },
};
</script>

<style scoped lang="less">
.section-main-container {
  padding: 0;
  padding-bottom: var(--p-bottom);
}

.overlay-items {
  position: absolute;
  top: var(--top-position-desktop);
  left: var(--left-position-desktop);
  right: var(--right-position-desktop);
  bottom: calc(var(--bottom-position-desktop) + var(--p-bottom));
  transform: var(--transform-desktop);
  text-align: var(--content-alignment-desktop);
  z-index: 2;
  @media @mobile {
    padding: 0 1rem;
    width: 100%;
    top: var(--top-position-mobile);
    left: unset;
    right: unset;
    bottom: calc(var(--bottom-position-mobile) + var(--p-bottom));
    transform: var(--transform-mobile);
    text-align: var(--content-alignment-mobile);
  }

  @media @tablet-strict {
    max-width: 384px;
    top: var(--top-position-mobile);
    left: var(--left-position-mobile);
    right: var(--right-position-mobile);
    bottom: calc(var(--bottom-position-mobile) + var(--p-bottom));
    transform: var(--transform-mobile);
    text-align: var(--content-alignment-mobile);
  }

  @media @desktop {
    max-width: 543px;
  }

  .header {
    font-size: 64px;
    line-height: 66px;

    @media @tablet {
      font-size: 36px;
      line-height: 38px;
      letter-spacing: -0.02em;
    }
  }

  .description {
    margin-top: 8px;
    opacity: 0.8;
  }

  .cta_button {
    margin-top: 32px;
    padding: 16px 32px;
    border-radius: 0;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: -0.02em;
    text-transform: uppercase;

    @media @tablet {
      font-size: 12px;
      margin-top: 24px;
      line-height: 14px;
    }
  }
}
</style>
