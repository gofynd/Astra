<!--Imported from https://github.com/pexea12/vue-image-lightbox-->

<template>
  <div @click.stop="closeLightBox">
    <div
      class="vue-lb-container"
      v-show="lightBoxOn"
      v-if="images && images.length > 0"
    >
      <div class="vue-lb-content">
        <div class="vue-lb-header">
          <h4>Image ({{ select + 1 }}/{{ images.length }})</h4>
          <button type="button" :title="closeText" class="vue-lb-button-close">
            <slot name="close">
              <span>
                <svg-wrapper :svg_src="'close'"></svg-wrapper>
              </span>
            </slot>
          </button>
          <!-- .vue-lb-button-close -->
        </div>
        <!-- .vue-lb-header -->
        <div class="vue-lb-figure" @click.stop ref="container">
          <transition mode="out-in" name="fade">
            <div class="media-wrapper">
              <template v-if="selectLoading"> </template>
              <template v-else>
                <emerge-image
                  v-if="images[select].type === 'image'"
                  :src="images[select].url.replace('resize:w-540', 'original')"
                  :alt="images[select].alt"
                  class="vue-lb-modal-media vue-lb-modal-image"
                  :sources="[
                    { breakpoint: { min: 481 }, width: 800 },
                    { breakpoint: { max: 480 }, width: 540 },
                  ]"
                  :mobileAspectRatio="getProductImgAspectRatio"
                  :aspectRatio="getProductImgAspectRatio"
                  :global_config="global_config"
                />
                <div
                  class="video-container"
                  v-if="images[select].type === 'video'"
                >
                  <iframe
                    v-if="images[select].url.includes('youtube')"
                    :key="images[select].url"
                    :src="images[select].url + `?enablejsapi=1&html5=1`"
                    :srcset="images[select].srcset || ''"
                    class="vue-lb-modal-media youtube-player"
                    allowfullscreen
                  ></iframe>
                  <div class="video-player-container" v-else>
                    <div class="player-wrapper">
                      <video
                        :key="images[select].url"
                        :src="images[select].url"
                        :srcset="images[select].srcset || ''"
                        class="vue-lb-modal-media"
                        :controls="false"
                        :autoplay="true"
                        :muted="isMute"
                        ref="videoPlayer"
                        @click="pauseVideo"
                        @ended="onVideoEnd"
                      />

                      <svg-wrapper
                        v-if="showReplayButton"
                        class="player-icon player-replay"
                        :svg_src="'replay'"
                        @click.native="restartVideo"
                      ></svg-wrapper>

                      <svg-wrapper
                        class="player-icon player-mute"
                        :svg_src="isMute ? 'mute' : 'unmute'"
                        @click.native="toggleMute"
                      ></svg-wrapper>
                    </div>
                  </div>
                </div>

                <div
                  v-if="images[select].type === '3d_model' && isMounted"
                  class="vue-lb-modal-media type-3d_model"
                >
                  <no-ssr>
                    <viewer-3d
                      :src="images[select].url"
                      :autoRotate="true"
                    ></viewer-3d>
                  </no-ssr>
                </div>
              </template>
              <svg-wrapper
                :svg_src="'close-white'"
                class="close-icon"
                @click.native="closeLightBox"
              ></svg-wrapper>
              <button
                v-if="images.length > 1"
                type="button"
                :class="[
                  'vue-lb-arrow',
                  'vue-lb-left',
                  { 'disable-arrow': select === 0 },
                ]"
                :title="previousText"
                @click.stop="previousImage"
                :disabled="select === 0"
              >
                <slot name="previous">
                  <svg-wrapper :svg_src="'arrow-left-white'"></svg-wrapper>
                </slot>
              </button>

              <button
                v-if="images.length > 1"
                type="button"
                :class="[
                  'vue-lb-arrow',
                  'vue-lb-right',
                  { 'disable-arrow': select === images.length - 1 },
                ]"
                :title="nextText"
                @click.stop="nextImage"
                :disabled="select === images.length - 1"
              >
                <slot name="next">
                  <svg-wrapper :svg_src="'arrow-right-white'"></svg-wrapper>
                </slot>
              </button>

              <div
                class="vue-lb-thumbnail-wrapper"
                :style="`--icon-color: ${iconColor};`"
              >
                <div v-if="showThumbs" class="vue-lb-thumbnail">
                  <!-- 
                  <button
                    v-if="images.length > 1"
                    type="button"
                    class="vue-lb-thumbnail-arrow vue-lb-thumbnail-left"
                    :title="previousThumbText"
                    @click.stop="previousImage()"
                  >
                    <slot name="previousThumb">
                      <svg-wrapper
                        :svg_src="'arrow-left-white'"
                        class="nav-arrow-icon"
                      ></svg-wrapper>
                    </slot>
                  </button> 
                  -->

                  <!-- Thumbnail Wrapper feature -->

                  <div
                    v-for="(image, index) in imagesThumb"
                    :key="
                      typeof image === 'string' ? `${image}${index}` : index
                    "
                    v-show="
                      index >= thumbIndex.begin && index <= thumbIndex.end
                    "
                    @click.stop="showImage(index)"
                    class="thumbnail-item"
                  >
                    <emerge-image
                      v-if="image.type === 'image'"
                      :src="image.src"
                      :alt="image.alt"
                      :class="
                        'vue-lb-modal-thumbnail' +
                        (select === index ? '-active' : '')
                      "
                      :mobileAspectRatio="getProductImgAspectRatio"
                      :aspectRatio="getProductImgAspectRatio"
                      :global_config="global_config"
                    ></emerge-image>
                    <div
                      v-else-if="image.type === 'video'"
                      :class="['video-thumbnail-container']"
                    >
                      <img
                        v-if="image.src.includes('youtube')"
                        :alt="image.alt"
                        :src="getImageURL(image.src)"
                        :class="
                          'vue-lb-modal-video-thumbnail' +
                          (select === index ? '-active' : '')
                        "
                      />
                      <video
                        :src="image.src"
                        v-else
                        :class="
                          'vue-lb-modal-video-thumbnail' +
                          (select === index ? '-active' : '')
                        "
                      ></video>
                      <svg-wrapper
                        :svg_src="'video-play'"
                        class="video-play-icon"
                      ></svg-wrapper>
                    </div>
                    <div
                      v-if="image.type === '3d_model' && isMounted"
                      class="type-3d_model-thumbnail"
                      :class="
                        'vue-lb-modal-thumbnail' +
                        (select === index ? '-active' : '')
                      "
                    >
                      <svg-wrapper
                        :svg_src="'3D'"
                        class="model-icon"
                      ></svg-wrapper>
                    </div>
                  </div>

                  <!-- 
                  <button
                    v-if="images.length > 1"
                    type="button"
                    class="vue-lb-thumbnail-arrow vue-lb-thumbnail-right"
                    :title="nextThumbText"
                    @click.stop="nextImage()"
                  >
                    <slot name="nextThumb">
                      <svg-wrapper
                        :svg_src="'arrow-right-white'"
                        class="nav-arrow-icon"
                      ></svg-wrapper>
                    </slot>
                  </button> 
                  -->
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <!-- .vue-lb-container -->
  </div>
