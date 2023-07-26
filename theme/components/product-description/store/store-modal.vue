<template>
  <div>
    <transition name="slide-left">
      <div class="sidebar-container font-body" v-if="isOpen">
        <div class="sidebar-header">
          <h3 class="product-name font-header">{{ productName }}</h3>
          <svg-wrapper
            :svg_src="'sidebar-close'"
            class="close-icon"
            @click.native="closeDialog"
          ></svg-wrapper>
        </div>

        <div class="sidebar-body">
          <template v-if="isDataLoading">
            <fdk-loader class="loader-ws"></fdk-loader>
          </template>
          <template v-else>
            <div class="sort-wrapper" v-click-outside="closeSortDropdown">
              <button
                class="sort-button flex-align-center justify-between font-body"
                @click="showSortDropdown = !showSortDropdown"
              >
                <p class="b1 selected-option" :title="activeSortOption">
                  {{ activeSortOption }}
                </p>
                <svg-wrapper
                  :svg_src="'arrow-down'"
                  :class="[
                    'dropdown-arrow',
                    { 'rotate-arrow': showSortDropdown },
                  ]"
                />
              </button>
              <ul class="sort-dropdown" v-show="showSortDropdown">
                <li
                  v-for="(opt, index) in all_stores_info.sort_on"
                  :key="index"
                  @click="selectionChange(opt.value)"
                  :class="[
                    'b1',
                    {
                      selected_option: opt.is_selected,
                    },
                  ]"
                >
                  {{ opt.name }}
                </li>
              </ul>
            </div>

            <h5
              v-if="
                all_stores_info &&
                all_stores_info.items &&
                all_stores_info.items.length
              "
              class="store-counts"
            >
              Available in
              {{
                `${all_stores_info.items.length} store${
                  all_stores_info.items.length > 1 ? "s" : ""
                }`
              }}
            </h5>

            <fdk-infinite-scrolling
              @loadmore="loadMoreData(sellerData)"
              :loadingData="loading"
            >
              <div class="data">
                <store
                  v-for="item in all_stores_info.items"
                  :key="item.store_name"
                  :storeitem="item"
                  :activeStoreInfo="activeStoreInfo"
                  v-on:select-store-item="storeSelected"
                ></store>
              </div>
            </fdk-infinite-scrolling>
          </template>
        </div>
      </div>
    </transition>
    <div
      class="overlay"
      :class="{ show: isOpen }"
      @click.stop="closeDialog"
      v-if="isOpen"
    >
      &nbsp;
    </div>
  </div>
</template>

<style lang="less" scoped>
@iconWidth: 14px;
@productNameMargin: 16px;

.data {
  max-height: 400px;
  min-height: 300px;
  overflow: auto;
  margin-top: 24px;

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
    background-color: #f8f8f8;
  }
  &::-webkit-scrollbar {
    width: 5px;
    background-color: #ffffff;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #f8f8f8;
  }
  @media @mobile {
    max-height: calc(100vh - 180px);
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

.sidebar-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 37.5%;
  height: 100%;
  z-index: 101;
  background: @DialogBackground;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.2);
  overflow-y: auto;

  @media @tablet {
    width: 100%;
  }

  .sidebar-header {
    background-color: #efe7d6;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .product-name {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-right: @productNameMargin;
      width: calc(100% - (@iconWidth + @productNameMargin));
    }

    .close-icon {
      width: @iconWidth;
      height: 14px;
      cursor: pointer;

      /deep/ svg path {
        fill: @TextHeading;
      }
    }
  }

  .sidebar-body {
    padding: 32px 24px;

    @media @mobile {
      padding: 32px 16px;
    }
  }
}

.custom-select {
  padding: 18px 22px 18px 16px;
  width: 100%;
  height: unset;
  border-radius: 4px;
}

.store-counts {
  margin-top: 48px;
}

.sort-wrapper {
  position: relative;

  .sort-button {
    padding: 16px;
    border: 1px solid #d4d1d1;
    border-radius: 4px;
    background-color: @White;
    width: 100%;
    height: 100%;

    .selected-option {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: calc(100% - 24px);
      text-align: left;
    }

    .dropdown-arrow {
      height: 24px;
      width: 24px;
    }

    .rotate-arrow {
      transform: rotate(180deg);
    }
  }
  .sort-dropdown {
    position: absolute;
    background-color: @DialogBackground;
    width: 100%;
    top: calc(100% + 5px);
    border: 1px solid #d4d1d1;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15),
      0px 12px 16px rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    padding: 0.5rem;
    z-index: 1;

    li {
      padding: 8px 12px;

      cursor: pointer;

      &:hover {
        background-color: @ThemeAccentL3;
      }
    }

    .selected_option {
      background-color: @ThemeAccentL3;
    }
  }
}
</style>

<script>
import store from "./store-item.vue";
import SvgWrapper from "../../common/svg-wrapper.vue";

export default {
  name: "store-modal",
  components: {
    store: store,
    "svg-wrapper": SvgWrapper,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    sellerData: {},
    activeStoreInfo: {},
    productName: String,
    all_stores_info: {},
  },
  data() {
    return {
      inProgress: false,
      showSortDropdown: false,
    };
  },
  computed: {
    isDataLoading() {
      return this.all_stores_info === null;
    },
    activeSortOption() {
      const selectedItems =
        this.all_stores_info?.sort_on?.find((option) => option.is_selected) ||
        {};
      return selectedItems?.name || "";
    },
  },
  methods: {
    closeSortDropdown() {
      this.showSortDropdown = false;
    },
    loadMoreData(sellerData) {
      if (this.all_stores_info.page.has_next) {
        this.loading = true;
        sellerData.loadMoreStores().then(() => {
          this.loading = false;
        });
      }
    },
    closeDialog() {
      this.$emit("closedialog");
      this.closeSortDropdown();
    },
    selectionChange(selected) {
      this.$emit("store-filter", selected);
      this.closeSortDropdown();
    },
    storeSelected(activeStoreInfo) {
      this.$emit("store-item-select", activeStoreInfo);
    },
  },
};
</script>
