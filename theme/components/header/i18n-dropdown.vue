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
            <dropdown
              v-model="selectedCountry"
              :options="getFilteredCountries"
              :option-value="'display_name'"
              :option-label="'display_name'"
              :data-key="'uid'"
              showDropdownIcon
              @search="handleCountrySearch"
            />
          </div>
          <div class="section">
            <span class="b1">Currency</span>
            <dropdown
              v-model="currencySelected"
              :options="getFilteredCurrencies"
              :option-value="'display_format'"
              :option-label="'display_format'"
              :data-key="'code'"
              showDropdownIcon
              @search="handleCurrencySearch"
            >
              <template #listItem="slotProps">
                <span>{{ slotProps.data.display_format }}</span>
              </template>
            </dropdown>
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
import fyDropdown from "../../global/components/fy-dropdown.vue";

export default {
  components: { "svg-wrapper": SvgWrapper, dropdown: fyDropdown },
  data() {
    return {
      showInternationalDropdown: false,
      // showConverter: true,
      // currencyConverterRoutes: ["product", "/", "products", "collection"],
      defaultCurrency: {
        code: "INR",
      },
      currencySelected: {},
      selectedCountry: {},
      isInternationalShippingEnabled: false,
      currencySearchText: "",
      countrySearchText: "",
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
  watch: {
    context: {
      handler(newContext, oldContext) {
        if (
          newContext?.app_i18n?.country?.iso_code !==
          oldContext?.app_i18n?.country?.iso_code
        ) {
          this.selectedCountry = this.getCurrentCountry(
            newContext?.app_i18n?.country?.iso_code
          );
        }

        if (
          newContext?.app_i18n?.currency?.code !==
          oldContext?.app_i18n?.currency?.code
        ) {
          this.currencySelected = this.getDefaultCurrency();
        }
      },
      deep: true,
    },
    currencySelected() {
      this.countrySearchText = "";
    },
    selectedCountry() {
      this.currencySearchText = "";
    },
  },
  mounted() {
    this.currencySelected = this.getDefaultCurrency();

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
      if (this.context.app_i18n?.country?.iso_code) {
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
    getFilteredCountries() {
      if (!this.countrySearchText) {
        return this.context.countries.results;
      }
      return this.context.countries.results.filter(
        (country) =>
          country.display_name
            .toLowerCase()
            .indexOf(this.countrySearchText.toLowerCase()) != -1 &&
          country.uid !== this.selectedCountry.uid
      );
    },
    getFormattedCurrency() {
      return this.context.currencies.map((item) => {
        item["display_format"] = this.getDisplayFormat(item);
        return item;
      });
    },
    getFilteredCurrencies() {
      if (!this.currencySearchText) {
        return this.getFormattedCurrency;
      }
      return this.getFormattedCurrency.filter(
        (currency) =>
          (currency.code !== this.currencySelected?.code &&
            currency.code
              .toLowerCase()
              .indexOf(this.currencySearchText.toLowerCase()) != -1) ||
          currency.name
            .toLowerCase()
            .indexOf(this.currencySearchText.toLowerCase()) != -1
      );
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
      const options = {
        currency: { code: this.currencySelected.code },
        country: {
          iso_code: this.selectedCountry?.meta?.iso2 || "",
          isd_code: this.selectedCountry?.meta?.phone_code || "",
        },
      };
      setDetails(options);
    },
    hideComponent() {
      this.showInternationalDropdown = false;
    },
    getCurrentCountry(code) {
      if (code?.length) {
        return this.context.countries?.results?.find((country) => {
          return country.meta?.iso2 === code;
        });
      }
      return {};
    },
    getDefaultCurrency() {
      const defaultCurrencyCode = this.context?.app_i18n?.currency?.code;
      return this.getFormattedCurrency.find(
        (currency) => currency.code === defaultCurrencyCode
      );
    },
    handleCountrySearch(event) {
      this.countrySearchText = event;
    },
    handleCurrencySearch(event) {
      this.currencySearchText = event;
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

  .fy-dropdown {
    margin-top: 12px;

    ::v-deep &__input-wrapper {
      border-radius: 4px;
      border: 1px solid @DividerStokes;
      padding: 0 12px;
      cursor: pointer;
      background: transparent;
      &--active {
        border: 1px solid @ButtonPrimary;
      }
    }
    ::v-deep &__input {
      flex-grow: 1;
      padding: 12px 0;
      border: none;
    }
    ::v-deep &__dropdown-icon {
      margin: 12px 0;
      width: 24px;
      height: 24px;
      &--open {
        transform: rotate(180deg);
      }
    }
    ::v-deep &__dropdown {
      padding: 8px;
      margin-top: 2px;
      background: none;
      border-radius: 3px;
      border: 1px solid @DividerStokes;
      box-shadow: none;
    }
    ::v-deep &__list {
      max-height: 176px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 10px;
      }

      &::-webkit-scrollbar-thumb {
        border: 4px solid rgba(0, 0, 0, 0);
        background-clip: padding-box;
        border-radius: 3px;
        background-color: #e6e6e6;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }
    ::v-deep &__list-item {
      padding: 8px;
      margin-top: 8px;
      .b2(mobile);
      @media @desktop {
        .b2(desktop);
      }

      &:first-child {
        margin-top: 0;
      }

      &:hover {
        border-radius: 2px;
        cursor: pointer;
      }
      span {
        .text-line-clamp();
      }
    }
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
</style>
