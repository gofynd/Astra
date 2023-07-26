<template>
  <div
    v-if="showI18Dropdown && isInternationalShippingEnabled"
    class="internationalization"
    v-click-outside="hideComponent"
  >
    <div
      class="internationalization--selected flex-align-center"
      @click="showInternationalDropdown = !showInternationalDropdown"
    >
      <div class="b2" v-html="currentSelectedCurrency"></div>
      <svg-wrapper
        :svg_src="'arrow-down'"
        :class="[
          'dropdown-icon',
          'selected-dropdown',
          { rotate: showInternationalDropdown },
        ]"
      />
    </div>
    <div
      v-if="showInternationalDropdown"
      class="internationalization__dropdown"
    >
      <fdk-i18n>
        <template slot-scope="fdkIl8n">
          <div class="section">
            <span class="b1">Ship to</span>
            <div class="dropdown-wrapper" v-click-outside="hideCountryDropdown">
              <div
                :class="[
                  'custom-dropdown flex-align-center justify-between',
                  { active: openCountry },
                ]"
                @click="openCountry = !openCountry"
              >
                <span class="b2 text-ellipsis">
                  {{ selectedCountry.display_name }}
                </span>
                <svg-wrapper
                  :svg_src="'arrow-down'"
                  :class="['dropdown-icon', { rotate: openCountry }]"
                />
              </div>
              <ul
                v-if="
                  context.countries &&
                  context.countries.results &&
                  context.countries.results.length
                "
                :class="['option-wrap', { open: openCountry }]"
              >
                <template v-for="(country, index) of context.countries.results">
                  <li
                    v-if="country.uid !== selectedCountry.uid"
                    class="b2 text-ellipsis"
                    :key="index"
                    @click="onCountrySelect(country)"
                  >
                    {{ country.display_name }}
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <div class="section">
            <span class="b1">Currency</span>
            <div
              class="dropdown-wrapper"
              v-click-outside="hideCurrencyDropdown"
            >
              <div
                :class="[
                  'custom-dropdown flex-align-center justify-between',
                  { active: openCurrency },
                ]"
                @click="openCurrency = !openCurrency"
              >
                <span
                  class="b2 text-ellipsis"
                  :title="getDisplayFormat(currencySelected)"
                >
                  {{ getDisplayFormat(currencySelected) }}
                </span>
                <svg-wrapper
                  :svg_src="'arrow-down'"
                  :class="['dropdown-icon', { rotate: openCurrency }]"
                />
              </div>
              <ul
                v-if="context.currencies && context.currencies.length"
                :class="['option-wrap', { open: openCurrency }]"
              >
                <template v-for="(currency, index) of context.currencies">
                  <li
                    v-if="currency.code !== currencySelected.code"
                    class="text-ellipsis"
                    :key="index"
                    @click="onCurrencySelect(currency)"
                    :title="`${currency.code} ( ${currency.name} )`"
                  >
                    {{ `${currency.code} ( ${currency.name} )` }}
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <button
            class="btn-primary save-btn"
            @click="handleSetI18n(fdkIl8n.setI18nDetails)"
          >
            Save
          </button>
        </template>
      </fdk-i18n>
    </div>
  </div>
</template>

<script>
import SvgWrapper from "../common/svg-wrapper.vue";

import { detectMobileWidth } from "../../helper/utils";
import { isBrowser } from "browser-or-node";

