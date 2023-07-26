<template>
  <div class="filter__list" :class="{ open: !filter.isOpen }">
    <template v-if="filter.key.kind == 'multivalued'">
      <div class="filter__list--search flex-align-center" v-if="showSearch">
        <input
          v-model="searchText"
          :placeholder="'Search'"
          class="text font-body"
        />
        <svg-wrapper
          class="search-icon"
          :svg_src="'search-filter'"
        ></svg-wrapper>
      </div>
      <div class="filter-items-container">
        <ul class="filter__list--items" id="scroll-bar">
          <li
            class="filter__list--item"
            v-for="(filterItem, index) in getFilteredValues"
            :key="'filter-' + index"
          >
            <div
              class="filter__item flex-align-center caption-normal"
              @click="filterClicked(filterItem)"
            >
              <div>
                <svg-wrapper
                  class="icon checkbox-icon selected"
                  v-if="filterItem.is_selected"
                  :svg_src="'checkbox-selected'"
                ></svg-wrapper>
                <svg-wrapper
                  v-else
                  :svg_src="'checkbox'"
                  class="icon checkbox-icon"
                ></svg-wrapper>
              </div>
              <div
                v-if="filter.key.name === 'primary_color'"
                :class="{
                  'filter__item--color': true,
                  multiIcon: filterItem.value.toLowerCase() === 'none',
                }"
                :style="`background-color: #${filterItem.value}`"
              ></div>
              <div
                class="filter__item--value caption-normal font-body"
                :class="{
                  active: filterItem.is_selected,
                }"
              >
                {{ filterItem.display }}
              </div>
              <div class="filter__item--count caption-normal font-body">
                ({{ filterItem.count || 0 }})
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div
        class="view-more flex-align-center font-body"
        v-if="showViewMore"
        @click="expandFilter()"
      >
        <span class="label">
          <template v-if="isExpanded">View Less</template>
          <template v-else>View More</template>
        </span>
        <svg-wrapper
          class="arrow-icon"
          :class="{ expanded: isExpanded }"
          :svg_src="'arrow-down'"
        >
        </svg-wrapper>
      </div>
    </template>
    <template
      v-else-if="filter.key.kind == 'range' && filter.values.length > 0"
    >
      <fdk-slider>
        <template slot-scope="sliderData">
          <fy-slider-filter
            :filteritem="filter"
            :reset="reset"
            :showSliderText="false"
            showTextBox
            @slider-query="onSliderQuery($event, sliderData)"
          ></fy-slider-filter>
        </template>
      </fdk-slider>
    </template>
    <template
      v-else-if="filter.key.kind == 'singlevalued' && filter.values.length > 0"
    >
      <div class="filter-items-container">
        <div class="filter__list--items">
          <div class="filter__list--item">
            <div
              class="filter__item flex-align-center caption-normal"
              @click="filterClicked(filter.values[0])"
            >
              <div>
                <svg-wrapper
                  class="icon checkbox-icon selected"
                  v-if="filter.values[0].is_selected"
                  :svg_src="'checkbox-selected'"
                ></svg-wrapper>
                <svg-wrapper
                  v-else
                  :svg_src="'checkbox'"
                  class="icon checkbox-icon"
                ></svg-wrapper>
              </div>

              <div
                class="filter__item--value caption-normal font-body"
                :class="{
                  active: filter.values[0].is_selected == true,
                }"
              >
                {{ filter.values[0].display }}
              </div>
              <div class="filter__item--count caption-normal font-body">
                ({{ filter.values[0].count || 0 }})
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <transition name="fade">
      <div class="filter__popup" v-if="showPopup">
        <div class="filter__popup--header flex-align-center">
          <div class="search">
            <input
              v-model="searchText"
              :placeholder="'Search'"
              class="search__input font-body"
            />
          </div>
          <ul class="alphabets">
            <li
              class="font-body"
              v-for="(alphabet, index) in Object.keys(getGroupedValues)"
              :key="'alphabet-' + index"
              :class="{ disabled: getGroupedValues[alphabet].length === 0 }"
            >
              <a :href="'#' + alphabet">
                {{ alphabet }}
              </a>
            </li>
          </ul>
          <span class="close-icon" @click="closePopup()">
            <svg-wrapper :svg_src="'close'"></svg-wrapper>
          </span>
        </div>
        <ul class="filter__popup--content">
          <template v-for="alphabet in Object.keys(getGroupedValues)">
            <li
              :id="alphabet"
              class="alphabet-label font-body"
              :key="alphabet"
              v-if="getGroupedValues[alphabet].length !== 0"
            >
              <h4>{{ alphabet }}</h4>
            </li>
            <li
              class="filter"
              v-for="filterItem in getGroupedValues[alphabet]"
              :key="alphabet + filterItem.value"
            >
              <fdk-link :link="filterItem.url">
                <div class="filter__item flex-align-center caption-normal">
                  <div>
                    <svg-wrapper
                      class="icon checkbox-icon selected"
                      v-if="filterItem.is_selected"
                      :svg_src="'checkbox-selected'"
                    ></svg-wrapper>
                    <svg-wrapper
                      v-else
                      :svg_src="'checkbox'"
                      class="icon checkbox-icon"
                    ></svg-wrapper>
                  </div>
                  <div
                    class="filter__item--value caption-normal font-body"
                    :class="{
                      active: filterItem.is_selected,
                    }"
                  >
                    {{ filterItem.display }}
                  </div>
                  <div class="filter__item--count caption-normal font-body">
                    ({{ filterItem.count || 0 }})
                  </div>
                </div>
              </fdk-link>
            </li>
          </template>
        </ul>
      </div>
    </transition>
    <div
      class="overlay"
      :class="{ show: showPopup }"
      @click.stop="closePopup()"
    ></div>
  </div>
