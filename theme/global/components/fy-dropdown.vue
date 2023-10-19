<template>
  <div
    class="fy-dropdown"
    :class="[showDropdownOptions ? 'open' : 'collase']"
    v-click-outside="hideDropdown"
  >
    <div
      class="fy-dropdown__input-wrapper flex-align-center"
      :class="{ 'fy-dropdown__input-wrapper--active': showDropdownOptions }"
    >
      <input
        :id="`dropdown-input-${_uid}`"
        class="fy-dropdown__input b2"
        v-model="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @focus="showDropdown"
        @input="inputUpdateHandler"
        @blur="onInputBlur"
      />
      <label
        class="flex-center"
        :for="`dropdown-input-${_uid}`"
        v-if="showDropdownIcon"
      >
        <svg-wrapper
          class="fy-dropdown__dropdown-icon"
          :class="{
            'fy-dropdown__dropdown-icon--open': showDropdownOptions,
            'fy-dropdown__dropdown-icon--disabled': disabled,
          }"
          :svg_src="'arrow-down'"
        />
      </label>
    </div>
    <div
      class="fy-dropdown__dropdown"
      v-show="showDropdownOptions && options?.length"
    >
      <ul class="fy-dropdown__list" ref="list">
        <li
          class="fy-dropdown__list-item b3"
          v-for="(option, index) in options"
          :key="dataKey ? option?.[dataKey] || index : option"
          @click="selectOption(option)"
        >
          <slot name="listItem" :data="option">
            {{ optionLabel ? option[optionLabel] : option }}
          </slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import svgWrapper from "../../components/common/svg-wrapper.vue";
export default {
  name: "fy-dropdown",
  props: {
    value: {
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    optionLabel: {
      type: String,
    },
    optionValue: {
      type: String,
    },
    dataKey: {
      type: String,
      default: null,
    },
    showDropdownIcon: {
      type: Boolean,
      default: false,
    },
    isLazyLoad: {
      type: Boolean,
      default: false,
    },
    loadingData: {
      type: Boolean,
      default: false,
    },
    loadMoreOffset: {
      type: Number,
      default: 100,
    },
  },
  components: {
    "svg-wrapper": svgWrapper,
  },
  watch: {
    value: {
      handler(newValue) {
        this.inputValue = this.optionValue
          ? newValue?.[this.optionValue] || ""
          : newValue;
      },
      deep: true,
    },
  },
  data() {
    return {
      inputValue: this.optionValue
        ? this.value?.[this.optionValue] || ""
        : this.value,
      showDropdownOptions: false,
    };
  },
  mounted() {
    this.isLazyLoad &&
      this.$refs.list.addEventListener("scroll", this.handleListScroll);
  },
  computed: {},
  methods: {
    inputUpdateHandler(event) {
      this.$emit("search", event.target.value);
    },
    onInputBlur() {
      this.inputValue = this.optionValue
        ? this.value?.[this.optionValue] || ""
        : this.value;
    },
    showDropdown() {
      this.showDropdownOptions = true;
    },
    hideDropdown() {
      this.showDropdownOptions = false;
    },
    selectOption(option) {
      this.inputValue = this.optionValue
        ? option?.[this.optionValue] || ""
        : option;
      this.hideDropdown();
      this.$emit("input", option);
    },
    handleListScroll() {
      const bottom = Math.ceil(
        this.$refs.list.scrollTop + this.$refs.list.clientHeight
      );
      if (bottom + this.loadMoreOffset > this.$refs.list.scrollHeight) {
        !this.loadingData && this.$emit("loadmore", this.inputValue);
      }
    },
  },
  beforeDestroy() {
    this.isLazyLoad &&
      this.$refs.list.removeEventListener("scroll", this.handleListScroll);
  },
};
</script>

<style lang="less" scoped>
.fy-dropdown {
  &__input-wrapper {
    margin-bottom: 4px;
    background: @ThemeAccentL4;
    border-radius: 4px;
    padding: 0px 8px;
  }
  &__input {
    flex: 1 0 0;
    height: 48px;
    border: none;
    overflow: hidden;
    background: transparent;
    color: @TextHeading;
    &::placeholder {
      color: @TextLabel;
    }
    &[disabled] {
      cursor: not-allowed;
    }
    @media @mobile {
      font-size: 16px;
    }
  }
  &__dropdown-icon {
    width: 24px;
    height: 24px;
    fill: @TextHeading;
    cursor: pointer;
    &--disabled {
      cursor: not-allowed;
    }
  }
  &__dropdown {
    padding: 8px;
    background: @ThemeAccentL5;
    border-radius: 4px;
    border: 1px solid @DividerStokes;
    box-shadow: 0px 12px 16px 0px #00000029, 0px 4px 4px 0px #00000026;
  }
  &__list {
    max-height: 136px;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: @ThemeAccentL2;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: @ThemeAccentD3;
      border-radius: 4px;
    }
  }
  &__list-item {
    padding: 8px;
    cursor: pointer;
    &:hover {
      background: @ThemeAccentL3;
    }
  }
}
</style>
