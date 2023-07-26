<template>
  <div class="header-desktop">
    <div class="first-row">
      <div class="left">
        <Navigation
          :class="[
            'first-row-nav',
            getGlobalConfigValue(global_config, 'header_layout'),
          ]"
          :context="context"
          :global_config="global_config"
          :maxMenuLenght="getMenuMaxLength"
          :fallbackLogo="fallbackLogo"
          v-if="!isDoubleRowHeader"
        />
      </div>
      <div class="middle logo-wrapper flex-center">
        <fdk-link link="/" class="middle__logo">
          <img class="logo" :src="getShopLogo" alt="Brand Logo" />
        </fdk-link>
      </div>
      <fdk-accounts class="right right__icons">
        <template slot-scope="accountsData">
          <i18n-dropdown :context="context" />
          <div
            class="label-signin b2 font-body"
            v-if="isMounted && isDoubleRowHeader && !accountsData.is_logged_in"
            @click="checkLogin(accountsData, 'profile')"
          >
            <span>Sign in</span>
          </div>
          <div class="icon right__icons--search">
            <Search
              :class="[
                `${getGlobalConfigValue(
                  global_config,
                  'header_layout'
                )}-row-search`,
              ]"
              :global_config="global_config"
            />
          </div>
          <div
            class="icon right__icons--profile"
            v-if="isMounted && isDoubleRowHeader && accountsData.is_logged_in"
            @click="checkLogin(accountsData, 'profile')"
          >
            <svg-wrapper
              class="user header-icon"
              :svg_src="'user'"
            ></svg-wrapper>
          </div>
          <div
            class="icon right__icons--wishlist"
            @click="checkLogin(accountsData, 'wishlist')"
          >
            <div>
              <svg-wrapper
                class="wishlist header-icon"
                :svg_src="
                  isDoubleRowHeader ? 'wishlist' : 'single-row-wishlist'
                "
              ></svg-wrapper>
              <p
                class="count"
                v-if="
                  isMounted &&
                  accountsData.is_logged_in &&
                  getWishlistCount !== 0
                "
              >
                {{ getWishlistCount }}
              </p>
            </div>
          </div>
          <div
            class="icon right__icons--profile"
            v-if="!isDoubleRowHeader"
            @click="checkLogin(accountsData, 'profile')"
          >
            <svg-wrapper
              class="user header-icon"
              :svg_src="'single-row-user'"
            ></svg-wrapper>
          </div>
          <div
            class="icon right__icons--bag"
            v-if="isMounted && !global_config.props.disable_cart"
            @click="checkLogin(accountsData, 'cart')"
          >
            <div>
              <svg-wrapper
                class="cart header-icon"
                :svg_src="isDoubleRowHeader ? 'cart' : 'single-row-cart'"
              >
              </svg-wrapper>
              <p class="count" v-if="context.cart_item_count !== 0">
                {{ context.cart_item_count }}
              </p>
            </div>
          </div>
        </template>
      </fdk-accounts>
    </div>
    <Navigation
      class="second-row"
      :context="context"
      :global_config="global_config"
      :maxMenuLenght="getMenuMaxLength"
      :fallbackLogo="fallbackLogo"
      v-if="isDoubleRowHeader"
    />
  </div>
</template>

<script>
import { getGlobalConfigValue } from "../../helper/utils";
import SvgWrapper from "../common/svg-wrapper.vue";
import I18nDropdown from "./i18n-dropdown.vue";
import Navigation from "./navigation.vue";
import Search from "./search.vue";

export default {
  props: {
    context: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    global_config: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    checkLogin: {
      type: Function,
      required: true,
    },
    fallbackLogo: {
      type: String,
      required: true,
    },
  },
  components: {
    "svg-wrapper": SvgWrapper,
    Navigation,
    Search,
    "i18n-dropdown": I18nDropdown,
  },
  data() {
    return {
      isMounted: false,
      maxSingleRowMenuLenght: {
        layout_1: 6,
        layout_2: 6,
        layout_3: 6,
        layout_4: 5,
      },
      maxDoubleRowMenuLenght: 10,
    };
  },
  mounted() {
    this.isMounted = true;
  },
  computed: {
    isDoubleRowHeader() {
      return (
        getGlobalConfigValue(this.global_config, "header_layout") === "double"
      );
    },
    getMenuMaxLength() {
      if (this.isDoubleRowHeader) {
        return this.maxDoubleRowMenuLenght;
      }

      return this.maxSingleRowMenuLenght[
        getGlobalConfigValue(this.global_config, "logo_menu_alignment")
      ];
    },
    getShopLogo() {
      return this.context?.logo?.secure_url || this.fallbackLogo;
    },
    getWishlistCount() {
      return this.context?.favourite_ids?.length;
    },
  },
  methods: {
    getGlobalConfigValue,
  },
};
</script>

<style lang="less" scoped>
.header-desktop {
  .first-row {
    display: flex;
    padding: 12px 0;
    .middle {
      .logo,
      a {
        max-height: 55px;
      }
    }
    .left,
    .right {
      display: flex;
      align-items: center;
      flex: 1;
    }
    .right__icons {
      justify-content: flex-end;
      .column-gap(16px);
      &--bag,
      &--wishlist {
        & > div {
          position: relative;
          .count {
            width: 16px;
            height: 16px;
            background-color: @HeaderIcon;
            color: @HeaderBackground;
            border-radius: 50%;
            font-weight: 700;
            font-size: 10px;
            .flex-center();
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(50%, -50%);
          }
        }
      }
      .label-signin {
        color: @HeaderNav;
        cursor: pointer;
      }
    }
  }
  .second-row {
    display: flex;
    justify-content: center;
  }
  &.layout_1,
  &.layout_2,
  &.layout_3 {
    .first-row {
      .left {
        margin: 0 74px;
        justify-content: center;
      }
      .middle {
        order: -1;
      }
      .right {
        flex: 0 1 auto;
      }
    }
  }
  &.layout_2 {
    .first-row {
      .left {
        justify-content: flex-start;
      }
    }
  }
  &.layout_3 {
    .first-row {
      .left {
        justify-content: flex-end;
      }
    }
  }
  &.single {
    &.layout_4 {
      .first-row {
        .middle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .first-row {
      @media @desktop {
        padding: 15px 0;
      }
      .middle {
        .logo,
        a {
          max-height: 36px;
        }
      }
      .right__icons {
        .column-gap(31px);
        .header-icon {
          width: 18px;
          height: 18px;
        }
        &--bag,
        &--wishlist {
          & > div .count {
            width: 14px;
            height: 14px;
          }
        }
        &--bag {
          & > div .count {
            transform: translate(4px, 0px);
          }
        }
        &--wishlist {
          & > div .count {
            transform: translate(3px, -3px);
          }
        }
      }
    }
  }
  &.double {
    &.layout_2 {
      .second-row {
        justify-content: flex-start;
      }
    }
    &.layout_3 {
      .second-row {
        justify-content: flex-end;
      }
    }
  }
}
</style>