</template>

<script>
import sliderfilter from "../components/fy-slider-filter.vue";
import SvgWrapper from "../../components/common/svg-wrapper.vue";

export default {
  components: {
    "fy-slider-filter": sliderfilter,
    "svg-wrapper": SvgWrapper,
  },
  props: {
    filter: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isMobileView: {
      type: Boolean,
      default: false,
    },
    reset: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchText: "",
      isExpanded: false,
      MAX_ITEM_COUNT: 7,
      showPopup: false,
    };
  },
  computed: {
    getFilteredValues() {
      let filteredItem = this.getFilteredItems(this.searchText);
      if (!this.showViewMore) {
        return filteredItem;
      }
      return this.isExpanded
        ? filteredItem
        : filteredItem.slice(0, this.MAX_ITEM_COUNT);
    },
    getGroupedValues() {
      const groupedFilterValues = {
        "#": [],
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
        I: [],
        J: [],
        K: [],
        L: [],
        M: [],
        N: [],
        O: [],
        P: [],
        Q: [],
        R: [],
        S: [],
        T: [],
        U: [],
        V: [],
        W: [],
        X: [],
        Y: [],
        Z: [],
      };
      this.getFilteredItems(this.searchText).forEach((item) => {
        if (!groupedFilterValues[item.display[0].toUpperCase()]) {
          groupedFilterValues["#"].push(item);
        } else {
          groupedFilterValues[item.display[0].toUpperCase()].push(item);
        }
      });
      return groupedFilterValues;
    },
    showViewMore() {
      return (
        !this.isMobileView && this.filter?.values?.length > this.MAX_ITEM_COUNT
      );
    },
    showSearch() {
      return (
        this.filter?.key?.name === "category" ||
        this.filter?.key?.name === "brand"
      );
    },
  },
  methods: {
    expandFilter() {
      if (
        this.filter?.key?.name === "category" ||
        this.filter?.key?.name === "brand"
      ) {
        this.showPopup = true;
        return;
      }
      this.isExpanded = !this.isExpanded;
    },
    closePopup() {
      this.showPopup = false;
    },
    getFilteredItems(searchText) {
      if (!searchText) {
        return this.filter.values;
      }

      return this.filter.values.filter((item) => {
        return (
          item.display.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        );
      });
    },
    filterClicked(filterItem) {
      if (!this.isMobileView) {
        this.$router.push(filterItem.url);
        return;
      }
      this.$emit("updateFilter", filterItem);
    },
    onSliderQuery(event, sliderData) {
      if (!this.isMobileView) {
        sliderData.replaceQuery(event, this.filter);
        return;
      }
      this.$emit("slider-query", event);
    },
  },
};
</script>

