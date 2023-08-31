<template>
  <div class="search-wrapper">
    <span @click="openSearch">
      <svg-wrapper
        class="search-icon header-icon"
        :svg_src="isDoubleRowHeader ? 'search' : 'single-row-search'"
      ></svg-wrapper>
    </span>
    <transition name="slide-down" mode="out-in">
      <fdk-search
        class="search"
        v-if="showSearch"
        :has_products="true"
        v-click-outside="closeSearch"
      >
        <template slot-scope="searchData">
          <div class="search__wrapper">
            <div class="search__input">
              <input
                class="search__input--text font-body"
                type="text"
                id="searchInput"
                autocomplete="off"
                v-model="searchtext"
                :placeholder="isDoubleRowHeader ? 'Search' : ''"
                @keyup.enter="getEnterSearchData(searchData)"
                @input="searchData.fetchSuggestions(searchtext, 8)"
                @focus="isSearchFocused = true"
                @blur="checkInput()"
              />
              <svg-wrapper
                class="search__input--search-icon"
                :svg_src="'search'"
                @click.native="getEnterSearchData(searchData)"
              ></svg-wrapper>
              <span
                class="search__input--label b1 font-body"
                :class="{ active: isSearchFocused }"
                v-if="!isDoubleRowHeader"
                >Search</span
              >
            </div>
            <svg-wrapper
              class="search--close-icon header-icon"
              :svg_src="'close'"
              @click.native="closeSearch"
            ></svg-wrapper>
            <div class="search__suggestions" v-if="searchtext">
              <div class="search__suggestions--products">
                <div
                  class="b1 search__suggestions--title font-body"
                  v-if="
                    !isDoubleRowHeader &&
                    searchData?.product_suggestions?.length > 0
                  "
                >
                  PRODUCTS
                </div>
                <ul v-if="searchData?.product_suggestions?.length > 0">
                  <li
                    class="search__suggestions--item flex-align-center"
                    v-for="(product, index) in getProductSearchSuggestions(
                      searchData.product_suggestions
                    )"
                    :key="index"
                    @click.stop="redirectToProduct(product.url)"
                  >
                    <emerge-image
                      class="product-thumb"
                      :src="product.image?.url"
                      :alt="product.image?.alt"
                      showSkeleton
                      :sources="[{ width: 56 }]"
                    />
                    <div class="product-title b1 font-body">
                      <template v-if="screen === 'mobile'">
                        {{
                          product.name.length > 40
                            ? `${product.name.substring(0, 40)}...`
                            : product.name
                        }}
                      </template>
                      <template v-else>
                        {{
                          product.name.length > 95
                            ? `${product.name.substring(0, 95)}...`
                            : product.name
                        }}
                      </template>
                    </div>
                  </li>
                </ul>
                <ul
                  v-if="
                    searchData?.product_suggestions?.length === 0 && showSearch
                  "
                >
                  <div @click="redirectToProduct('/products/?q=' + searchtext)">
                    <li
                      class="search__suggestions--item flex-align-center no-result font-body"
                    >
                      No match found
                    </li>
                  </div>
                </ul>
                <div
                  class="search__suggestions--button"
                  v-if="searchData?.product_suggestions?.length > 0"
                >
                  <button
                    class="btn-link font-body"
                    @click="getEnterSearchData(searchData)"
                  >
                    <span>VIEW ALL</span>
                    <svg-wrapper
                      class="show-more-icon"
                      :svg_src="'arrow-left-long'"
                      v-if="
                        getGlobalConfigValue(global_config, 'header_layout') ===
                        'single'
                      "
                    ></svg-wrapper>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </fdk-search>
    </transition>
  </div>
</template>

<script>
import { getGlobalConfigValue } from "../../helper/utils";
import SvgWrapper from "../common/svg-wrapper.vue";
import emergeImage from "../../global/components/common/emerge-image.vue";

export default {
  props: {
    context: {
      type: Object,
      default: () => {
        return {};
      },
    },
    global_config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    screen: {
      type: String,
      enum: ["mobile", "desktop"],
      default: "mobile",
    },
  },
  components: {
    "svg-wrapper": SvgWrapper,
    "emerge-image": emergeImage,
  },
  data() {
    return {
      isMounted: false,
      showSearch: false,
      searchtext: "",
      isSearchFocused: false,
    };
  },
  computed: {
    isDoubleRowHeader() {
      return (
        getGlobalConfigValue(this.global_config, "header_layout") === "double"
      );
    },
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    getGlobalConfigValue,
    openSearch() {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        this.$emit("searchOpened");
        setTimeout(function () {
          document.getElementById("searchInput").focus();
        }, 1500);
      }
    },
    closeSearch() {
      this.showSearch = false;
      this.searchtext = "";
      this.isSearchFocused = false;
    },
    getEnterSearchData(searchData) {
      if (this.searchtext.trim()) {
        searchData.executeQuery(this.searchtext);
        this.closeSearch();
      }
    },
    redirectToProduct(link) {
      this.$router.push(link);
      this.closeSearch();
    },
    getProductSearchSuggestions(results) {
      return results.slice(0, 4);
    },
    checkInput() {
      if (this.searchtext) {
        return;
      }
      this.isSearchFocused = false;
    },
  },
};
</script>

