<template>
  <div class="categories">
    <div class="categories__breadcrumbs desktop caption-normal font-body">
      <span><fdk-link :link="'/'">Home</fdk-link>&nbsp; / &nbsp;</span>
      <span class="active">Categories</span>
    </div>
    <fdk-loader v-if="context?.categories?.loading"></fdk-loader>
    <fdk-empty-state
      v-else-if="context?.categories?.pageError?.statusCode === 500"
      :title="'Something went wrong'"
    />
    <fdk-empty-state
      v-else-if="
        context?.categories?.allsecondchilds?.length === 0 && isMounted
      "
      :title="'No Categories found'"
    ></fdk-empty-state>
    <template v-else-if="context?.categories?.allsecondchilds?.length > 0">
      <h1
        class="categories__title font-header"
        v-if="getPageConfigValue(page_config, 'heading').length > 0"
      >
        {{ getPageConfigValue(page_config, "heading") }}
      </h1>
      <div
        class="font-body"
        :class="['categories__description', isMobile ? 'b2' : 'b1']"
        v-if="getPageConfigValue(page_config, 'description').length > 0"
      >
        <p>{{ getPageConfigValue(page_config, "description") }}</p>
      </div>
      <div class="categories__cards">
        <group-list
          :cardlist="context.categories.allsecondchilds"
          :cardtype="'CATEGORIES'"
          :global_config="global_config"
        ></group-list>
      </div>
      <button
        class="back-top"
        v-if="true && isToTopActive"
        @click="scrollToTop()"
      >
        <svg-wrapper class="arrow-top-icon" :svg_src="'back-top'"></svg-wrapper>
        <span class="text caption-normal font-body">Back to top</span>
      </button>
    </template>
    <div class="categories__breadcrumbs mobile caption-normal font-body">
      <span><fdk-link :link="'/'">Home</fdk-link>&nbsp; / &nbsp;</span>
      <span class="active">Categories</span>
    </div>
  </div>
</template>
<!-- #region  -->
<settings>
{
    "props": [
        {
          "type": "checkbox",
          "id": "back_top",
          "label": "Back to top",
          "default": true
        },
        {
          "type": "text",
          "id": "heading",
          "default": "",
          "label": "Heading"
        },
        {
          "type": "textarea",
          "id": "description",
          "default": "",
          "label": "Description"
        }
    ]
}

</settings>
<!-- #endregion -->
<script>
import { isBrowser } from "browser-or-node";
import {
  getPageConfigValue,
  detectMobileWidth,
  throttle,
} from "../../helper/utils";
import groupList from "./../../global/components/group-list.vue";
import SvgWrapper from "../../components/common/svg-wrapper.vue";

export default {
  props: {},
  data() {
    return {
      categories: [],
      isMounted: false,
      isLoading: false,
      isMobile: false,
      scrollY: 0,
    };
  },
  components: {
    "svg-wrapper": SvgWrapper,
    "group-list": groupList,
  },
  computed: {
    isToTopActive() {
      return this.scrollY > 50;
    },
  },
  created() {
    if (isBrowser) window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    if (isBrowser) window.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {
    this.isMounted = true;
    this.isMobile = detectMobileWidth();
  },
  methods: {
    getPageConfigValue,
    handleScroll: throttle(function () {
      const windowScrollY = isBrowser ? window.scrollY : 0;
      this.scrollY = windowScrollY;
    }, 500),
    scrollToTop() {
      if (isBrowser) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.categories {
  padding: 24px 16px 80px;
  @media @mobile-up {
    padding: 24px 40px 80px;
  }
  &__title {
    text-align: center;
    margin-bottom: 16px;
  }
  &__description {
    margin-bottom: 16px;
    text-align: center;
    @media @desktop {
      margin-bottom: 24px;
    }
  }
  &__breadcrumbs {
    span {
      color: @TextDisabled;
      &.active {
        color: @ButtonPrimary;
      }
    }
    &.desktop {
      display: none;
      @media @desktop {
        display: block;
        margin-bottom: 24px;
      }
    }
    &.mobile {
      margin-top: 24px;
      padding: 0px 16px;
      text-align: center;
      @media @desktop {
        display: none;
      }
    }
  }
  .back-top {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    color: @ThemeAccentD2;
    box-shadow: 0px 8px 8px -4px rgba(0, 0, 0, 0.6),
      0px 4px 6px -4px rgba(0, 0, 0, 0.12);
    background-color: @DialogBackground;
    border-radius: 24px;
    border: none;
    position: fixed;
    top: 72px;
    right: 50%;
    transform: translateX(50%);
    & > .arrow-top-icon {
      fill: currentColor;
      width: 8px;
      height: 11px;
    }
    @media @desktop {
      justify-content: center;
      top: unset;
      right: 40px;
      bottom: 40px;
      width: 40px;
      height: 40px;
      & > .text {
        display: none;
      }
      & > .arrow-top-icon {
        width: 10px;
        height: 14px;
      }
    }
  }
}
</style>
