<template>
  <footer class="footer">
    <div class="footer__top">
      <div class="footer-container">
        <div class="footer__top--wrapper" v-if="checkFooterDesc">
          <div class="footer__top--info">
            <div class="logo">
              <img
                :src="getGlobalConfigValue(global_config, 'logo')"
                :alt="context.name"
                loading="lazy"
              />
            </div>
            <p class="description b1 font-body">
              {{ getGlobalConfigValue(global_config, "footer_description") }}
            </p>
          </div>
          <div class="footer__top--menu">
            <div
              class="link-block"
              v-for="(item, index) in context.navigation.slice(0, 3)"
              :key="index"
            >
              <h5 class="menu-title font-body">
                <fdk-link v-if="item.link" :link="item.link">
                  {{ item.display }}
                </fdk-link>
                <template v-else>
                  {{ item.display }}
                </template>
              </h5>
              <ul
                class="list"
                v-for="(subItem, index) in item.sub_navigation"
                :key="index"
              >
                <li class="menu-item b1 font-body">
                  <fdk-link v-if="subItem.link" :link="subItem.link">
                    {{ subItem.display }}
                  </fdk-link>
                  <template v-else>{{ subItem.display }}</template>
                </li>
              </ul>
            </div>
            <div
              class="link-block"
              v-if="context.navigation && context.navigation.length === 1"
            ></div>
            <div
              class="link-block"
              v-if="context.navigation && context.navigation.length === 2"
            ></div>
          </div>
        </div>
        <div class="footer__top--contact-info">
          <div class="list" v-if="isContactNo">
            <h5 class="title contacts font-body">Contact Us</h5>
            <div class="detail b1 font-body">
              {{ getNumber }}
            </div>
          </div>
          <div class="list" v-if="isContactEmail">
            <h5 class="title contacts font-body">Email ID</h5>
            <div class="detail b1 font-body">{{ getEmail }}</div>
          </div>
          <div class="list">
            <h5 class="title contacts font-body" v-if="isSocialLinks">
              Social Media
            </h5>
            <span>
              <ul class="social flex-align-center">
                <template
                  v-for="(item, index) in context &&
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
                        class="footerIcon"
                        :svg_src="getSocialIcon(item.title)"
                      ></svg-wrapper>
                    </fdk-link>
                  </li>
                </template>
              </ul>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="footer-container">
        <div class="copyright b1 font-body">
          {{ getCopyright }}
        </div>
        <div class="payment-logo">
          <img
            :src="getGlobalConfigValue(global_config, 'payments_logo')"
            alt="Payment Logo"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import SvgWrapper from "../../components/common/svg-wrapper.vue";
import { getGlobalConfigValue, logoUrl } from "../../helper/utils";

