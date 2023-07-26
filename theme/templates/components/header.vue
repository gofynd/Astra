<template>
  <header class="header" ref="header">
    <div class="header-container">
      <HeaderDesktop
        :class="[
          'desktop',
          getGlobalConfigValue(global_config, 'header_layout'),
          getGlobalConfigValue(global_config, 'logo_menu_alignment'),
        ]"
        :context="context"
        :global_config="global_config"
        :checkLogin="checkLogin"
        :fallbackLogo="fallbackLogo"
      />

      <div
        :class="[
          'mobile',
          getGlobalConfigValue(global_config, 'header_layout'),
          getGlobalConfigValue(global_config, 'logo_menu_alignment'),
        ]"
      >
        <Navigation
          :class="[
            'left flex-align-center mobile-nav',
            getGlobalConfigValue(global_config, 'header_layout'),
          ]"
          :context="context"
          :global_config="global_config"
          :fallbackLogo="fallbackLogo"
          :maxMenuLenght="12"
          :reset="resetNav"
          isSidebarNav
        />
        <fdk-link link="/" class="middle flex-align-center">
          <img class="logo" :src="getShopLogoMobile" alt="Brand Logo" />
        </fdk-link>
        <div class="right">
          <i18n-dropdown :context="context" />
          <div class="icon right__icons--search">
            <Search
              :class="[
                `${getGlobalConfigValue(
                  global_config,
                  'header_layout'
                )}-row-search`,
              ]"
              :global_config="global_config"
              @searchOpened="resetSidebarNav()"
            />
          </div>
          <fdk-accounts>
            <template slot-scope="accountsData">
              <div
                v-if="isMounted && !global_config.props.disable_cart"
                class="icon right__icons--bag"
                @click.stop="checkLogin(accountsData, 'cart')"
              >
                <svg-wrapper
                  class="cart mobile-icon header-icon"
                  :svg_src="
                    getGlobalConfigValue(global_config, 'header_layout') ===
                    'double'
                      ? 'cart'
                      : 'single-row-cart'
                  "
                ></svg-wrapper>
                <span class="cart-count" v-if="context.cart_item_count !== 0">
                  {{ context.cart_item_count }}
                </span>
              </div>
            </template>
          </fdk-accounts>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { isBrowser } from "browser-or-node";
import Values from "values.js";
import {
  getGlobalConfigValue,
  getProductImgAspectRatio,
  throttle,
} from "../../helper/utils";
import Navigation from "../../components/header/navigation.vue";
import SvgWrapper from "../../components/common/svg-wrapper.vue";
import HeaderDesktop from "../../components/header/header-desktop.vue";
import Search from "../../components/header/search.vue";
import I18nDropdown from "../../components/header/i18n-dropdown.vue";
const DEFAULT_LOGO_URL = require("../../assets/images/fynd-logo.png");

