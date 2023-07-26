<template>
  <div class="gallery-box">
    <div class="image-gallery desktop">
      <div class="flex-align-center">
        <div>
          <svg-wrapper
            :svg_src="'carousel-nav-arrow'"
            :class="[
              'carousel-arrow',
              'carousel-arrow--left',
              { 'disable-arrow': currentImageIndex <= 0 },
            ]"
            @click.native="prevSlide"
          ></svg-wrapper>
        </div>
        <div class="image-box" ref="itemwrapper">
          <pic-zoom
            class="image-item"
            :source="src"
            :type="type"
            :alt="alt"
            :currentIndex="currentImageIndex"
            v-on:clickimage="openGallery"
            :isFrameLoading="isFrameLoading"
            :resumeVideo="resumeVideo"
            :global_config="global_config"
          ></pic-zoom>
          <fdk-product-card :class="{ 'disable-cursor': !product.sellable }">
            <template slot-scope="productData">
              <fdk-accounts class="wishlist">
                <template slot-scope="accountsData">
                  <div
                    @click.prevent="
                      updateWishList($event, productData, accountsData, product)
                    "
                  >
                    <svg-wrapper
                      :svg_src="'wishlist-pdp'"
                      :class="['wishlist-icon', { active: product.follow }]"
                    ></svg-wrapper>
                  </div>
                </template>
              </fdk-accounts>
            </template>
          </fdk-product-card>
        </div>
        <div>
          <svg-wrapper
            :svg_src="'carousel-nav-arrow'"
            :class="[
              'carousel-arrow',
              { 'disable-arrow': currentImageIndex >= images.length - 1 },
            ]"
            @click.native="nextSlide"
          ></svg-wrapper>
        </div>
      </div>

      <div class="thumb-slider">
        <div
          :class="[
            'thumb-wrapper',
            {
              'remove-width': images && images.length < 5,
            },
          ]"
        >
          <div
            class="prev-btn btn-nav-gallery"
            ref="prevArrow"
            @click="prevSlide"
          >
            <svg-wrapper
              :svg_src="'arrow-left'"
              :class="[
                { 'disable-arrow': currentImageIndex <= 0 },
                'nav-arrow-icon',
              ]"
            ></svg-wrapper>
          </div>
          <ul
            :class="[
              'image-gallery__list scrollbar-hidden',
              {
                'fit-content': images && images.length < 5,
              },
            ]"
            ref="scrollCont"
          >
            <li
              v-for="(item, index) in images"
              :key="index"
              @click="setMainImage(index)"
              :class="[
                'gap',
                {
                  flexAlign: item.type === 'video',
                  active: currentImageIndex === index,
                },
              ]"
              :style="`--icon-color: ${iconColor};`"
            >
              <emerge-image
                v-if="item.type === 'image'"
                :ref="'imageItem' + index"
                class="image-gallery__list--item animated faadeIn"
                :src="item.url"
                :alt="item.alt"
                :aspect-ratio="getProductImgAspectRatio"
                :global_config="global_config"
              ></emerge-image>
              <div
                v-else-if="item.type === 'video'"
                class="video-thumbnail-container"
              >
                <img
                  v-if="item.url.includes('youtube')"
                  :ref="'imageItem' + index"
                  class="image-gallery__list--item animated faadeIn video-thumbnail"
                  :src="getImageURL(item.url)"
                  :alt="item.alt"
                />
                <video
                  v-else
                  :ref="'imageItem' + index"
                  class="image-gallery__list--item animated faadeIn video-thumbnail"
                  :src="item.url"
                ></video>
                <svg-wrapper
                  :svg_src="'video-play'"
                  class="video-play-icon"
                ></svg-wrapper>
              </div>

              <div
                v-if="item.type === '3d_model'"
                :ref="'imageItem' + index"
                class="image-gallery__list--item animated faadeIn type-3d_model"
              >
                <svg-wrapper :svg_src="'3D'" class="model-icon"></svg-wrapper>
              </div>
            </li>
          </ul>
          <div
            class="next-btn btn-nav-gallery"
            ref="nextArrow"
            @click="nextSlide"
          >
            <svg-wrapper
              :svg_src="'arrow-right'"
              :class="[
                { 'disable-arrow': currentImageIndex >= images.length - 1 },
                'nav-arrow-icon',
              ]"
            ></svg-wrapper>
          </div>
        </div>
      </div>
    </div>
    <div class="mobile">
      <mobile-carousel
        ref="carousel"
        :medias="images"
        v-on:clickimage="openGallery"
        :product="product"
        @updateWishList="updateWishList"
        :resumeVideo="resumeVideo"
        :global_config="global_config"
      ></mobile-carousel>
    </div>
    <LightBox
      :images="images"
      ref="lightbox"
      :show-caption="false"
      :show-light-box="false"
      :iconColor="iconColor"
      @toggleResumeVideo="resumeVideo = !resumeVideo"
      :global_config="global_config"
    ></LightBox>
  </div>
