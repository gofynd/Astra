<template>
  <div
    class="image-wrapper"
    :class="{ fill: getGlobalConfigValue(global_config, 'img_fill') }"
    :style="dynamicStyles"
  >
    <div class="overlay" v-if="showOverlay" :style="getOverlayStyles" />
    <picture>
      <source
        v-for="(source, index) in sources"
        :key="index"
        :media="getMedia(source)"
        :srcset="getUrl(source.width, source.url)"
        type="image/webp"
      />
      <img
        class="fy__img"
        v-show="!showSkeleton || !isLoading"
        :srcset="fallbackSrcset"
        :src="getSrc"
        :alt="alt"
        @error="onError"
        @load="onLoad"
      />
      <image-skeleton
        class="fy__img"
        v-show="showSkeleton && isLoading"
        :aspectRatio="aspectRatio"
        :mobileAspectRatio="mobileAspectRatio"
      />
    </picture>
  </div>
</template>

<style lang="less" scoped>
.image-wrapper {
  overflow: hidden;
  position: relative;
  & > * {
    position: absolute;
    .inset(0);
  }
  &:before {
    content: "";
    display: block;
    padding-bottom: calc(100% * calc(1 / var(--aspect-ratio-mobile)));
  }

  @media @desktop {
    &:before {
      padding-bottom: calc(100% * calc(1 / var(--aspect-ratio-desktop)));
    }
  }
  picture {
    display: flex;
    align-items: center;
    background-color: var(--bg-color, transparent);
  }

  .overlay {
    position: absolute;
    background-color: var(--overlay-bgcolor);
    z-index: 1;
    opacity: 0.4;
    height: 100%;
    width: 100%;
  }

  .fy__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  &.fill {
    .fy__img {
      object-fit: cover;
    }
  }
}
</style>

<script>
import { getGlobalConfigValue, transformImage } from "../../../helper/utils";
import imageSkeleton from "../skeletons/image-skeleton.vue";

const PLACEHOLDER_URL = require("../../../assets/images/placeholder.png");
const IMAGE_SIZES = [
  "original",
  "30x0",
  "44x0",
  "66x0",
  "50x0",
  "75x0",
  "60x60",
  "90x90",
  "100x0",
  "130x200",
  "135x0",
  "270x0",
  "360x0",
  "500x0",
  "400x0",
  "540x0",
  "720x0",
  "312x480",
  "resize-(w|h)?:[0-9]+(,)?(w|h)*(:)?[0-9]*",
];
function searchStringInArray(str, strArray) {
  for (var j = 0; j < strArray.length; j++) {
    // eslint-disable-next-line no-useless-escape
    if (str.match(new RegExp("/" + strArray[j] + "/"))) return strArray[j];
  }
  return "";
}

export default {
  name: "emerge-image",
  components: { imageSkeleton },
  props: {
    backgroundColor: {
      type: String,
      default: "#ffffff",
    },
    src: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: PLACEHOLDER_URL,
    },
    alt: {
      type: String,
      default: "",
    },
    aspectRatio: {
      type: Number,
      default: 1,
    },
    mobileAspectRatio: {
      type: Number,
      default: 1,
    },
    showSkeleton: {
      type: Boolean,
      default: false,
    },
    showOverlay: {
      type: Boolean,
      default: false,
    },
    overlayColor: {
      type: String,
      default: "#ffffff",
    },
    sources: {
      type: Array,
      default() {
        return [
          { breakpoint: { min: 780 }, width: 1180 },
          { breakpoint: { min: 600 }, width: 580 },
          { breakpoint: { min: 480 }, width: 580 },
          { breakpoint: { min: 361 }, width: 460 },
          { breakpoint: { max: 360 }, width: 340 },
        ];
      },
    },
    global_config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      isError: false,
      isLoading: true,
    };
  },
  computed: {
    dynamicStyles() {
      return {
        "--aspect-ratio-desktop": `${this.aspectRatio}`,
        "--aspect-ratio-mobile": `${this.mobileAspectRatio}`,
        "--bg-color": `${getGlobalConfigValue(
          this.global_config,
          "img_container_bg"
        )}`,
      };
    },
    getOverlayStyles() {
      return {
        "--overlay-bgcolor": this.overlayColor,
      };
    },
    getSrc() {
      if (this.isError) {
        return this.placeholder;
      } else {
        return transformImage(this.src);
      }
    },
    getImageType() {
      return this.src.split(/[#?]/)[0].split(".").pop().trim();
    },
    fallbackSrcset() {
      let url = this.src;
      if (this.getImageType.toLowerCase() === "gif") {
        return "";
      }

      if (this.isError) {
        url = this.placeholder;
      }
      const key = searchStringInArray(url, IMAGE_SIZES);
      return this.sources
        .map((s) => {
          let src = url;
          if (key) {
            src = transformImage(url, key, s.width);
          }
          return `${src} ${s.width}w`;
        })
        .join(", ");
    },
  },
  methods: {
    getGlobalConfigValue,
    onError() {
      this.isError = true;
      this.isLoading = false;
      this.$forceUpdate();
    },
    onLoad() {
      this.isLoading = false;
    },

    getUrl(width, url = this.src) {
      if (this.getImageType.toLowerCase() === "gif") {
        return "";
      }

      if (this.isError) {
        url = this.placeholder;
      }
      const key = searchStringInArray(url, IMAGE_SIZES);
      if (key) {
        return transformImage(url, key, width);
      } else {
        return transformImage(url);
      }
    },
    getMedia(source) {
      if (source.breakpoint) {
        const min =
          (source.breakpoint.min &&
            `(min-width: ${source.breakpoint.min}px)`) ||
          "";
        const max =
          (source.breakpoint.max &&
            `(max-width: ${source.breakpoint.max}px)`) ||
          "";
        if (min && max) {
          return `${min} and ${max}`;
        } else {
          return min || max;
        }
      } else {
        return "";
      }
    },
  },
};
</script>