export default {
  metaInfo() {
    const style = this.getGlobalCssText;
    return { style };
  },
  props: {
    context: {},
  },
  watch: {},
  components: {
    "svg-wrapper": SvgWrapper,
    Search,
    HeaderDesktop,
    Navigation,
    "i18n-dropdown": I18nDropdown,
  },
  data() {
    return {
      isMounted: false,
      fallbackLogo: DEFAULT_LOGO_URL,
      resetNav: false,
      headerHeight: 0,
    };
  },
  mounted() {
    this.isMounted = true;
    this.headerHeight = this.$refs.header.getBoundingClientRect().height;
    isBrowser && window.addEventListener("resize", this.checkHeaderHeight);
  },
  computed: {
    getShopLogoMobile() {
      return (
        this.context?.mobile_logo?.secure_url ||
        this.context?.logo?.secure_url ||
        this.fallbackLogo
      );
    },
    getGlobalCssText() {
      let cssText = ":root, ::before, ::after {";
      cssText += `
            --imageRadius: ${getGlobalConfigValue(
              this.global_config,
              "image_border_radius"
            )}px;
            --buttonRadius: ${getGlobalConfigValue(
              this.global_config,
              "button_border_radius"
            )}px;
            --productImgAspectRatio: ${getProductImgAspectRatio(
              this.global_config
            )};
            --headerHeight: ${this.headerHeight}px;
            `;
      if (isBrowser) {
        const html = document.querySelector("html");
        const ascentColor = html.style.getPropertyValue("--themeAccent");
        const buttonPrimaryColor =
          html.style.getPropertyValue("--buttonPrimary");
        const buttonLinkColor = html.style.getPropertyValue("--buttonLink");
        if (buttonPrimaryColor) {
          const buttonShade = new Values(buttonPrimaryColor);
          cssText += `
            --buttonPrimaryL1: #${buttonShade.tint(20).hex};
            --buttonPrimaryL3: #${buttonShade.tint(60).hex};
            `;
        }
        if (buttonLinkColor) {
          const buttonLinkShade = new Values(buttonLinkColor);
          cssText += `
            --buttonLinkL1: #${buttonLinkShade.tint(20).hex};
            --buttonLinkL2: #${buttonLinkShade.tint(40).hex};
            `;
        }
        if (ascentColor) {
          const darkShadesColor = new Values(ascentColor).shades(20);
          const lightShadesColor = new Values(ascentColor).tints(20);
          for (let dark in darkShadesColor) {
            cssText += `
            --themeAccentD${parseInt(dark, 10) + 1}: #${
              darkShadesColor[dark].hex
            };
            `;
          }
          for (let light in lightShadesColor) {
            cssText += `
            --themeAccentL${parseInt(light, 10) + 1}: #${
              lightShadesColor[light].hex
            };
            `;
          }
        }
      }
      cssText += `}`;
      return [
        {
          innerHTML: cssText.replace(/\s+/g, "").trim(),
        },
      ];
    },
  },
  methods: {
    getGlobalConfigValue,
    checkLogin(accountsData, type) {
      if (type === "cart") {
        this.$router.push("/cart/bag/");
      } else if (!accountsData.is_logged_in) {
        accountsData.openLogin();
      } else {
        if (type === "profile") this.$router.push("/profile/details");
        else if (type === "profile_mobile") this.$router.push("/profile");
        else if (type === "wishlist") this.$router.push("/wishlist");
      }
    },
    resetSidebarNav() {
      this.resetNav = true;
      const self = this;
      setTimeout(function () {
        self.resetNav = false;
      }, 500);
    },
    checkHeaderHeight: throttle(function () {
      this.headerHeight = this.$refs.header.getBoundingClientRect().height;
    }, 400),
  },
  beforeDestroy() {
    isBrowser && window.removeEventListener("resize", this.checkHeaderHeight);
  },
};
</script>

<style lang="less" scoped>
@lg-min: 1024px;
.header {
  position: relative;
  background-color: @HeaderBackground;
  z-index: unset !important;
  .header-container {
    max-width: @page-width;
    margin-left: auto;
    margin-right: auto;
    @media @desktop {
      padding-inline: 40px;
    }
  }
  ::v-deep .header-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    fill: @HeaderIcon;
  }
  .desktop {
    @media @tablet {
      display: none;
    }
  }

  .mobile {
    display: flex;
    align-content: center;
    padding: 12px 8px;
    .middle {
      .logo {
        max-height: 24px;
      }
    }
    .left,
    .right {
      flex: 1;
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      & > * {
        padding: 4px 8px;
      }
      &__icons {
        &--bag {
          position: relative;
          .cart-count {
            width: 16px;
            height: 16px;
            background-color: @HeaderIcon;
            color: @HeaderBackground;
            border-radius: 50%;
            font-weight: 700;
            font-size: 10px;
            .flex-center();
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(50%, -50%);
          }
        }
      }
    }

    @media @desktop {
      display: none;
    }
    &.single {
      padding: 13px 8px;
      .middle {
        .logo {
          max-height: 23px;
        }
      }
      .right__icons--bag {
        .cart {
          width: 18px;
          height: 18px;
        }
        & > .cart-count {
          width: 14px;
          height: 14px;
          transform: translate(4px, 0px);
        }
      }
    }
  }

  .mobile-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
