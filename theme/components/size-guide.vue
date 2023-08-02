<template>
  <div>
    <transition name="slide-left">
      <div
        class="size-container"
        v-if="product_meta && product_meta.size_chart && isOpen"
      >
        <div class="sidebar-header">
          <div class="title"></div>
          <svg-wrapper
            :svg_src="'close'"
            class="close-icon"
            @click.native="closeDialog"
          ></svg-wrapper>
        </div>
        <div class="size-tabs">
          <div
            :class="[
              'b2',
              'tab',
              'tab__size_guide',
              { active: activeTab === 'size_guide' },
            ]"
            @click="activeTab = 'size_guide'"
          >
            Size guide
          </div>
          <div
            :class="[
              'b2',
              'tab',
              'tab__measure',
              { active: activeTab === 'measure' },
            ]"
            @click="activeTab = 'measure'"
          >
            How to measure
          </div>
        </div>
        <div class="sidebar-body">
          <div
            class="left-container"
            v-bind:class="{ 'cst-lw': !product_meta.size_chart.image }"
            v-if="activeTab === 'size_guide'"
          >
            <div class="btn-group">
              <div
                class="size-desc"
                v-if="
                  product_meta.size_chart && product_meta.size_chart.description
                "
              >
                <fdk-html-content
                  :content="product_meta.size_chart.description"
                >
                </fdk-html-content>
              </div>
              <div class="btn-container" v-if="isSizeChartAvailable">
                <button
                  type="button"
                  v-for="(key, val) in values"
                  :key="key"
                  @click="changeSelectedMetric(key)"
                  :class="[
                    'h5',
                    'unit-btn',
                    'font-body',
                    {
                      'unit-btn__selected': previewSelectedMetric === key,
                    },
                  ]"
                >
                  {{ val }}
                </button>
              </div>
            </div>
            <div class="size-info" v-if="isSizeChartAvailable">
              <table class="size-table">
                <thead>
                  <tr>
                    <th
                      class="b2 size-header"
                      v-for="(item, index) in product_meta.size_chart.headers"
                      :key="'column' + index"
                    >
                      {{ item.value }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in product_meta.size_chart.sizes"
                    :key="'row_' + index"
                    class="size-row"
                  >
                    <td
                      v-for="(cell, i, objIndex) in product_meta.size_chart
                        .headers"
                      :key="'cell_' + objIndex"
                      class="caption-normal size-cell"
                    >
                      {{ cell.convertable ? convertMetrics(row[i]) : row[i] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="not-available" v-else>
              <h3 class="font-header">
                Not available, contact us for more information
              </h3>
              <fdk-link link="/contact-us" target="_blank">
                <button class="contact-us btn-primary font-body">
                  CONTACT US
                </button>
              </fdk-link>
            </div>
          </div>

          <div class="right-container" v-if="activeTab === 'measure'">
            <div
              class="sizeguide_image"
              v-if="
                product_meta &&
                product_meta.size_chart &&
                product_meta.size_chart.image
              "
            >
              <emerge-image
                :src="product_meta.size_chart.image"
                :alt="product_meta.size_chart.title"
                :sources="[{ width: 500 }]"
                :aspectRatio="0.8"
                :mobileAspectRatio="0.8"
                :global_config="global_config"
              />
            </div>
            <div class="not-available" v-else>
              <h3 class="font-header">
                Not available, contact us for more information
              </h3>
              <fdk-link link="/contact-us" target="_blank">
                <button class="contact-us btn-primary font-body">
                  CONTACT US
                </button>
              </fdk-link>
            </div>
          </div>
        </div>
      </div>
      <!-- </modal> -->
    </transition>
    <div class="overlay" :class="{ show: isOpen }" @click.stop="closeDialog">
      &nbsp;
    </div>
  </div>
</template>

<style lang="less" scoped>
.size-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 540px;
  height: 100%;
  z-index: 101;
  background: @DialogBackground;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media @tablet {
    width: 100%;
  }

  .sidebar-header {
    background-color: #efe7d6;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;

    .close-icon {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }

  .size-tabs {
    width: 100%;
    display: flex;
    background-color: @ThemeAccentL3;

    .active {
      color: @ButtonPrimary !important;
      border-bottom: 1px solid @ButtonPrimary;
    }

    .tab {
      padding: 0.75rem 0;
      cursor: pointer;
      color: @TextLabel;

      &__size_guide {
        margin-left: 1.5rem;

        @media @tablet {
          margin-left: 1rem;
        }
      }

      &__measure {
        margin-left: 1.5rem;
      }
    }
  }

  .sidebar-body {
    height: 100%;
    position: relative;
  }

  .right-container {
    padding: 0 24px;

    @media @tablet {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .sizeguide_image {
      @media @tablet {
        width: 100%;
      }
    }
  }
}

.size-desc {
  /deep/ .inline-html {
    p {
      font-size: 14px;
      line-height: 20px;
      color: @TextHeading;
    }
  }
}

.size-info {
  overflow-y: auto;
  overflow-x: auto;
  margin: 24px 0;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: #ffffff;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
    background-color: #ffffff;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    border-radius: 2.5px;
    background-color: #6b6b6b;
  }

  @media @tablet {
    max-height: max-content;
    overflow-x: auto;
  }
  @media @mobile {
    max-height: max-content;
    overflow-x: auto;
  }
}

.size-table {
  width: 100%;
  padding: 20px;
  border: 1px solid @DividerStokes;

  .size-header {
    border: 1px solid @DividerStokes;
    margin: 5px;
    text-transform: capitalize;
    padding: 1rem 0px;
    vertical-align: middle;
  }

  .size-row {
    .size-cell {
      padding: 1rem 0px;
      text-align: center;
      border: 1px solid @DividerStokes;
      min-width: 100px;
      vertical-align: middle;

      @media @mobile {
        min-width: 58px;
      }
    }
  }
}
//button css
.btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btn-container {
    display: flex;
    height: fit-content;
    border: 1px solid @DividerStokes;
    border-radius: 4px;
    .column-gap(3px);
    padding: 4px 8px;
  }
}
.unit-btn {
  padding: 2px 7px;
  border-radius: 4px;
  cursor: pointer;
  color: @ButtonPrimary;
  background: none;
  border: none;

  &__selected {
    background-color: @ButtonPrimary;
    color: @ButtonSecondary;
  }
}

.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(20, 19, 14, 0.6);
  opacity: 0;
  transition: all 0.4s;
  z-index: 100;
  visibility: hidden;
}

.show {
  opacity: 0.5;
  visibility: visible;
}

.contact-us {
  margin: 24px 40px 0;
  width: calc(100% - 80px);
  padding: 16px 0;
  border-radius: 4px;
}

.not-available {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  width: 100%;

  @media @mobile-up {
    max-width: 415px;
  }

  &--label {
    font-size: 24px;
    line-height: 32px;
  }
}

.left-container {
  padding: 1.5rem 1rem;
}
</style>

<script>
import SvgWrapper from "../components/common/svg-wrapper.vue";
import EmergeImage from "../global/components/common/emerge-image.vue";

export default {
  name: "size-guide",
  components: {
    "svg-wrapper": SvgWrapper,
    "emerge-image": EmergeImage,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    product_meta: {
      type: Object,
    },
    global_config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mounted() {
    if (this.product_meta?.size_chart?.unit) {
      this.previewSelectedMetric = this.product_meta.size_chart.unit;
      this.selectedMetric = this.product_meta.size_chart.unit;
    }
  },
  watch: {
    product_meta(newValue) {
      if (newValue?.size_chart?.unit) {
        this.previewSelectedMetric = newValue.size_chart.unit;
        this.selectedMetric = newValue.size_chart.unit;
      }
    },
  },
  methods: {
    closeDialog() {
      document.querySelector("body").style.overflow = "auto";
      this.$emit("closedialog");
    },
    changeSelectedMetric(val) {
      this.previewSelectedMetric = val;
      if (this.selectedMetric === this.previewSelectedMetric) {
        this.touched = false;
      } else {
        this.touched = true;
      }
    },
    convertMetrics(val) {
      if (this.previewSelectedMetric == "cm" && this.touched) {
        let finalVal = "";
        val = val.split("-");
        for (let i = 0; i < val.length; i++) {
          if (i != 0 && i < val.length) {
            finalVal += "-";
          }
          if (!isNaN(Number(val[i]))) {
            finalVal += (Number(val[i]) * 2.54).toFixed(1); //inches to cm
          } else {
            finalVal += val[i];
          }
        }
        return finalVal;
      }
      if (this.previewSelectedMetric == "in" && this.touched) {
        let finalVal = "";
        val = val.split("-");
        for (let i = 0; i < val.length; i++) {
          if (i != 0 && i < val.length) {
            finalVal += "-";
          }
          if (!isNaN(Number(val[i]))) {
            finalVal += (Number(val[i]) / 2.54).toFixed(1); //cm to inches
          } else {
            finalVal += val[i];
          }
        }
        return finalVal;
      }
      return val;
    },
  },
  data() {
    return {
      values: {
        inch: "in",
        cm: "cm",
      },
      previewSelectedMetric: "cm",
      selectedMetric: "cm",
      touched: false,
      activeTab: "size_guide",
    };
  },
  computed: {
    isSizeChartAvailable() {
      const sizeChartHeader = this.product_meta?.size_chart?.headers || {};

      return Object.keys(sizeChartHeader).length;
    },
  },
};
</script>
