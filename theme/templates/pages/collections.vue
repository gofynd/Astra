<template>
  <div class="collections">
    <div class="collections__breadcrumbs desktop caption-normal font-body">
      <span><fdk-link :link="'/'">Home</fdk-link>&nbsp; / &nbsp;</span>
      <span class="active">Collections</span>
    </div>
    <h1
      class="collections__title font-header"
      v-if="getPageConfigValue(page_config, 'title').length > 0"
    >
      {{ getPageConfigValue(page_config, "title") }}
    </h1>
    <div
      class="font-body"
      :class="['collections__description', isMobile ? 'b2' : 'b1']"
      v-if="getPageConfigValue(page_config, 'description').length > 0"
    >
      <p>{{ getPageConfigValue(page_config, "description") }}</p>
    </div>
    <template
      v-if="
        context.collections &&
        context.collections.items &&
        context.collections.items.length > 0
      "
    >
      <div class="collections__cards">
        <fdk-infinite-collections :handleinfinite="infiniteFlag">
          <template slot-scope="collectionListing">
            <template v-if="infiniteFlag">
              <group-list
                :cardlist="context.collections.items"
                :cardtype="'COLLECTIONS'"
                :global_config="global_config"
              ></group-list>
            </template>
            <template v-else>
              <fdk-infinite-scrolling
                :loadingData="context.collections.loading"
                @loadmore="collectionListing.loadmore"
              >
                <group-list
                  :cardlist="context.collections.items"
                  :cardtype="'COLLECTIONS'"
                  :global_config="global_config"
                ></group-list>
              </fdk-infinite-scrolling>
            </template>
            <InfiniteLoader
              v-if="context.collections.page.has_next && !infiniteFlag"
            ></InfiniteLoader>
            <div
              class="view-more-btn-wrapper flex-center"
              v-if="context.collections.page.has_next && infiniteFlag"
            >
              <button
                class="btn-secondary view-more-btn"
                @click="collectionListing.loadmore"
                tabindex="0"
              >
                View More
              </button>
            </div>
          </template>
        </fdk-infinite-collections>
      </div>
      <button
        class="back-top"
        v-if="getPageConfigValue(page_config, 'back_top') && isToTopActive"
        @click="scrollToTop()"
      >
        <svg-wrapper class="arrow-top-icon" :svg_src="'back-top'"></svg-wrapper>
        <span class="text caption-normal font-body">Back to top</span>
      </button>
    </template>
    <fdk-empty-state
      v-else-if="
        context.collections &&
        context.collections.items &&
        context.collections.items.length === 0 &&
        isMounted
      "
      :title="'No Collections Found'"
    ></fdk-empty-state>
    <div class="collections__breadcrumbs mobile caption-normal font-body">
      <span><fdk-link :link="'/'">Home</fdk-link>&nbsp; / &nbsp;</span>
      <span class="active">Collections</span>
    </div>
  </div>
</template>
<!-- #region  -->

<settings>
{
  "props": [
    {
      "type": "checkbox",
      "id": "infinite_scroll",
      "label": "Infinity Scroll",
      "default": true,
      "info": "If it is enabled, view more button will not be shown, only on scroll products will be displayed"
    },
    {
      "type": "checkbox",
      "id": "back_top",
      "label": "Back to top",
      "default": true
    },
    {
      "type": "text",
      "id": "title",
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
import {
  getPageConfigValue,
  throttle,
  detectMobileWidth,
} from "../../helper/utils";
import { isBrowser } from "browser-or-node";
import SvgWrapper from "../../components/common/svg-wrapper.vue";
import groupList from "./../../global/components/group-list.vue";
import InfiniteLoader from "../../global/components/infinite-loader.vue";

export default {
  data() {
    return {
      isMounted: false,
      infiniteFlag: !getPageConfigValue(this.page_config, "infinite_scroll"),
      scrollY: 0,
      isMobile: false,
    };
  },
  components: {
    "svg-wrapper": SvgWrapper,
    "group-list": groupList,
    InfiniteLoader,
  },
  watch: {},
  computed: {
    isToTopActive() {
      return this.scrollY > 200;
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
/deep/ .infi-loader {
  .container {
    background-color: transparent;
  }
}

.collections {
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

  &__cards {
    ::v-deep .list-items {
      background: none;
    }

    .view-more-btn-wrapper {
      margin-top: 16px;

      @media @mobile-up {
        margin-top: 36px;
      }
    }

    .view-more-btn {
      background: transparent;
      padding: 12px 16px;

      &:hover {
        background-color: @ButtonPrimary;
      }

      @media @desktop {
        padding: 12px 32px;
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
