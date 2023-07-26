<template>
  <div>
    <nav class="nav" v-if="isHorizontalNav">
      <ul class="l1-navigation-list">
        <li
          class="l1-navigation-list__item h5 flex-align-center font-body"
          v-for="(l1nav, index) in getNavigation"
          :key="index"
        >
          <fdk-link :link="l1nav.link">
            <span class="menuTitle flex-align-center">
              <span>{{ l1nav.display }}</span>
              <svg-wrapper
                v-if="l1nav.sub_navigation && l1nav.sub_navigation.length > 0"
                class="menu-icon dropdown-icon"
                :svg_src="'arrow-down'"
              ></svg-wrapper>
            </span>
          </fdk-link>
          <div class="navigationWrapper" :style="getMenuOffset">
            <ul
              class="l2-navigation-list"
              v-if="l1nav.sub_navigation && l1nav.sub_navigation.length > 0"
            >
              <li
                class="l2-navigation-list__item b1 font-body"
                v-for="(l2nav, index) in l1nav.sub_navigation"
                :key="index"
              >
                <fdk-link
                  :link="l2nav.link"
                  class="l2-navigation-list__item--wrapper"
                >
                  <span class="flex-align-center justify-between">
                    <span>{{ l2nav.display }}</span>
                    <svg-wrapper
                      v-if="
                        l2nav.sub_navigation && l2nav.sub_navigation.length > 0
                      "
                      class="menu-icon arrow-right-icon"
                      :svg_src="'arrow-down'"
                    ></svg-wrapper>
                  </span>
                </fdk-link>

                <ul
                  class="l3-navigation-list"
                  v-if="l2nav.sub_navigation && l2nav.sub_navigation.length > 0"
                >
                  <li
                    class="l3-navigation-list__item b1 font-body"
                    v-for="(l3nav, index) in l2nav.sub_navigation"
                    :key="index"
                  >
                    <fdk-link
                      :link="l3nav.link"
                      class="l3-navigation-list__item--wrapper"
                    >
                      <span class="flex-align-center">
                        {{ l3nav.display }}
                      </span>
                    </fdk-link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
    <div class="icon flex-center" v-if="isSidebarNav">
      <svg-wrapper
        class="close-icon menu-icon"
        :svg_src="'close'"
        v-if="showSidebar"
        @click.native="closeSidebarNav()"
      ></svg-wrapper>
      <svg-wrapper
        class="hamburger-icon menu-icon"
        :svg_src="'hamburger'"
        v-else
        @click.native="openSidebarNav()"
      ></svg-wrapper>
    </div>
    <transition name="slide">
      <div class="sidebar" v-if="showSidebar">
        <div
          class="sidebar__header flex-align-center justify-between"
          v-if="
            getGlobalConfigValue(global_config, 'header_layout') === 'double'
          "
        >
          <fdk-link link="/">
            <img
              class="logo"
              :src="getShopLogoMobile"
              alt
              @click.stop="closeSidebarNav()"
            />
          </fdk-link>
          <span class="close-icon" @click.stop="closeSidebarNav()">
            <svg-wrapper
              class="menu-icon cross-icon sidebar-icon"
              :svg_src="'close'"
            ></svg-wrapper>
          </span>
        </div>
        <nav class="sidebar__navigation">
          <transition name="fade" mode="out-in">
            <ul v-if="showSidebarNav" key="l1_Nav">
              <li
                class="sidebar__navigation--item flex-align-center justify-between font-body h5"
                v-for="(nav, index) in getNavigation"
                :key="index"
                @click.stop="redirectToMenu(nav, 'l2')"
              >
                <fdk-link
                  v-if="!(nav.sub_navigation && nav.sub_navigation.length)"
                  class="nav-link"
                  :link="nav.link"
                >
                  {{ nav.display }}
                </fdk-link>
                <p v-else>
                  {{ nav.display }}
                </p>
                <div v-if="nav.sub_navigation && nav.sub_navigation.length > 0">
                  <svg-wrapper
                    class="arrow-right-icon sidebar-icon menu-icon"
                    :svg_src="'arrow-down'"
                    v-if="
                      getGlobalConfigValue(global_config, 'header_layout') ===
                      'double'
                    "
                  ></svg-wrapper>
                  <svg-wrapper
                    class="arrow-icon sidebar-icon menu-icon"
                    :svg_src="'arrow-left-long'"
                    v-else
                  ></svg-wrapper>
                </div>
              </li>
            </ul>
            <ul v-else-if="sidebarl2Nav.state" key="l2_Nav">
              <li
                class="sidebar__navigation--item title flex-align-center justify-start font-body"
                :class="[`${isDoubleRowHeader ? 'b1' : 'h5'}`]"
                v-if="sidebarl2Nav.title"
                @click="goBack('l1')"
              >
                <svg-wrapper
                  class="arrow-left-icon sidebar-icon menu-icon"
                  :svg_src="
                    isDoubleRowHeader ? 'arrow-down' : 'arrow-left-long'
                  "
                ></svg-wrapper>
                <span>
                  {{ sidebarl2Nav.title }}
                </span>
              </li>
              <li
                class="sidebar__navigation--item flex-align-center justify-between font-body"
                :class="[`${isDoubleRowHeader ? 'h5' : 'b1'}`]"
                v-for="(nav, index) in sidebarl2Nav.navigation"
                :key="index"
                @click.stop="redirectToMenu(nav, 'l3')"
              >
                <fdk-link
                  v-if="!(nav.sub_navigation && nav.sub_navigation.length)"
                  class="nav-link"
                  :link="nav.link"
                >
                  {{ nav.display }}
                </fdk-link>
                <p v-else>
                  {{ nav.display }}
                </p>
                <div v-if="nav.sub_navigation && nav.sub_navigation.length > 0">
                  <svg-wrapper
                    class="arrow-right-icon sidebar-icon menu-icon"
                    :svg_src="'arrow-down'"
                    v-if="
                      getGlobalConfigValue(global_config, 'header_layout') ===
                      'double'
                    "
                  ></svg-wrapper>
                  <svg-wrapper
                    class="arrow-icon sidebar-icon menu-icon"
                    :svg_src="'arrow-left-long'"
                    v-else
                  ></svg-wrapper>
                </div>
              </li>
            </ul>
            <ul v-else-if="sidebarl3Nav.state" key="l3_Nav">
              <li
                class="sidebar__navigation--item title flex-align-center justify-start font-body"
                :class="[`${isDoubleRowHeader ? 'b1' : 'h5'}`]"
                v-if="sidebarl3Nav.title"
                @click="goBack('l2')"
              >
                <svg-wrapper
                  class="arrow-left-icon sidebar-icon menu-icon"
                  :svg_src="'arrow-down'"
                  v-if="
                    getGlobalConfigValue(global_config, 'header_layout') ===
                    'double'
                  "
                ></svg-wrapper>
                <svg-wrapper
                  class="arrow-left-icon sidebar-icon menu-icon"
                  :svg_src="'arrow-left-long'"
                  v-else
                ></svg-wrapper>
                <span>
                  {{ sidebarl3Nav.title }}
                </span>
              </li>
              <li
                class="sidebar__navigation--item flex-align-center justify-between font-body"
                :class="[`${isDoubleRowHeader ? 'h5' : 'b1'}`]"
                v-for="(nav, index) in sidebarl3Nav.navigation"
                :key="index"
              >
                <fdk-link v-if="nav.link" :link="nav.link">
                  <p>{{ nav.display }}</p>
                </fdk-link>
                <p v-else>
                  {{ nav.display }}
                </p>
              </li>
            </ul>
          </transition>
        </nav>

        <fdk-accounts class="sidebar__footer">
          <template slot-scope="accountsData">
            <div
              class="sidebar__footer--item account flex-align-center font-body h5"
              v-if="isDoubleRowHeader"
              @click="
                checkLogin(accountsData, 'profile_mobile');
                showSidebar = false;
              "
            >
              <svg-wrapper
                class="user sidebar-icon menu-icon"
                :svg_src="'user'"
              ></svg-wrapper>
              <span>Account</span>
            </div>
            <div
              class="sidebar__footer--item wishlist flex-align-center font-body"
              :class="[`${isDoubleRowHeader ? 'h5' : 'b1'}`]"
              @click="
                checkLogin(accountsData, 'wishlist');
                showSidebar = false;
              "
            >
              <svg-wrapper
                class="wishlist menu-icon sidebar-icon"
                :svg_src="'wishlist'"
              ></svg-wrapper
              ><span>Wishlist</span>
            </div>
            <div
              class="sidebar__footer--item login flex-align-center font-body b1"
              v-if="!isDoubleRowHeader"
              @click="
                checkLogin(
                  accountsData,
                  isMounted && accountsData.is_logged_in
                    ? 'profile_mobile'
                    : 'logout'
                );
                showSidebar = false;
              "
            >
              <svg-wrapper
                class="user sidebar-icon menu-icon"
                :svg_src="'user'"
              ></svg-wrapper>
              <span v-if="isMounted && accountsData.is_logged_in">Account</span>
              <span v-else>Log in</span>
            </div>
            <ul
              class="social flex-align-center"
              v-if="
                getGlobalConfigValue(global_config, 'header_layout') ===
                  'single' && isSocialLinks
              "
            >
              <template
                v-for="(item, key, index) in context &&
                context.app_info &&
                context.app_info.social_links"
              >
                <li class="social-icon" v-if="item.link" :key="index">
                  <fdk-link
                    :link="item.link"
                    target="_blank"
                    :title="item.title"
                  >
                    <svg-wrapper
                      class="icon"
                      :svg_src="`nav-${key}`"
                    ></svg-wrapper>
                  </fdk-link>
                </li>
              </template>
            </ul>
          </template>
        </fdk-accounts>
      </div>
    </transition>
    <div
      class="overlay"
      :class="{ show: showSidebar }"
      @click.stop="closeSidebarNav()"
    ></div>
  </div>
