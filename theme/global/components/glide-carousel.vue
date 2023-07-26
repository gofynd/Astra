<template>
  <div class="glide" ref="glide">
    <div class="glide__track" data-glide-el="track">
      <div class="glide__slides" :style="dynamicStyles">
        <slot></slot>
      </div>
    </div>
    <div class="bullet-arrow-container" v-if="showControls">
      <div class="glide__arrows svg-arrow" v-if="hasArrows">
        <div @click="prevSlide()">
          <svg-wrapper
            :svg_src="'glide-arrow-left'"
            class="glide__arrow glide__arrow--left"
          ></svg-wrapper>
        </div>
      </div>
      <div class="glide__bullets" v-if="hasBullets">
        <button
          v-for="(slideIndex, index) in carouselIndexes"
          class="glide__bullet"
          :id="`=${slideIndex}`"
          :class="{
            'glide__bullet--active': isActiveBullet(slideIndex),
          }"
          :key="index"
          @click="onBulletClick(slideIndex, index)"
        ></button>
      </div>
      <div class="glide__arrows svg-arrow" v-if="hasArrows">
        <div @click="nextSlide()">
          <svg-wrapper
            :svg_src="'glide-arrow-right'"
            class="glide__arrow glide__arrow--right"
          ></svg-wrapper>
        </div>
      </div>
    </div>
    <svg-wrapper
      :svg_src="'carousel-nav-arrow'"
      class="nav-right-arrow"
      v-if="showCarouselNav"
      @click.native="nextItem"
    ></svg-wrapper>
  </div>
</template>

<script>
import { isBrowser } from "browser-or-node";
import SvgWrapper from "../../components/common/svg-wrapper.vue";
import Glide from "@glidejs/glide";
import "../../../node_modules/@glidejs/glide/dist/css/glide.core.min.css";
import "../../../node_modules/@glidejs/glide/dist/css/glide.theme.min.css";