<style lang="less" scoped>
@lg-min: 1024px;
.search {
  position: absolute;
  .inset(0);
  background-color: @HeaderBackground;
  z-index: 1;

  @media @desktop {
    padding: 20px 0;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px 8px;
    @media @desktop {
      width: 600px;
      padding: 0;
      margin-left: auto;
      margin-right: auto;
    }
  }

  &__input {
    position: relative;
    flex-grow: 1;
    &--text {
      width: 100%;
      padding: 7px 32px;
      font-size: 12px;
      line-height: 20px;
      border-radius: 8px;
      border: 1px solid @DividerStokes;
      @media @desktop {
        font-size: 14px;
        padding: 9px 38px;
      }
    }
    &--search-icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 8px;
      fill: #928b8b;
      @media @desktop {
        width: 24px;
        height: 24px;
      }
    }
  }
  &--close-icon {
    margin-left: 8px;
  }
  &__suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    &--products {
      padding: 16px 8px;
      background-color: @DialogBackground;
      border: 1px solid @DividerStokes;
      border-radius: 0 0 4px 4px;
      box-shadow: 0px 12px 16px 0px rgba(0, 0, 0, 0.16),
        0px 4px 4px 0px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      @media @desktop {
        width: 600px;
        margin-left: auto;
        margin-right: auto;
      }
      > ul {
        overflow-y: auto;
      }
    }
    &--item {
      cursor: pointer;
      &:not(:last-child) {
        margin-bottom: 12px;
        @media @desktop {
          margin-bottom: 8px;
        }
      }
      &.no-result {
        height: 20px;
      }
      .product-thumb {
        flex: 0 0 56px;
        border-radius: 4px;
        margin-right: 12px;
      }
      .product-title {
        color: @TextHeading;
        @media @desktop {
          .text-line-clamp();
        }
      }
    }
    &--button {
      text-align: center;
      margin-top: 12px;
      @media @desktop {
        margin-top: 8px;
      }
    }
  }
}
.double-row-search .search__suggestions {
  @media @desktop {
    top: calc(100% + 8px);
  }
}
.single-row-search {
  .search-icon {
    width: 18px !important;
    height: 18px !important;
    color: @HeaderIcon;
  }
  .search {
    padding: 0;
    &--close-icon {
      margin-left: 16px;
      @media @desktop {
        width: 32px !important;
        height: 32px !important;
        margin-left: 32px;
      }
    }
    &__wrapper {
      padding: 8px;
      @media @mobile-up {
        padding: 8px 24px;
      }
      @media @desktop {
        padding: 11px 0 0;
        width: 884px;
      }
    }
    &__input {
      padding: 4px 16px;
      height: 42px;
      border: 1px solid @TextLabel;
      border-radius: 4px;
      background: @ThemeAccentL5;
      @media @desktop {
        padding: 6px 16px;
        height: 48px;
      }
      &--text {
        background: transparent;
        border: none;
        padding: 0;
        height: calc(100% - 19px);
        border-radius: unset;
        position: absolute;
        bottom: 4px;
        left: 16px;
        z-index: 2;
      }
      &--label {
        position: absolute;
        top: 50%;
        left: 16px;
        transform: translateY(-50%);
        color: @TextDisabled;
        transition: 300ms all cubic-bezier(0, 0, 0.2, 1);
        &.active {
          font-size: 10px;
          font-weight: 300;
          line-height: 12px;
          letter-spacing: 0em;
          top: 4px;
          transform: unset;
          color: @TextBody;
        }
      }
      &--search-icon {
        left: unset;
        right: 10px;
        fill: @TextHeading;
        z-index: 3;
      }
    }
    &__suggestions {
      &--products {
        padding: 20px 8px;
        margin: 0;
        @media @desktop {
          width: calc(100% - 64px);
        }
      }
      &--item {
        padding: 0 16px;
        margin-bottom: 16px;
        &:last-child {
          margin-bottom: 0;
        }
        .product-title {
          color: @TextLabel;
        }
      }
      &--title {
        margin: 0 16px 24px;
        padding-bottom: 3px;
        border-bottom: 1px solid @DividerStokes;
      }
      &--button {
        margin: 24px 16px 0;
        padding: 12px 0 0;
        border-top: 1px solid @DividerStokes;
        .btn-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          color: @TextHeading;
          width: 100%;
          .show-more-icon {
            width: 15px;
            height: 15px;
            transform: rotate(180deg);
            fill: @TextLabel;
          }
        }
      }
    }
  }
}
</style>
