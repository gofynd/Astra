<template>
  <div>
    <div v-if="type === 'image'" class="load-image" @click="openGallery">
      <emerge-image
        :src="source"
        :alt="alt"
        class="pdp-image animated fadeIn"
        :aspectRatio="getProductImgAspectRatio"
        :showSkeleton="true"
        :global_config="global_config"
      ></emerge-image>
    </div>
    <div v-if="type === 'video'" class="video-container">
      <div
        v-if="!getOriginalImage().includes('youtube')"
        class="video-player-wrapper"
      >
        <video
          id="html-video-player"
          class="originalVideo video-player"
          :src="getOriginalImage()"
          data-loaded="false"
          :controls="false"
          :autoplay="true"
          :muted="isMute"
          @loadeddata="iframeload"
          @click="pauseVideo"
          @ended="onVideoEnd"
        ></video>

        <svg-wrapper
          :svg_src="'replay'"
          class="player-icon player-replay"
          v-if="showReplayButton"
          @click.native="restartVideo"
        ></svg-wrapper>

        <svg-wrapper
          :svg_src="isMute ? 'mute' : 'unmute'"
          class="player-icon player-mute"
          @click.native="toggleMute"
        ></svg-wrapper>

        <svg-wrapper
          :svg_src="'expand-media'"
          class="player-icon player-expand"
          @click.native="onPlayerExpand"
        ></svg-wrapper>
      </div>
      <fdk-loader id="loader" v-if="isFrameLoading"></fdk-loader>
      <iframe
        v-if="getOriginalImage().includes('youtube')"
        class="originalVideo"
        :src="getOriginalImage()"
        allowfullscreen
        @load="iframeload"
      ></iframe>
    </div>
    <div v-if="type === '3d_model' && isMounted" class="type-3d_model">
      <no-ssr>
        <viewer-3d :src="getOriginalImage()"></viewer-3d>
      </no-ssr>
      <div class="expand-btn" @click="openGallery">
        <svg-wrapper :svg_src="'auto-rotate'"></svg-wrapper>
      </div>
    </div>
  </div>
</template>

<script>
import { getProductImgAspectRatio } from "../../helper/utils";
import { isNode } from "browser-or-node";
import SvgWrapper from "../common/svg-wrapper.vue";
import EmergeImage from "../../global/components/common/emerge-image.vue";
import NoSSR from "vue-no-ssr";

export default {
  name: "piczoom",
  props: {
    source: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    alt: {
      type: String,
    },
    currentIndex: {
      type: Number,
      required: true,
    },
    resumeVideo: {
      type: Boolean,
      default: false,
    },
    global_config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    "no-ssr": NoSSR,
    "svg-wrapper": SvgWrapper,
    "emerge-image": EmergeImage,
    "viewer-3d": () =>
      isNode ? Promise.resolve(null) : Promise.resolve(require("./viewer-3d")),
  },
  data() {
    return {
      imageFullyLoaded: true,
      imageLoading: false,
      isMounted: false,
      isFrameLoading: true,
      isMute: true,
      showReplayButton: false,
    };
  },
  watch: {
    source: {
      handler: function (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.showReplayButton = false;
        }
      },
      immediate: true,
    },
    resumeVideo(newValue, oldValue) {
      if (newValue !== oldValue && !this.showReplayButton) {
        let videoPlayer = document.getElementById("html-video-player");
        videoPlayer && videoPlayer.play();
      }
    },
  },
  mounted() {
    this.isMounted = true;
    this.isFrameLoading = true;
  },
  computed: {
    getProductColor() {
      if (!this.imageFullyLoaded) {
        return this.product.attributes
          ? "#" + this.product.attributes.primary_color_hex
          : "";
      }
      return "";
    },
    getPDPImageURL() {
      return this.source;
    },
    getProductImgAspectRatio() {
      return getProductImgAspectRatio(this.global_config);
    },
  },
  methods: {
    onPlayerExpand() {
      if (!this.showReplayButton) {
        let videoPlayer = document.getElementById("html-video-player");

        videoPlayer && videoPlayer.pause();
      }

      this.openGallery();
    },
    toggleMute() {
      this.isMute = !this.isMute;
    },
    restartVideo() {
      this.showReplayButton = false;
      let videoPlayer = document.getElementById("html-video-player");
      videoPlayer.currentTime = 0;
      videoPlayer.play();
    },
    pauseVideo() {
      if (!this.showReplayButton) {
        let videoPlayer = document.getElementById("html-video-player");

        videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();
      }
    },
    onVideoEnd() {
      this.showReplayButton = true;
    },
    iframeload() {
      this.isFrameLoading = false;
    },
    imageLoaded() {
      this.imageFullyLoaded = true;
    },
    getOriginalImage() {
      return this.source || "";
    },
    openGallery() {
      this.$emit("clickimage", this.currentIndex);
    },
  },
};
</script>

<style lang="less" scoped>
.load-image {
  cursor: zoom-in;
}
.bgopacity {
  opacity: 0.5;
}
.pdp-image {
  background-image: @ContainerBGImage;
  border-radius: @ImageRadius;
}
.originalImg {
  left: 0;
  position: absolute;
  top: 0;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  max-width: 720px;
}

.video-container {
  height: 100%;
  display: flex;
  align-items: center;

  .originalVideo {
    width: 100%;
    height: 50%;
    cursor: pointer;
  }
}
.type-3d_model {
  position: relative;
  width: 100%;
  .aspect-ratio(@ProductImgAspectRatio);

  /deep/ model-viewer {
    width: 100%;
    height: 100%;
  }
  .expand-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    top: unset;
    left: unset;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}
#loader {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 93%;
}

.video-player-wrapper {
  position: relative;
  max-height: 100%;
  display: flex;
  align-items: center;

  .player-icon {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }

  .player-mute {
    position: absolute;
    bottom: 10px;
    left: 10px;
  }

  .player-expand {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  .player-replay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
