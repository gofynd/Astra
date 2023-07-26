<template>
  <div class="mobile-pdp-carousel-box">
    <GlideCarousel
      :glideOptions="glideOptions"
      :key="handleMediaChange"
      :enableObserver="false"
      @getActiveIndex="getActiveIndex"
    >
      <GlideSlide v-for="(media, i) in medias" :key="i">
        <div class="media-wrapper">
          <emerge-image
            v-if="media.type === 'image'"
            :src="media.url"
            :alt="media.alt"
            :mobileAspectRatio="getProductImgAspectRatio"
            @click.native="openGallery(i)"
            :global_config="global_config"
          />
          <div
            v-else-if="media.type === 'video' && media.url"
            class="video-container"
          >
            <img
              v-if="media.url.includes('youtube')"
              :src="getImageURL(media.url)"
              :alt="media.alt"
              @click="openGallery(i)"
            />
            <div v-else class="video-player-wrapper">
              <template v-if="currentIndex === i">
                <video
                  :id="`mobile-video-player-${i}`"
                  class="originalVideo"
                  :src="media.url"
                  :controls="false"
                  :autoplay="true"
                  :muted="isMute"
                  @click="pauseVideo(i)"
                  @ended="onVideoEnd"
                  @loadeddata="videoLoaded(i)"
                  v-show="loadedVideos[i]"
                  preload="auto"
                />

                <template v-if="loadedVideos[i]">
                  <svg-wrapper
                    :svg_src="'replay'"
                    class="player-icon player-replay"
                    v-if="showReplayButton"
                    @click.native="restartVideo(i)"
                  ></svg-wrapper>

                  <svg-wrapper
                    :svg_src="isMute ? 'mute' : 'unmute'"
                    class="player-icon player-mute"
                    @click.native="toggleMute"
                  ></svg-wrapper>

                  <svg-wrapper
                    :svg_src="'expand-media'"
                    class="player-icon player-expand"
                    @click.native="onPlayerExpand(i)"
                  ></svg-wrapper>
                </template>
              </template>

              <Skeleton
                v-show="!loadedVideos[i]"
                :aspectRatio="getProductImgAspectRatio"
                :mobileAspectRatio="getProductImgAspectRatio"
              />
            </div>

            <svg-wrapper
              :svg_src="'play-button'"
              class="thumbnail"
              v-if="media.url.includes('youtube')"
            />
          </div>
          <div v-else-if="media.type === '3d_model'" class="type-3d_model">
            <no-ssr>
              <div class="model-wrapper">
                <viewer-3d
                  :src="media.url"
                  :autoRotate="isAutoRotate"
                ></viewer-3d>

                <svg-wrapper
                  :svg_src="'auto-rotate'"
                  class="auto-rotate-icon"
                  @click.native="openGallery(i)"
                />
              </div>
            </no-ssr>
          </div>
          <fdk-product-card class="wishlist">
            <template slot-scope="productData">
              <fdk-accounts>
                <template slot-scope="accountsData">
                  <svg-wrapper
                    :svg_src="
                      product.follow ? 'wishlist-pdp-active' : 'wishlist-pdp'
                    "
                    @click.native.prevent="
                      $emit(
                        'updateWishList',
                        $event,
                        productData,
                        accountsData,
                        product
                      )
                    "
                  ></svg-wrapper>
                </template>
              </fdk-accounts>
            </template>
          </fdk-product-card>
        </div>
      </GlideSlide>
    </GlideCarousel>
  </div>
</template>

<script>
import emergeImage from "./../global/components/common/emerge-image.vue";
import GlideCarousel from "./../global/components/glide-carousel.vue";
import GlideSlide from "./../global/components/glide-slide.vue";
import Skeleton from "./../global/components/skeletons/image-skeleton.vue";
import { isBrowser, isNode } from "browser-or-node";
import { getProductImgAspectRatio } from "../helper/utils";
import NoSSR from "vue-no-ssr";
import SvgWrapper from "./../components/common/svg-wrapper.vue";