</template>

<script>
import { isBrowser } from "browser-or-node";
import { getGlobalConfigValue } from "../../helper/utils";
import SvgWrapper from "../common/svg-wrapper.vue";
export default {
  props: {
    maxMenuLenght: {
      type: Number,
      default: 5,
    },
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
    isSidebarNav: {
      type: Boolean,
      default: false,
    },
    fallbackLogo: {
      type: String,
      required: true,
    },
    reset: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    "svg-wrapper": SvgWrapper,
  },
  data() {
    return {
      isMounted: false,
      showSidebar: false,
      showSidebarNav: true,
      sidebarl2Nav: {},
      sidebarl3Nav: {},
    };
  },
  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        this.closeSidebarNav();
      }
    },
    reset(newVal) {
      if (newVal) {
        this.closeSidebarNav();
      }
    },
    showSidebar(newValue) {
      // To stop document scroll when modal is active
      if (isBrowser) {
        if (newValue) {
          document.body.style.position = "fixed";
          document.body.style.top = `-${this.scrollY}px`;
        } else {
          const scrollY = document.body.style.top;
          document.body.style.position = "";
          document.body.style.top = "";
          window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }
      }
    },
  },
  mounted() {
    this.isMounted = true;
  },
  computed: {
    isHorizontalNav() {
      return this.context?.navigation?.length > 0 && !this.isSidebarNav;
    },
    getNavigation() {
      return this.context?.navigation?.slice(0, this.maxMenuLenght);
    },
    getMenuOffset() {
      let val = this.global_config?.props?.menu_layout_desktop;

      return val === "layout_1" || val === "layout_2"
        ? "padding-top: 20px"
        : "padding-top: 4px";
    },
    getShopLogoMobile() {
      return (
        this.context?.mobile_logo?.secure_url ||
        this.context?.logo?.secure_url ||
        this.fallbackLogo
      );
    },
    isDoubleRowHeader() {
      return (
        getGlobalConfigValue(this.global_config, "header_layout") === "double"
      );
    },
    isSocialLinks() {
      const socialLinks = this.context?.app_info?.social_links;
      return (
        Object.keys(socialLinks).filter((item) => socialLinks[item].link)
          .length > 0
      );
    },
  },
  methods: {
    getGlobalConfigValue,
    openSidebarNav() {
      this.showSidebar = true;
    },
    closeSidebarNav() {
      this.showSidebar = false;
      this.showSidebarNav = true;
      this.sidebarl2Nav = {};
      this.sidebarl3Nav = {};
    },
    redirectToMenu(menu, level) {
      if (!menu.sub_navigation.length) {
        this.closeSidebarNav();
      } else {
        if (level === "l2") {
          this.showSidebarNav = false;
          this.sidebarl2Nav = {
            state: true,
            title: menu.display,
            navigation: menu.sub_navigation,
          };
        }
        if (level === "l3") {
          (this.sidebarl2Nav.state = false),
            (this.sidebarl3Nav = {
              state: true,
              title: menu.display,
              navigation: menu.sub_navigation,
            });
        }
      }
    },
    goBack(level) {
      if (level === "l2") {
        this.sidebarl2Nav.state = true;
      }
      if (level === "l1") {
        this.showSidebarNav = true;
      }
    },
    checkLogin(accountsData, type) {
      if (!accountsData.is_logged_in) {
        accountsData.openLogin();
        return;
      }

      if (type === "profile") this.$router.push("/profile/details");
      else if (type === "profile_mobile") this.$router.push("/profile");
      else if (type === "wishlist") this.$router.push("/wishlist");
      else if (type === "logout") accountsData.signOut();
    },
  },
};
</script>