export default {
  props: {
    context: {},
  },
  components: {
    "svg-wrapper": SvgWrapper,
  },
  data() {
    return {
      isMounted: false,
    };
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    getGlobalConfigValue,
    getSocialIcon(title) {
      return title && typeof title === "string"
        ? "footer-" + title.toLowerCase()
        : "";
    },
  },
  computed: {
    getLogoUrl() {
      return logoUrl(this.context.logo, this.context.mobileLogo);
    },
    getEmail() {
      return this.context?.support?.contact?.email?.email[0]?.value;
    },
    getNumber() {
      const phone = this.context?.support?.contact?.phone?.phone[0];
      return `+${phone?.code} ${phone?.number}`;
    },
    getCopyright() {
      return this.context?.app_info?.copyright_text;
    },
    isContactEmail() {
      return (
        this.context?.support?.contact?.email?.active &&
        this.context?.support?.contact?.email?.email.length > 0
      );
    },
    isContactNo() {
      return (
        this.context?.support?.contact?.phone?.active &&
        this.context?.support?.contact?.phone?.phone.length > 0
      );
    },
    isSocialLinks() {
      return this.context?.social_links.length > 0;
    },
    checkFooterDesc() {
      if (
        !getGlobalConfigValue(this.global_config, "logo") &&
        !getGlobalConfigValue(this.global_config, "description") &&
        this.context?.navigation?.length == 0
      ) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="less" scoped>
@lg-min: 1024px;
.footer {
  &__top,
  &__bottom {
    background-color: @FooterBackground;
    .footer-container {
      max-width: @page-width;
      margin-left: auto;
      margin-right: auto;
    }
  }
  &__top {
    &--wrapper {
      @media @desktop {
        display: flex;
        .column-gap(64px);
        justify-content: space-between;
        margin-bottom: 32px;
      }
    }
    .footer-container {
      padding: 16px;
      @media @desktop {
        padding: 32px 40px;
      }
    }
    &--info {
      margin-bottom: 32px;
      @media @mobile-up {
        margin-bottom: 24px;
      }
      @media @desktop {
        flex: 0 1 586px;
        margin-bottom: 0;
      }
      .logo {
        padding: 0 0 14px;
        margin-bottom: 8px;
        @media @desktop {
          padding: 0 0 13px;
        }
        & > img {
          max-height: 25px;
          @media @desktop {
            max-height: 36px;
          }
        }
      }
      .description {
        color: @FooterLinkBody;
      }
    }
    &--menu {
      @media @mobile-up {
        display: flex;
        justify-content: space-between;
        //.column-gap(119px);
      }
      @media @desktop {
        .column-gap(64px);
      }
      .link-block {
        margin-bottom: 32px;
        @media @tablet-strict {
          flex: 1;
        }
        @media @desktop {
          margin-bottom: 0;
          max-width: 147px;
        }
        .menu-title {
          color: @FooterText;
          margin-bottom: 6px;
          @media @desktop {
            margin-bottom: 24px;
            margin-bottom: 8px;
          }
          & > a:hover {
            opacity: 0.7;
          }
        }
        .menu-item {
          color: @FooterLinkBody;
          margin-bottom: 6px;
          & > a:hover {
            opacity: 0.7;
          }
          @media @desktop {
            margin-bottom: 8px;
          }
        }
      }
    }
    &--contact-info {
      background-color: @FooterBottomBackground;
      border-radius: 12px;
      padding: 14px;
      justify-content: space-between;
      @media @mobile-up {
        display: flex;
        justify-content: space-between;
      }
      @media @desktop {
        padding: 14px 18px;
        align-items: center;
      }
      .list {
        @media @tablet-strict {
          flex: 1;
        }
        @media @desktop {
          display: flex;
          align-items: center;
          .column-gap(20px);
        }
        li {
          word-break: break-all;
        }
      }
      .list:not(:last-child) {
        @media @mobile {
          margin-bottom: 24px;
        }
      }
      .title {
        color: @FooterText;
        @media @tablet {
          margin-bottom: 8px;
        }
      }
      .detail {
        color: @FooterLinkBody;
      }
      .social {
        .column-gap(8px);
        .social-icon {
          position: static !important;
          /deep/ svg {
            width: 28px;
            height: 28px;
            overflow: visible;
            &:hover {
              opacity: 0.7;
            }
          }
        }
      }
    }
  }

  &__bottom {
    background-color: @FooterBottomBackground;
    .footer-container {
      padding: 18.5px 16px;
      @media @mobile-up {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      @media @desktop {
        padding: 15.5px 40px;
      }
      .copyright {
        color: @FooterLinkBody;
        @media @mobile {
          margin-bottom: 8px;
        }
      }
      .payment-logo {
        padding: 9px 10px;
        & > img {
          max-height: 18px;
          @media @desktop {
            max-height: 24px;
          }
        }
      }
    }
  }
  ::v-deep .footerIcon svg > path:first-of-type,
  ::v-deep .footerIcon svg g > path:first-of-type {
    fill: @FooterIcon !important;
  }
  ::v-deep .footerIcon svg > path:last-of-type,
  ::v-deep .footerIcon svg g > path:last-of-type {
    stroke: @FooterIcon !important;
  }
}

@media @tablet-strict {
  /deep/ .flex-align-center {
    flex-wrap: wrap;
    max-width: 180px;
  }
  .list li {
    margin-bottom: 10.7px;
  }
}
</style>