</template>

<style lang="less" scoped>
@HeaderHeight: 56px;

.vue-lb-box {
  width: 100%;
}

.vue-lb-container {
  background-color: #f3f3ed;
  box-sizing: border-box;
  height: 100%;
  left: 0px;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 101;
  -moz-box-sizing: border-box;
  -ms-flex-align: center;
  -webkit-box-align: center;
  -ms-flex-pack: center;
  -webkit-box-pack: center;
  user-select: auto !important;
  -webkit-user-drag: auto !important;
  -webkit-user-select: text !important;
  -ms-user-select: text !important;
  -moz-user-select: text !important;
  touch-action: unset !important;

  @media @desktop {
    background-color: rgba(20, 19, 14, 0.6);
  }
}

.vue-lb-content {
  position: relative;
  height: 100%;
  max-width: @page-width;
  margin: 0 auto;
}

.vue-lb-header {
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  -webkit-box-pack: justify;
  background-color: #efe7d6;
  align-items: center;
  padding: 1rem;

  @media @desktop {
    display: none;
  }
}

.vue-lb-button-close {
  background: none;
  border: none;
  cursor: pointer;
  width: 24px;
}

.vue-lb-figure {
  height: 100%;
  @media @tablet {
    height: calc(100vh - @HeaderHeight);
    display: flex;
    align-items: center;
  }

  .media-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    margin: auto;
    &::before {
      content: "";
      display: block;
      max-height: calc(100vh - @HeaderHeight);
      height: calc(100vw / @ProductImgAspectRatio);
      width: calc((100vh - @HeaderHeight) * @ProductImgAspectRatio);
      max-width: 100vw;
    }
    @media @desktop {
      height: 90vh;
      background-color: @DialogBackground;
      &::before {
        max-height: unset;
        max-width: unset;
        height: 100%;
        width: calc(90vh * @ProductImgAspectRatio);
      }
    }
    .vue-lb-modal-media:not(.youtube-player):not(video) {
      position: absolute;
      .inset(0);
    }

    .close-icon {
      position: absolute;
      top: 2%;
      right: 2%;
      left: unset;
      bottom: unset;
      cursor: pointer;
      display: none;
      width: 32px;
      height: 32px;

      @media @desktop {
        display: flex;
      }
    }

    .video-close-icon {
      top: -40px;
      right: 0%;
    }
  }

  @media @desktop {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.vue-lb-modal-media {
  display: block;
  margin: 0 auto;
  background-color: @PageBackground;
}

.type-3d_model {
  .aspect-ratio(@ProductImgAspectRatio);
}

.vue-lb-info {
  visibility: initial;
  position: absolute;
  bottom: 25px;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  height: 40px;
  width: 100%;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  text-align: center;
}

.vue-lb-footer {
  box-sizing: border-box;
  color: white;
  cursor: auto;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  left: 0px;
  line-height: 1.3;
  padding-bottom: 5px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 5px;
  -moz-box-sizing: border-box;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  -webkit-box-pack: justify;
}

.vue-lb-footer-info {
  display: block;
  flex: 1 1 0;
  -webkit-flex: 1 1 0;
  -ms-flex: 1 1 0;
}

.vue-lb-footer-count {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.85em;
  padding-left: 1em;
}

.vue-lb-thumbnail {
  text-align: center;
  white-space: nowrap;
  display: flex;
  position: relative;
  justify-content: center;
  margin: 0 auto;
  width: 53%;
}

.vue-lb-modal-thumbnail {
  border-radius: 24px;
  cursor: pointer;
  margin: 0 4px;
  box-shadow: 0px 0px 0px 3px transparent;
  background-color: @White;
}

.vue-lb-modal-video-thumbnail {
  border-radius: 24px;
  cursor: pointer;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 0px 3px transparent;
  background-color: @White;
}

.vue-lb-modal-video-thumbnail-active {
  .vue-lb-modal-video-thumbnail();
  box-shadow: 0px 0px 0px 3px @ThemeAccentD4;
}

.vue-lb-modal-thumbnail-active {
  .vue-lb-modal-thumbnail();
  box-shadow: 0px 0px 0px 3px @ThemeAccentD4;
}

.vue-lb-modal-thumbnail,
.vue-lb-modal-thumbnail-active {
  &.type-3d_model-thumbnail {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .model-icon {
      width: 24px;
      height: 24px;

      /deep/ svg path {
        fill: var(--icon-color);
      }
    }
  }
}

.vue-lb-thumbnail-arrow {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  -webkit-touch-callout: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  .nav-arrow-icon {
    width: 32px;
  }
}

.vue-lb-arrow {
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.vue-lb-left {
  left: 10px;

  @media @tablet-strict {
    left: 15%;
  }
  @media @desktop {
    left: 2%;
  }
}

.vue-lb-right {
  right: 10px;

  @media @tablet-strict {
    right: 15%;
  }
  @media @desktop {
    right: 2%;
  }
}

.vue-lb-open {
  overflow: hidden;
}

.vue-lb-thumbnail-wrapper {
  bottom: 1rem;
  left: 0;
  margin: 0 auto;
  position: absolute;
  right: 0;
  text-align: center;
  display: none;
  max-width: @page-width;

  @media @desktop {
    display: block;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.no-scroll {
  overflow-y: hidden;
}

.video-container {
  position: absolute;
  .inset(0);
  background-color: @DialogBackground;
}

.viewer-3d {
  width: 100%;
  height: 100%;
}

.disable-arrow {
  cursor: default;
  /deep/ svg path {
    stroke: @Gray;
  }
}

.video-thumbnail-container {
  position: relative;
  margin: 0 4px;
  height: 100%;
  .aspect-ratio(@ProductImgAspectRatio);

  .video-play-icon {
    width: 28px;
    height: 28px;
    position: absolute;
    cursor: pointer;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    /deep/ svg path {
      fill: var(--icon-color);
    }
  }
}

.video-player-container {
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 100%;

  .player-wrapper {
    position: relative;
    max-height: 100%;

    video {
      max-width: 100%;
      height: auto;
    }

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

    .player-replay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.youtube-player {
  position: absolute;
  height: 50%;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
}

.thumbnail-item {
  width: 20%;
}

.auto-rotate-icon {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  z-index: 1;
  cursor: pointer;
}

.isActive {
  /deep/ svg path {
    stroke: #efe7d6;
  }
}
</style>

<script>
import modal from "./../../global/components/modal.vue";
import { isNode } from "browser-or-node";
import NoSSR from "vue-no-ssr";
import { getProductImgAspectRatio } from "../../helper/utils";
import emergeImage from "../../global/components/common/emerge-image.vue";
import SvgWrapper from "../../components/common/svg-wrapper.vue";

let Hammer;

if (typeof window !== "undefined") {
  Hammer = require("hammerjs");
}

export default {
  name: "lightbox-image",

  props: {
    images: {
      type: Array,
      required: true,
    },

    disableScroll: {
      type: Boolean,
      default: true,
    },

    showLightBox: {
      type: Boolean,
      default: true,
    },

    startAt: {
      type: Number,
      default: 0,
    },

    nThumbs: {
      type: Number,
      default: 5,
    },

    showThumbs: {
      type: Boolean,
      default: true,
    },

    // Mode
    autoPlay: {
      type: Boolean,
      default: false,
    },

    autoPlayTime: {
      type: Number,
      default: 3000,
    },

    siteLoading: {
      default: null,
    },

    showCaption: {
      type: Boolean,
      default: false,
    },

    lengthToLoadMore: {
      type: Number,
      default: 0,
    },

    closeText: {
      type: String,
      default: "Close (Esc)",
    },

    previousText: {
      type: String,
      default: "Previous",
    },

    nextText: {
      type: String,
      default: "Next",
    },

    previousThumbText: {
      type: String,
      default: "Previous",
    },

    nextThumbText: {
      type: String,
      default: "Next",
    },

    iconColor: {
      type: String,
      default: "",
    },

    global_config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  extends: modal,
  components: {
    "no-ssr": NoSSR,
    "viewer-3d": () =>
      isNode ? Promise.resolve(null) : Promise.resolve(require("./viewer-3d")),
    "emerge-image": emergeImage,
    "svg-wrapper": SvgWrapper,
  },
  data() {
    return {
      select: this.startAt,
      lightBoxOn: this.showLightBox,
      timer: null,
      isMounted: false,
      selectLoading: false,
      isMute: true,
      showReplayButton: false,
      isAutoRotate: false,
    };
  },

  computed: {
    thumbIndex() {
      const halfDown = Math.floor(this.nThumbs / 2);
      if (
        this.select >= halfDown &&
        this.select < this.images.length - halfDown
      )
        return {
          begin: this.select - halfDown + (1 - (this.nThumbs % 2)),
          end: this.select + halfDown,
        };

      if (this.select < halfDown)
        return {
          begin: 0,
          end: this.nThumbs - 1,
        };

      return {
        begin: this.images.length - this.nThumbs,
        end: this.images.length - 1,
      };
    },

    imagesThumb() {
      if (this.siteLoading) {
        return this.images.map((img) => ({
          src: img.url.replace("resize-w:540", "original"),
          type: img.type,
          alt: img.alt,
          loading: this.siteLoading,
          error: this.siteLoading,
        }));
      }

      return this.images.map((img) => ({
        src: img.url.replace("resize-w:540", "original"),
        type: img.type,
        alt: img.alt,
      }));
    },
    getProductImgAspectRatio() {
      return getProductImgAspectRatio(this.global_config);
    },
  },

  watch: {
    lightBoxOn(value) {
      if (document != null) {
        this.onToggleLightBox(value);
      }
    },

    select() {
      if (this.select >= this.images.length - this.lengthToLoadMore - 1)
        this.$emit("onLoad");

      if (this.select === this.images.length - 1) this.$emit("onLastIndex");

      if (this.select === 0) this.$emit("onFirstIndex");

      if (this.select === this.startAt) this.$emit("onStartIndex");
    },
  },

  mounted() {
    if (this.autoPlay) {
      this.timer = setInterval(() => {
        this.nextImage();
      }, this.autoPlayTime);
    }

    this.onToggleLightBox(this.lightBoxOn);

    if (this.$refs.container) {
      const hammer = new Hammer(this.$refs.container);

      hammer.on("swiperight", () => {
        this.previousImage();
      });

      hammer.on("swipeleft", () => {
        this.nextImage();
      });
    }

    this.isMounted = true;
  },

  methods: {
    toggleMute() {
      this.isMute = !this.isMute;
    },
    restartVideo() {
      this.showReplayButton = false;
      this.$refs.videoPlayer.currentTime = 0;
      this.$refs.videoPlayer.play();
    },
    onVideoEnd() {
      this.showReplayButton = true;
    },
    pauseVideo() {
      if (!this.showReplayButton) {
        let videoPlayer = this.$refs.videoPlayer;

        videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();
      }
    },
    onToggleLightBox(value) {
      if (this.disableScroll) {
        document.querySelector("html").classList.toggle("no-scroll", value);
      }

      document.querySelector("body").classList.toggle("hide-overflow", value);
      this.$emit("onOpened", value);

      if (value) {
        document.addEventListener("keydown", this.addKeyEvent);
      } else {
        document.removeEventListener("keydown", this.addKeyEvent);
      }
    },
    getImageURL(src) {
      return `http://img.youtube.com/vi/${src?.substr(
        src?.lastIndexOf("/") + 1
      )}/0.jpg`;
    },
    showImage(index) {
      this.$set(this, "lightBoxOn", true);
      this.$set(this, "selectLoading", true);
      setTimeout(() => {
        this.$set(this, "select", index);
        this.$set(this, "selectLoading", false);
      }, 1);
    },

    addKeyEvent(event) {
      if (event.keyCode === 37) this.previousImage(); // left arrow
      if (event.keyCode === 39) this.nextImage(); // right arrow
      if (event.keyCode === 27) this.closeLightBox(); // esc
    },

    closeLightBox() {
      this.showReplayButton = false;
      this.$emit("toggleResumeVideo");
      let iframe = document.querySelector("iframe");
      if (iframe) {
        var iframeSrc = iframe.src;
        iframe.src = iframeSrc;
      }
      this.$set(this, "lightBoxOn", false);
      if (this.$refs.videoPlayer) this.handleVideoPlayback();
    },
    handleVideoPlayback() {
      this.$refs.videoPlayer.pause();
      this.$refs.videoPlayer.currentTime = 0;
    },

    nextImage() {
      this.showReplayButton = false;
      this.$set(this, "selectLoading", true);
      setTimeout(() => {
        this.$set(this, "select", (this.select + 1) % this.images.length);
        this.$set(this, "selectLoading", false);
      }, 1);
    },

    previousImage() {
      this.showReplayButton = false;
      this.$set(this, "selectLoading", true);
      setTimeout(() => {
        this.$set(
          this,
          "select",
          (this.select + this.images.length - 1) % this.images.length
        );
        this.$set(this, "selectLoading", false);
      }, 1);
    },
  },

  beforeDestroy() {
    document.removeEventListener("keydown", this.addKeyEvent);

    if (this.autoPlay) {
      clearInterval(this.timer);
    }
  },
};
</script>