export default {
  components: {
    "svg-wrapper": SvgWrapper,
  },
  props: {
    hasArrows: {
      type: Boolean,
      default: false,
    },
    hasBullets: {
      type: Boolean,
      default: true,
    },
    hasControls: {
      type: Boolean,
      default: true,
    },
    showPerPage: {
      type: Boolean,
      default: false,
    },
    showCarouselArrows: {
      type: Boolean,
      default: false,
    },
    glideOptions: {
      type: Object,
      default: () => {
        return {};
      },
    },
    enableObserver: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      screenPreview: this.showPerPage
        ? Number(this.glideOptions.perView) || 1
        : 1,
      carouselHandle: null,
      breakpoints: [],
      carouselIndexes: [],
      currentIndex: 0,
      length: 0,
    };
  },
  watch: {
    screenPreview() {
      this.initializeComponent();
    },
    carouselHandle: {
      handler(currentVal) {
        this.$emit("getActiveIndex", currentVal?.index);
      },
      immediate: true,
      deep: true,
    },
  },
  beforeMount() {
    this.breakpoints = Object.keys(this.glideOptions?.breakpoints || {}).sort(
      (a, b) => Number(a) - Number(b)
    );
    this.checkBulletCount();
  },
  mounted() {
    this.initializeComponent();

    if (this.enableObserver) {
      const observer = new MutationObserver(this.initializeComponent);
      observer.observe(this.$refs.glide, {
        attributes: false,
        childList: true,
        subtree: false,
      });
      this.observer = observer;
    }
  },
  beforeDestroy() {
    this.cleanupComponent();
    this.observer && this.observer.disconnect();
  },
  methods: {
    cleanupComponent() {
      if (this.carouselHandle) {
        this.carouselHandle.destroy();
        this.carouselHandle = null;
      }
    },
    initCarousel() {
      if (!this.$refs.glide) {
        setTimeout(() => {
          this.initCarousel();
        }, 1000);
        return;
      }
      this.$nextTick(() => {
        try {
          this.carouselHandle = new Glide(this.$refs.glide, this.glideOptions);
          if (this.showPerPage) {
            this.carouselHandle.on("resize", this.checkBulletCount);
          }
          this.carouselHandle.mount();
        } catch (error) {
          console.log(error, "error");
        }
      });
    },

    checkBulletCount() {
      if (!this.showPerPage) return;
      const width = isBrowser ? window.innerWidth : 0;
      if (!this.glideOptions?.breakpoints) {
        this.screenPreview = Number(this.glideOptions?.perView) || 1;
        return;
      }
      for (let breakpoint of this.breakpoints) {
        if (width <= Number(breakpoint)) {
          this.screenPreview = Number(
            this.glideOptions.breakpoints[breakpoint].perView
          );
          return;
        }
      }
      this.screenPreview = Number(this.glideOptions?.perView) || 1;
    },
    initializeComponent() {
      this.length = this.slideCount();
      this.carouselIndexes = this.getcarouselIndexes();
      this.initCarousel();
    },
    slideCount() {
      return (this.$slots.default || []).filter(
        (c) => c.tag.indexOf("VueGlideSlide") !== -1
      ).length;
    },
    getcarouselIndexes() {
      let indexes = [];
      for (let i = 0; i < Math.ceil(this.length / this.screenPreview); i++) {
        indexes.push(i * this.screenPreview);
      }
      return indexes;
    },
    onBulletClick(slideIndex, index) {
      this.currentIndex = index;
      this.carouselHandle.go(`=${slideIndex}`);
    },
    isActiveBullet(bulletIndex) {
      if (!this.carouselHandle) return false;

      if (this.showPerPage) {
        return (
          this.carouselHandle.index >= bulletIndex &&
          this.carouselHandle.index < bulletIndex + this.screenPreview
        );
      }

      return bulletIndex === this.carouselHandle.index;
    },
    nextSlide() {
      this.currentIndex += 1;
      if (this.currentIndex >= this.carouselIndexes.length) {
        this.currentIndex = 0;
      }
      this.carouselHandle.go(`=${this.carouselIndexes[this.currentIndex]}`);
    },
    prevSlide() {
      this.currentIndex -= 1;
      if (this.currentIndex < 0) {
        this.currentIndex = this.carouselIndexes.length - 1;
      }
      this.carouselHandle.go(`=${this.carouselIndexes[this.currentIndex]}`);
    },
    nextItem() {
      this.carouselHandle.go(`>`);
    },
  },
  computed: {
    showControls() {
      return this.screenPreview < this.length && this.hasControls;
    },
    showCarouselNav() {
      return this.length > 2 && this.showCarouselArrows;
    },
    dynamicStyles() {
      let perView, gap;
      if (this.glideOptions?.breakpoints) {
        const width = isBrowser ? window.innerWidth : 0;
        for (let breakpoint of this.breakpoints) {
          if (width <= Number(breakpoint)) {
            perView = Number(
              this.glideOptions.breakpoints[breakpoint]?.perView
            );
            gap = Number(this.glideOptions.breakpoints[breakpoint]?.gap);
            break;
          }
        }
      }
      return {
        "--item-count": `${perView || this.glideOptions.perView || 1}`,
        "--gap": `${gap || this.glideOptions.gap || 0}px`,
      };
    },
  },
};
</script>
<style lang="less" scoped>
.glide {
  &__slides {
    margin-left: auto;
    margin-right: auto;
  }
}

.glide__bullets {
  bottom: -2em;
  position: static;
  transform: none;
}
.glide__bullet {
  width: 14px;
  height: 4px;
  border-radius: 25px;
  background-color: @TextDisabled;
  &:hover,
  &:focus {
    border: none;
  }

  @media @desktop {
    &:hover {
      background-color: @TextHeading;
    }
  }
}
.glide__bullet--active {
  background-color: @TextHeading;
  width: 24px;
}
::v-deep .glide__slide {
  /* Fix for flashing background image on slide */
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  width: calc(
    (100% - (var(--gap) * (var(--item-count) - 1))) / var(--item-count)
  );
  &:not(:first-child) {
    margin-left: calc(var(--gap) / 2);
  }
  &:not(:last-child) {
    margin-right: calc(var(--gap) / 2);
  }
}
.glide__slide--active {
  z-index: 1;
}
.glide__arrow {
  position: static;
  padding: 0;
  border: none;
  box-shadow: none;
  transform: none;
}

.glide__arrow--right {
  right: 0.8em;
}
.glide__arrow--left {
  left: 0.8em;
}
.bullet-arrow-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media @desktop {
    margin-top: 32px;
  }
}

.nav-right-arrow {
  width: 48px;
  height: 48px;
  position: absolute;
  top: 50%;
  right: 4.5rem;
  transform: translate(0px, -50%);
  cursor: pointer;
}

.svg-arrow {
  width: 31px;
  height: 31px;
}
</style>