export default {
  props: {
    medias: {
      type: Array,
    },
    product: {
      type: Object,
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
    "emerge-image": emergeImage,
    "no-ssr": NoSSR,
    "viewer-3d": () =>
      isNode
        ? Promise.resolve(null)
        : Promise.resolve(require("./product-description/viewer-3d")),
    "svg-wrapper": SvgWrapper,
    GlideCarousel,
    GlideSlide,
    Skeleton,
  },
  data() {
    return {
      glideOptions: {
        type: "carousel",
        startAt: 0,
        focusAt: 0,
        gap: 12,
        perView: 1,
        bound: true,
        breakpoints: {
          768: {
            perView: 1,
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
      isAutoRotate: false,
      currentIndex: 0,
      isMute: true,
      showReplayButton: false,
      loadedVideos: [],
      handleMediaChange: false,
    };
  },
  watch: {
    resumeVideo(newValue, oldValue) {
      if (newValue !== oldValue && !this.showReplayButton) {
        let videoPlayer = document.querySelector(
          `.glide__slide--active #mobile-video-player-${this.currentIndex}`
        );

        videoPlayer && videoPlayer.play();
      }
    },
    medias() {
      this.handleMediaChange = !this.handleMediaChange;
    },
  },
  mounted() {},
  methods: {
    onPlayerExpand(i) {
      if (!this.showReplayButton) {
        let videoPlayer = document.querySelector(
          `.glide__slide--active #mobile-video-player-${i}`
        );

        videoPlayer && videoPlayer.pause();
      }

      this.openGallery(i);
    },
    videoLoaded(i) {
      const videoNodeList = document.querySelectorAll(
        `.glide__slide--clone #mobile-video-player-${i}`
      );
      videoNodeList.forEach((video) => (video.muted = true));

      const loadedVideos = JSON.parse(JSON.stringify(this.loadedVideos));
      loadedVideos[i] = true;
      this.loadedVideos = loadedVideos;
    },
    checkisBrowser() {
      return isBrowser;
    },
    getImageURL(src) {
      return `http://img.youtube.com/vi/${src?.substr(
        src?.lastIndexOf("/") + 1
      )}/0.jpg`;
    },

    openGallery(id) {
      this.$emit("clickimage", id);
    },
    toggleAutoRotate(event) {
      this.isAutoRotate = !this.isAutoRotate;
      event.stopPropagation();
    },

    pauseVideo(i) {
      if (!this.showReplayButton) {
        let videoPlayer = document.querySelector(
          `.glide__slide--active #mobile-video-player-${i}`
        );

        videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();
      }
    },
    onVideoEnd() {
      this.showReplayButton = true;
    },
    toggleMute() {
      this.isMute = !this.isMute;
    },
    restartVideo(i) {
      this.showReplayButton = false;

      let videoPlayer = document.querySelector(
        `.glide__slide--active #mobile-video-player-${i}`
      );

      videoPlayer.currentTime = 0;
      videoPlayer.play();
    },
    getActiveIndex(index) {
      if (typeof index === "number" && index !== this.currentIndex) {
        this.showReplayButton = false;
        this.loadedVideos[index] = false;
        this.currentIndex = index;
      }
    },
  },
  computed: {
    getProductImgAspectRatio() {
      return getProductImgAspectRatio(this.global_config);
    },
  },
};
</script>

<style lang="less" scoped="true">
.mobile-pdp-carousel-box {
  .media-wrapper {
    position: relative;
    background-image: @ContainerBGImage;
    height: 100%;
    .aspect-ratio(@ProductImgAspectRatio);

    .video-container {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      overflow: hidden;
      height: 100%;
      display: flex;
      align-items: center;

      img {
        width: 100%;
      }

      .originalVideo {
        cursor: pointer;
        height: 100%;
        width: 100%;
      }
    }

    .type-3d_model {
      .model-wrapper {
        position: relative;
        height: 100%;
      }

      /deep/ model-viewer {
        width: 100%;
        height: 100%;
      }
    }
  }

  /deep/ .glide__slide {
    height: unset;
  }
}

.thumbnail {
  width: 60px;
  height: 60px;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/deep/ .glide__bullet {
  margin: 0 2px;
  width: 10px !important;

  &--active {
    width: 18px !important;
  }
}

.wishlist {
  position: absolute;
  top: 18px !important;
  right: 17px !important;
  left: unset !important;
  bottom: unset !important;
  cursor: pointer;
  width: 22px;
  height: 20px;
}

/deep/ .bullet-arrow-container {
  margin-top: 12px !important;
}

.auto-rotate-icon {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
}

.isActive {
  /deep/ svg path {
    stroke: #efe7d6;
  }
}

.video-player-wrapper {
  position: relative;
  max-height: 100%;
  display: flex;
  align-items: center;
  width: 100%;

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