<style lang="less" scoped>
.menu-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  fill: @HeaderIcon;
  &.arrow-right-icon {
    transform: rotate(-90deg);
  }
}
.icon {
  width: 32px;
  height: 32px;
}
.hamburger-icon {
  width: 32px;
  height: 32px;
}
.nav {
  @media @desktop {
    .l1-navigation-list {
      display: flex;
      .column-gap(32px);
      &__item {
        position: relative;
        padding: 12px 0;
        color: @HeaderNav;
        .menuTitle {
          white-space: nowrap;
        }
        .menuTitle,
        .menuTitle > .dropdown-icon {
          transition: all 0.25s ease;
        }
        &:hover {
          .menuTitle {
            opacity: 0.5;
            .dropdown-icon {
              transform: scale(1, -1);
            }
          }
          .navigationWrapper {
            display: block;
          }
        }
      }
      .l2-navigation-list,
      .l3-navigation-list {
        display: none;
        position: absolute;
        width: 216px;
        border-radius: 8px;
        padding: 8px 0;
        background-color: @DialogBackground;
        box-shadow: 0px 12px 16px rgba(0, 0, 0, 0.16),
          0px 4px 4px rgba(0, 0, 0, 0.15);
        z-index: 100;
        opacity: 1;
        &__item {
          &--wrapper {
            display: block;
            padding: 8px 16px;
            margin: 0 8px;
            line-height: 24px;
            border-radius: 8px;
            color: @TextHeading;
            &:hover {
              background-color: @ThemeAccentL3;
            }
          }
        }
      }
      .navigationWrapper {
        background: transparent;
        padding-top: 4px;
        display: none;
        position: absolute;
        top: 100%;

        .l2-navigation-list {
          display: block;
          top: 100%;
          left: 0;
          position: static;
          &__item {
            position: relative;
            &:hover {
              .l3-navigation-list {
                display: block;
              }
            }
          }
          .l3-navigation-list {
            top: 0;
            left: calc(100% + 2px);
          }
        }
      }
    }
  }
}
.overlay {
  display: none;
  position: fixed;
  .inset(0);
  background: @Overlay;
  opacity: 0.6;
  z-index: 99;
  &.show {
    display: block;
  }
}
.sidebar {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 288px;
  background-color: @DialogBackground;
  @media @mobile-up {
    width: 554px;
  }
  &__header {
    padding: 12px 16px;
    border-bottom: 1px solid @DividerStokes;
    .logo {
      max-height: 24px;
    }
    .cross-icon {
      width: 28px;
      height: 28px;
    }
  }
  &__navigation {
    flex-grow: 1;
    overflow-y: auto;
    padding: 16px;
    font-weight: 600;
    padding-bottom: 0;
    &--item {
      padding: 8px 0;
      color: @TextHeading;
      border-bottom: 1px solid @ThemeAccentL2;
      line-height: 24px;
      cursor: pointer;
      &:first-child {
        padding-top: 4px;
      }
      &:last-child {
        border-color: transparent;
      }
      &.title {
        .arrow-left-icon {
          transform: rotate(90deg);
          margin-left: -8px;
        }
      }
      .nav-link {
        width: 100%;
      }
    }
  }
  &__footer {
    padding: 16px;
    &--item {
      padding: 8px 0;
      .column-gap(8px);
      color: @TextHeading;
      cursor: pointer;
    }
    .sidebar-icon {
      width: 16px;
      height: 16px;
    }
  }
}
.single {
  .l1-navigation-list {
    &__item:hover {
      .menuTitle {
        opacity: 1;
        text-decoration: underline;
      }
    }
  }
  .sidebar {
    top: var(--headerHeight);
    &__navigation {
      padding: 40px 24px 0;
      &--item {
        border: none;
        line-height: 20px;
        padding: 4px 0;
        margin-bottom: 12px;
        &.title {
          margin-bottom: 12px;
        }
        .arrow-icon {
          width: 20px;
          height: 20px;
          transform: rotate(180deg);
          fill: currentColor;
        }
        &.title {
          border-radius: 4px;
          background-color: @ThemeAccentL4;
          color: @TextHeading;
          padding: 9px 5px;
          .arrow-left-icon {
            all: revert;
            width: 20px;
            height: 20px;
            margin-right: 8px;
            fill: @TextHeading;
          }
        }
      }
    }
    &__footer {
      padding-bottom: 32px;
      background-color: @ThemeAccentL4;
      &--item {
        color: @TextHeading;
        .sidebar-icon {
          fill: currentColor;
        }
        &:first-child {
          margin-bottom: 8px;
        }
      }
      .social {
        margin-top: 36px;
        flex-wrap: wrap;
        padding-right: 60px;
        .grid-gap(12px, 24px);
        @media @mobile-up {
          .grid-gap(0);
          .column-gap(24px);
        }
        .social-icon {
          .icon {
            fill: @TextHeading;
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
  .overlay {
    z-index: -1;
  }
}
</style>
