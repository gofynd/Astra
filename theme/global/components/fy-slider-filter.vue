<template>
  <div class="slider-filter">
    <div class="cl-Mako light-xxxs font-body" v-if="showSliderText">
      <div v-if="filteritem.values[0] && !filteritem.values[0].currency_code">
        {{ displayVal }}
      </div>
      <div v-if="filteritem.values[0] && filteritem.values[0].currency_code">
        {{ sliderVal[0] | currencyformat }} to
        {{ sliderVal[1] | currencyformat }}
      </div>
    </div>
    <no-ssr>
      <vue-slider
        ref="slider"
        class="price-slider font-body"
        v-model="sliderVal"
        :height="4"
        :min="Math.floor(sliderInfo.min)"
        :max="Math.floor(sliderInfo.max)"
        v-bind="options"
        @click.native="updateSliderInfo($event)"
        @touchend.native="updateSliderInfo($event)"
        @drag-end="updateSliderInfo($event)"
      />
    </no-ssr>
    <div v-if="showTextBox" class="range-box">
      <div class="range-item font-body">
        <label class="label">From</label>
        <div class="flex-align-center">
          <span class="currency" v-if="filteritem.values[0].currency_code">
            {{ filteritem.values[0].currency_symbol }}
          </span>
          <input
            class="font-body"
            :class="{ empty: !minInput }"
            @keyup.enter="onChangeInput"
            v-model="minInput"
            v-on:input="debounceInput"
            type="number"
            :min="Math.floor(sliderInfo.min)"
            :max="Math.floor(sliderInfo.max)"
          />
        </div>
      </div>
      <div class="range-item font-body">
        <label class="label">To</label>
        <div class="flex-align-center">
          <span class="currency" v-if="filteritem.values[0].currency_code">
            {{ filteritem.values[0].currency_symbol }}
          </span>
          <input
            class="font-body"
            :class="{ empty: !maxInput }"
            @keyup.enter="onChangeInput"
            v-model="maxInput"
            v-on:input="debounceInput"
            type="number"
            :min="Math.floor(sliderInfo.min)"
            :max="Math.floor(sliderInfo.max)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.slider-filter {
  margin-top: 35px;
}
.range-box {
  display: flex;
  justify-content: space-between;
  .range-item {
    .label {
      font-size: 12px;
      font-weight: 400;
      line-height: 14px;
      display: block;
      color: @TextBody;
      margin-bottom: 8px;
    }
    .currency {
      font-family: @CurrencyFont;
      font-size: 12px;
      line-height: 14px;
      color: @TextDisabled;
      margin-right: 8px;
    }
  }
  input {
    display: block;
    min-width: 76px;
    max-width: 100px;
    padding: 6px 0;
    border: 1px solid @DividerStokes;
    color: @TextBody;
    text-align: center;
    background: transparent;
    position: relative;
    &[type="number"]::-webkit-inner-spin-button,
    &[type="number"]::-webkit-outer-spin-button {
      position: absolute;
      width: 12.5%;
      height: 100%;
      top: 0;
      right: 0;
    }
  }
}
/deep/ .price-slider {
  margin-bottom: 12px;
  .vue-slider-dot-handle {
    border: 1px solid @ButtonPrimary;
  }
  .vue-slider-process {
    background-color: @ButtonPrimary;
  }
  .vue-slider-tooltip {
    padding: 0;
    border: none;
    background-color: transparent;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: -0.02em;
    color: @TextHeading;
    &::before {
      content: unset !important;
    }
    @media @desktop {
      font-size: 16px;
      line-height: 18px;
    }
  }
  .vue-slider .vue-slider-dot {
    .vue-slider-tooltip-top {
      all: revert;
      position: absolute;
      bottom: calc(100% + 5px);
    }
    &:nth-child(1) .vue-slider-tooltip-top {
      left: 0;
    }
    &:nth-child(2) .vue-slider-tooltip-top {
      right: 0;
    }
  }
}
</style>

<script>
import { debounce } from "./../../helper/utils";
import vueSlider from "vue-slider-component/src/vue2-slider.vue";
import NoSSR from "vue-no-ssr";

export default {
  name: "fy-slider-filter",
  components: {
    "vue-slider": vueSlider,
    "no-ssr": NoSSR,
  },
  props: {
    filteritem: {},
    showTextBox: {
      default: false,
      type: Boolean,
    },
    showSliderText: {
      default: true,
      type: Boolean,
    },
    reset: {
      type: Boolean,
    },
  },
  data() {
    const sliderInfo = this.filteritem.values[0];
    const sliderData = this.getSliderValue();
    return {
      sliderInfo: sliderInfo,
      sliderVal: sliderData,
      displayVal: null,
      minInput:
        Array.isArray(sliderData) && sliderData.length > 0 ? sliderData[0] : 0,
      maxInput:
        Array.isArray(sliderData) && sliderData.length > 0 ? sliderData[1] : 0,
      options: {
        lazy: true,
        useKeyboard: false,
        formatter: (v) =>
          `${this.filteritem.values[0].currency_symbol || ""}${v}`,
      },
    };
  },
  methods: {
    getSliderValue() {
      if (this.filteritem.key.kind === "range") {
        const sliderInfo = this.filteritem.values[0];
        if (sliderInfo.selected_max) {
          const data = [
            Math.floor(sliderInfo.selected_min),
            Math.floor(sliderInfo.selected_max),
          ];
          this.displayVal = this.generateDisplayValue(this.filteritem, data);
          // this.filteritem.query = this.generateQuery(this.filteritem, data);
          return data;
        }
        const data = [Math.floor(sliderInfo.min), Math.floor(sliderInfo.max)];
        this.displayVal = this.generateDisplayValue(this.filteritem, data);
        return data;
      }
      this.displayVal = null;
      return null;
    },
    updateSliderInfo(event) {
      let data = this.$refs.slider.getValue();
      if (this.showTextBox) {
        this.minInput = data[0];
        this.maxInput = data[1];
      }
      let strQuery = this.generateQuery(this.filteritem, data);

      this.$emit("slider-query", strQuery);
    },
    generateQuery(filter, data) {
      let count = 0;
      return filter.values[0].query_format.replace(/{}/g, function (match) {
        count++;
        return data[count - 1];
      });
    },
    generateDisplayValue(filter, data) {
      let count = 0;
      return filter.values[0].display_format.replace(/{}/g, function (match) {
        count++;
        return data[count - 1];
      });
    },
    onChangeInput(event) {
      let min = parseInt(this.minInput);
      let max = parseInt(this.maxInput);
      if (
        min >= 0 &&
        max >= 0 &&
        min >= this.sliderInfo.min &&
        max <= this.sliderInfo.max
      ) {
        if (Number(this.minInput) <= Number(this.maxInput)) {
          this.sliderVal = [Number(this.minInput), Number(this.maxInput)];
          this.displayVal = this.generateDisplayValue(
            this.filteritem,
            this.sliderVal
          );
          let strQuery = this.generateQuery(this.filteritem, this.sliderVal);
          this.$emit("slider-query", strQuery);
        }
      }
    },
    debounceInput: debounce(function (e) {
      this.onChangeInput();
    }, 500),
  },
  watch: {
    reset(newValue) {
      if (newValue === true) {
        this.sliderVal = this.getSliderValue();
        this.sliderInfo = this.filteritem.values[0];
      }
    },
  },
};
</script>