<style lang="less">
.filter__list {
  &--search {
    position: relative;
    margin-bottom: 16px;
    .text {
      font-size: 12px;
      line-height: 14px;
      padding: 15px 15px 15px 44px;
      width: 100%;
      border: 1px solid @DividerStokes;
      background-color: transparent;
    }
    .search-icon {
      width: 18px;
      height: 18px;
      position: absolute;
      left: 12px;
    }
  }
  &--items {
    .filter__item {
      cursor: pointer;
      &:hover .checkbox-icon:not(.selected) {
        stroke: @ButtonPrimary;
      }
      .checkbox-icon {
        width: 26px;
        height: 26px;
        margin-right: 8px;
        stroke: @DividerStokes;
        &.selected {
          fill: @ButtonPrimary;
          stroke: none;
        }
      }
      &--color {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin-right: 8px;
        border: 1px solid @DividerStokes;
      }
      &--value {
        color: @TextBody;
        margin-right: 4px;
      }
      &--count {
        color: @TextDisabled;
      }
    }
  }
  &--item:not(:last-child) {
    margin-bottom: 8px;
  }
  .view-more {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    margin-top: 16px;
    color: @TextBody;
    cursor: pointer;
    .arrow-icon {
      fill: @TextBody;
      width: 20px;
      height: 20px;
      &.expanded {
        transform: scale(1, -1);
      }
    }
  }
  .filter__popup {
    width: 1023px;
    height: calc(100vh - var(--headerHeight) - 40px);
    max-height: 562px;
    border: 1px solid @DividerStokes;
    background-color: @DialogBackground;
    position: fixed;
    top: calc(50% + (var(--headerHeight) / 2));
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 41;
    border-radius: 8px;
    &--header {
      padding: 16px 24px;
      border-bottom: 1px solid @DividerStokes;
      .search {
        &__input {
          border-radius: 4px;
          padding: 16px;
          width: 264px;
          border: 1px solid @DividerStokes;
          margin-right: 32px;
        }
      }
      .alphabets {
        display: flex;
        .column-gap(13px);
        .overflow-ellipsis();
        & > li {
          font-size: 14px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: -0.02em;
          color: @ButtonPrimary;
          &.disabled {
            color: @TextDisabled;
          }
        }
      }
      .close-icon {
        margin-left: auto;
        width: 24px;
        height: 24px;
        fill: @TextHeading;
        cursor: pointer;
      }
    }
    &--content {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      height: calc(100% - 87px);
      padding: 24px 12px;
      overflow-x: auto;
      scroll-behavior: smooth;
      scroll-margin-left: 24px;
      .alphabet-label {
        padding-left: 12px;
        margin-bottom: 11px;
        & > h4 {
          color: @ButtonPrimary;
        }
      }
      .filter {
        padding-left: 12px;
        margin-bottom: 5px;
        &__item {
          font-size: 12px;
          line-height: 14px;
          cursor: pointer;
          &:hover .checkbox-icon:not(.selected) {
            stroke: @ButtonPrimary;
          }
          .checkbox-icon {
            width: 26px;
            height: 26px;
            margin-right: 8px;
            stroke: @DividerStokes;
            &.selected {
              fill: @ButtonPrimary;
            }
          }
          &--value {
            color: @TextBody;
            margin-right: 4px;
          }
          &--count {
            color: @TextDisabled;
          }
        }
      }
      & > * {
        min-width: 310px;
      }
    }
  }
  .overlay {
    display: none;
    position: fixed;
    .inset(0);
    background-color: @Overlay;
    opacity: 0.6;
    z-index: 40;
    &.show {
      display: block;
    }
  }
  .filter__item--color {
    overflow: hidden;
  }
  .multiIcon {
    background: linear-gradient(
      136deg,
      rgba(73, 52, 155, 1) 0%,
      rgba(28, 188, 217, 1) 33%,
      rgba(87, 210, 28, 1) 53%,
      rgba(255, 202, 25, 1) 73%,
      rgba(209, 11, 0, 1) 100%
    );
  }
}
</style>