</template>
<style lang="less" scoped>
.product-details-page {
  max-width: @page-width;
}
.wishlist {
  position: absolute;
  top: 25px;
  right: 24px;
  cursor: pointer;
  width: 25px;
  height: 23px;
  z-index: 2;

  .wishlist-icon {
    &:hover {
      /deep/ svg path {
        fill: @TextHeading;
        fill-opacity: 1;
      }
    }
  }

  .active {
    /deep/ svg path {
      fill: @TextHeading;
      fill-opacity: 1;
    }
  }
}
.gallery-box {
  .image-box {
    position: relative;
    width: 100%;
    margin: 0 32px;
    .aspect-ratio(@ProductImgAspectRatio);
  }
  .image-item {
    z-index: 1;
    overflow: hidden;
  }
  .loader {
    min-height: 100%;
  }
  .flexAlign {
    display: flex;
  }
  .mouse-cover {
    position: fixed;
    width: 100px;
    height: 100px;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    pointer-events: none;
    display: none;
  }

  .image-gallery {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    @media @tablet {
      display: none;
    }
    &__main {
      max-width: 100%;
      cursor: pointer;
    }
    .thumb-slider {
      display: flex;
      justify-content: center;
      margin-top: 18.5px;
      padding: 0 40px;

      .thumb-wrapper {
        position: relative;
        width: 100%;
        max-width: 365px;

        .fit-content {
          width: fit-content;
        }

        .btn-nav-gallery {
          z-index: @layer;
          background-color: transparent;
          cursor: pointer;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        .next-btn {
          right: -39px;
        }
        .prev-btn {
          left: -39px;
        }
      }
    }
    &__list {
      display: flex;
      overflow-x: scroll;

      &--item {
        background-color: @White;
        width: 63px;
        height: 100%;
        cursor: pointer;
        border-radius: 24px;
        box-sizing: border-box;
        border: 2px solid white;
        .aspect-ratio(@ProductImgAspectRatio);

        .model-icon {
          width: 24px;
          height: 24px;
          top: 50%;
          left: 50%;
          right: unset;
          bottom: unset;
          transform: translate(-50%, -50%);

          /deep/ svg path {
            fill: var(--icon-color);
          }
        }

        &.type-3d_model {
          display: flex;
          align-items: center;
          justify-content: center;
          .model-label {
            width: 70px;
            font-size: 10px;
            text-align: center;
          }
        }
      }

      .gap {
        margin-right: 8px;
        border: 2px solid transparent;
      }

      .active {
        border: 2px solid @ThemeAccentD4;
        border-radius: 24px;
      }

      .gap:last-child {
        margin-right: 0;
      }
    }
    /* Hide scrollbar for Chrome, Safari and Opera */
    .scrollbar-hidden::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for IE, Edge add Firefox */
    .scrollbar-hidden {
      -ms-overflow-style: none;
      scrollbar-width: none; /* Firefox */
    }
  }
  .mobile {
    display: none;

    @media @tablet {
      display: block;
    }
  }
}

.disable-arrow {
  cursor: default;
  /deep/ svg path {
    stroke: @Gray;
  }
}

.nav-arrow-icon {
  width: 11px;
  height: 18px;
}

.video-thumbnail-container {
  .aspect-ratio(@ProductImgAspectRatio);
  position: relative;
  width: 59px;
  overflow: hidden;
  border-radius: 24px;

  .video-thumbnail {
    position: absolute !important;
  }
}

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

.carousel-arrow {
  width: 48px;
  height: 48px;
  cursor: pointer;

  &--left {
    transform: rotate(180deg);
  }
}

.remove-width {
  width: unset !important;
}
</style>
<script>
import { getProductImgAspectRatio } from "../../helper/utils";
import mobilecarousel from "../../components/mobile-pdp-carousel.vue";
import piczoom from "./pic-zoom.vue";
import LightBox from "./lightbox-image.vue";
import SvgWrapper from "../common/svg-wrapper.vue";
import EmergeImage from "../../global/components/common/emerge-image.vue";

export default {
  name: "pdp-image-gallery",
  components: {
    "mobile-carousel": mobilecarousel,
    "pic-zoom": piczoom,
    LightBox,
    "svg-wrapper": SvgWrapper,
    "emerge-image": EmergeImage,
  },
  props: {
    images: {
      type: Array,
    },
    product: {
      type: Object,
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
  data() {
    return {
      isMounted: false,
      currentImageIndex: 0,
      src: this.images[0].url.replace("resize-w:540", "original"),
      type: this.images[0].type,
      alt: this.images[0].alt,
      isFrameLoading: true,
      resumeVideo: false,
    };
  },
  mounted() {
    this.isMounted = true;
  },
  watch: {
    images(newVal) {
      this.src = newVal[0] && newVal[0].url;
      this.type = newVal[0] && newVal[0].type;
      this.alt = newVal[0] && newVal[0].alt;
    },
  },
  methods: {
    updateWishList(event, productData, accountsData, item) {
      if (accountsData.is_logged_in) {
        productData.updateWishList(event, item);
      } else {
        accountsData.openLogin();
      }
      event.stopPropagation();
      event.preventDefault();
    },
    onClickWishlist(event, productData, product) {
      productData.updateWishList(event, product);
    },
    setMainImage(index) {
      this.src = this.images[index].url;
      this.type = this.images[index].type;
      this.alt = this.images?.[index]?.alt || "";
      this.currentImageIndex = index;
    },
    getImageURL(src) {
      return `http://img.youtube.com/vi/${src?.substr(
        src?.lastIndexOf("/") + 1
      )}/0.jpg`;
    },
    prevSlide() {
      if (this.currentImageIndex === 0) {
        return;
      } // cannot move backward
      this.$refs.scrollCont.scrollLeft -= 75;
      this.currentImageIndex--;
      this.src = this.images[this.currentImageIndex].url;
      this.type = this.images[this.currentImageIndex].type;
      this.alt = this.images?.[this.currentImageIndex]?.alt;
    },
    nextSlide() {
      if (this.currentImageIndex === this.images.length - 1) {
        return;
      } // cannot move forward
      this.$refs.scrollCont.scrollLeft += 75;
      this.currentImageIndex++;
      this.src = this.images[this.currentImageIndex].url;
      this.type = this.images[this.currentImageIndex].type;
      this.alt = this.images?.[this.currentImageIndex]?.alt;
    },
    openGallery(index) {
      this.$refs.lightbox.showImage(Number(index));
    },
  },
  computed: {
    getProductImgAspectRatio() {
      return getProductImgAspectRatio(this.global_config);
    },
  },
};
</script>