export default {
  components: { "svg-wrapper": SvgWrapper },
  data() {
    return {
      showInternationalDropdown: false,
      openCurrency: false,
      openCountry: false,
      // showConverter: true,
      // currencyConverterRoutes: ["product", "/", "products", "collection"],
      defaultCurrency: {
        code: "INR",
      },
      currencySelected: {},
      selectedCountry: {},
      isInternationalShippingEnabled: false,
    };
  },
  props: {
    context: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  mounted() {
    this.currencySelected =
      this.context?.app_i18n?.currency || this.defaultCurrency;

    this.selectedCountry = this.getCurrentCountry(
      this.context?.app_i18n?.country?.iso_code
    );

    // this.checkCurrencyConvertor();

    // eslint-disable-next-line no-undef
    FPI?.state?.global?.appFetaure?.subscribe((data) => {
      this.isInternationalShippingEnabled =
        data?.feature?.common?.international_shipping?.enabled;
    });
  },
  computed: {
    showI18Dropdown() {
      const whiteListedRoutes = [
        "/product",
        "/products",
        "/collections",
        "/collection",
        "/categories",
        "/brands",
        "/profile/address",
      ];

      const currentPath = this.$route?.path;

      if (currentPath === "/") {
        return true;
      }

      return whiteListedRoutes.some(
        (route) => currentPath.indexOf(route) === 0
      );
    },
    currentSelectedCurrency() {
      if (this.context.app_i18n?.currency?.code) {
        const selectedCountry = detectMobileWidth()
          ? this.context?.app_i18n?.country?.iso_code
          : this.getCurrentCountry(this.context?.app_i18n?.country?.iso_code)
              ?.display_name;

        return `<span>
            ${selectedCountry ? selectedCountry + "/" : ""}${
          this.context?.app_i18n?.currency?.code
        }
          </span>`;
      }
      return this.defaultCurrency.code;
    },
  },
  methods: {
    // checkCurrencyConvertor() {
    //   if (
    //     this.currencyConverterRoutes.indexOf(
    //       window.location.pathname.split("/")[1]
    //     ) !== -1 ||
    //     window.location.pathname.split("/")[1] === ""
    //   ) {
    //     this.showConverter = true;
    //   } else {
    //     this.showConverter = false;
    //   }
    // },
    getDisplayFormat(currency) {
      if (currency?.code) {
        const curr = this.context?.currencies?.find(
          (data) => data.code === currency.code
        );

        if (curr?.code) {
          return `${curr.code}${curr?.name ? " ( " + curr.name + " )" : ""}`;
        }
      }

      return "";
    },
    handleSetI18n(setDetails) {
      if (isBrowser) {
        localStorage.removeItem("m_userPincode");
      }

      setDetails({
        currency: { code: this.currencySelected.code },
        country: {
          iso_code: this.selectedCountry?.meta?.country_code || "",
          isd_code: this.selectedCountry?.meta?.ISD_code || "",
        },
      });
    },
    hideComponent() {
      this.showInternationalDropdown = false;
      this.openCurrency = false;
      this.openCountry = false;
    },
    getCurrentCountry(code) {
      if (code?.length) {
        return this.context.countries?.results?.find((country) => {
          return country.meta?.country_code === code;
        });
      }
      return {};
    },
    hideCountryDropdown() {
      this.openCountry = false;
    },
    onCountrySelect(country) {
      this.selectedCountry = country;
      this.hideCountryDropdown();
    },
    hideCurrencyDropdown() {
      this.openCurrency = false;
    },
    onCurrencySelect(currency) {
      this.currencySelected = currency;
      this.hideCurrencyDropdown();
    },
  },
};
</script>

<style lang="less" scoped>
.internationalization {
  position: relative;
  border: 1px solid @ButtonPrimary;
  border-radius: 4px;

  @media @tablet {
    padding: 0 !important;
    border: unset;
  }

  &--selected {
    padding: 8px;
    cursor: pointer;

    @media @tablet {
      padding: 0 !important;
    }

    .selected-dropdown {
      margin-left: 4px;

      @media @tablet {
        display: none;
      }
    }
  }

  &__dropdown {
    position: absolute;
    background-color: @DialogBackground; //Need to replace proper background color mapping here
    width: 296px;
    padding: 16px;
    z-index: 20;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.05);
    top: calc(100% + 4px);
    right: 0;
    border-radius: 6px;
    border: 1px solid @DividerStokes;

    @media @mobile {
      width: 216px;
      transform: translateX(80px);
    }

    @media @tablet-strict {
      width: 256px;
    }
  }
}

.section {
  margin-bottom: 16px;

  .dropdown-wrapper {
    margin-top: 12px;

    .custom-dropdown {
      border-radius: 4px;
      border: 1px solid @DividerStokes;
      padding: 12px;
      cursor: pointer;

      &.active {
        border: 1px solid @ButtonPrimary;
      }
    }
  }
}

.option-wrap {
  max-height: 176px;
  overflow-y: auto;
  width: 100%;
  border: 1px solid @DividerStokes;
  border-radius: 3px;
  margin-top: 2px;
  display: none;
  padding: 8px;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 3px;
    background-color: #e6e6e6;
  }

  li {
    padding: 8px;
    margin-top: 8px;

    &:first-child {
      margin-top: 0;
    }

    &:hover {
      background: @ThemeAccentL3;
      border-radius: 2px;
      cursor: pointer;
    }
  }

  &.open {
    display: block;
  }
}

.dropdown-icon {
  width: 24px;
  height: 24px;

  &.rotate {
    transform: rotate(180deg);
  }
}

.save-btn {
  width: 100%;
  padding: 16px;
  border-radius: 8px;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
