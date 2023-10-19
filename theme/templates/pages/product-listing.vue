<template>
  <div class="plp-wrapper" ref="plpWrapper" :style="dynamicStyle">
    <!-- <PlpSkeleton v-if="showShimmer" /> -->
    <fdk-loader
      class="loader-ws"
      v-if="context.loading && (!context.items || context.items.length === 0)"
    ></fdk-loader>
    <div
      v-else-if="
        !context.loading &&
        (!context.items || context.items.length === 0) &&
        !showShimmer
      "
    >
      <fdk-empty-state
        :title="'Sorry, we couldn’t find any results'"
      ></fdk-empty-state>
    </div>
    <div
      v-else-if="context.page_error && context.page_error.statusCode === 500"
    >
      <fdk-empty-state :title="'Something went wrong'"></fdk-empty-state>
    </div>
    <template v-else-if="context && context.items">
      <div class="breadcrumbs br-desktop caption-normal font-body">
        <span><fdk-link :link="'/'">Home</fdk-link>&nbsp; / &nbsp;</span>
        <span class="active">Products</span>
      </div>
      <div
        class="mobile__header flex-align-center justify-between"
        :class="{ active: showMobileHeader }"
      >
        <div class="mobile__header--left flex-align-center">
          <div
            class="filter flex-align-center font-body"
            @click="viewModal($event, 'filter')"
            v-if="context?.filters.length !== 0"
          >
            <svg-wrapper
              class="icon filter-icon"
              :svg_src="'filter'"
            ></svg-wrapper>
            <span class="label b1">Filter</span>
          </div>
          <div
            class="sort flex-align-center font-body"
            @click="viewModal($event, 'sort')"
          >
            <svg-wrapper class="icon sort-icon" :svg_src="'sort'"></svg-wrapper>
            <span class="label b1">Sort By</span>
          </div>
        </div>
        <div class="mobile__header--right flex-align-center">
          <span
            class="col-icon mobile"
            :class="{ active: mobileGrid === 'mob-grid-1' }"
            @click="mobileGrid = 'mob-grid-1'"
          >
            <svg-wrapper :svg_src="'mob-1col'"></svg-wrapper>
          </span>
          <span
            class="col-icon mobile"
            :class="{ active: mobileGrid === 'mob-grid-2' }"
            @click="mobileGrid = 'mob-grid-2'"
          >
            <svg-wrapper :svg_src="'mob-2col'"></svg-wrapper>
          </span>
          <span
            class="col-icon tablet"
            :class="{ active: tabletGrid === 'tablet-grid-2' }"
            @click="tabletGrid = 'tablet-grid-2'"
          >
            <svg-wrapper :svg_src="'desktop-2col'"></svg-wrapper>
          </span>
          <span
            class="col-icon tablet"
            :class="{ active: tabletGrid === 'tablet-grid-3' }"
            @click="tabletGrid = 'tablet-grid-3'"
          >
            <svg-wrapper :svg_src="'desktop-4col'"></svg-wrapper>
          </span>
        </div>
      </div>

      <div class="content-wrapper">
        <sticky-column class="left" v-if="context?.filters.length !== 0">
          <div class="filter-header flex-align-center justify-between">
            <h4 class="filter-header__title font-body">FILTERS</h4>
            <button
              class="filter-header__reset-btn btn-link font-body"
              @click="resetFilters"
            >
              RESET
            </button>
          </div>
          <FilterItem
            v-for="(filter, idx) in context.filters"
            :key="idx + '-desktop' + filter.key.display"
            :filter="filter"
          />
        </sticky-column>
        <div class="right">
          <div class="right__header flex-align-center justify-between">
            <div class="right__header--left">
              <h1 class="title h4 font-body" v-if="getSearchQuery">
                {{ getSearchQuery }}
              </h1>
              <span
                class="b1 product-total-count font-body"
                v-if="getPageConfigValue(page_config, 'product_number')"
              >
                {{ getProductCount }}
              </span>
            </div>
            <div class="right__header--right flex-align-center">
              <sort-dd
                class="sort-by"
                :filteredsorts="context.sort_on"
                :updateSelection="updateSelection"
              />
              <span
                class="col-icon"
                :class="{ active: desktopGrid === 'desktop-grid-2' }"
                @click="desktopGrid = 'desktop-grid-2'"
              >
                <svg-wrapper :svg_src="'desktop-2col'"></svg-wrapper>
              </span>
              <span
                class="col-icon"
                :class="{ active: desktopGrid === 'desktop-grid-4' }"
                @click="desktopGrid = 'desktop-grid-4'"
              >
                <svg-wrapper :svg_src="'desktop-4col'"></svg-wrapper>
              </span>
            </div>
          </div>
          <fdk-products class="plp-container" v-if="isLoadingOptionPagination">
            <div
              :class="[
                'product-container',
                desktopGrid,
                tabletGrid,
                mobileGrid,
              ]"
            >
              <div
                v-for="(product, index) in getProducts"
                :key="index + '-product.uid'"
              >
                <fdk-link
                  class="product-wrapper"
                  :link="product.url"
                  :target="hrefTarget"
                  @click.native="redirectToProduct($event, product.url)"
                >
                  <fy-product-card
                    :class="[
                      `${desktopGrid}-card`,
                      `${tabletGrid}-card`,
                      `${mobileGrid}-card`,
                    ]"
                    :product="product"
                    :context="context"
                    :active-product-id="active_product_uid"
                    :global_config="global_config"
                    :page_config="page_config"
                    :listing_price_config="listingPriceConfig"
                    showWishlist
                    @slide-up="slideUpEventListener($event)"
                    @slide-down="slideDownEventListener($event)"
                  ></fy-product-card>
                </fdk-link>
              </div>
            </div>
            <div class="pagination-wrapper flex-center">
              <pagination :value="getPaginationValue" />
            </div>
          </fdk-products>
          <fdk-infinite-loading
            class="plp-container"
            :handleinfinite="isLoadingOptionViewMore"
            v-else
          >
            <template slot-scope="infiniteLoaderData">
              <div
                :class="[
                  'product-container',
                  desktopGrid,
                  tabletGrid,
                  mobileGrid,
                ]"
              >
                <div
                  v-for="(product, index) in getProducts"
                  :key="index + '-product.uid'"
                >
                  <fdk-link
                    class="product-wrapper"
                    :link="product.url"
                    :target="hrefTarget"
                    @click.native="redirectToProduct($event, product.url)"
                  >
                    <fy-product-card
                      :class="[
                        `${desktopGrid}-card`,
                        `${tabletGrid}-card`,
                        `${mobileGrid}-card`,
                      ]"
                      :product="product"
                      :context="context"
                      :active-product-id="active_product_uid"
                      :global_config="global_config"
                      :page_config="page_config"
                      :listing_price_config="listingPriceConfig"
                      showWishlist
                      @slide-up="slideUpEventListener($event)"
                      @slide-down="slideDownEventListener($event)"
                    ></fy-product-card>
                  </fdk-link>
                </div>
              </div>
              <InfiniteLoader
                v-if="infiniteLoaderData.hasNext && !isLoadingOptionViewMore"
              ></InfiniteLoader>
              <div class="view-more-btn-wrapper flex-center">
                <button
                  class="btn-secondary view-more-btn font-body"
                  v-if="infiniteLoaderData.has_next && isLoadingOptionViewMore"
                  @click="infiniteLoaderData.loadmore"
                  tabindex="0"
                >
                  View More
                </button>
              </div>
            </template>
          </fdk-infinite-loading>
          <div class="breadcrumbs br-mobile caption-normal font-body">
            <span><fdk-link :link="'/'">Home</fdk-link>&nbsp; / &nbsp;</span>
            <span class="active">Products</span>
          </div>
          <div
            class="plp__desc"
            v-if="getPageConfigValue(page_config, 'description')"
          >
            <div class="plp__desc--content caption-normal font-body">
              {{
                isDescCollapsed
                  ? `${getPageConfigValue(page_config, "description").substring(
                      0,
                      600
                    )}...`
                  : getPageConfigValue(page_config, "description")
              }}
            </div>
            <button
              class="btn-secondary plp__desc--read-more font-body"
              v-if="getPageConfigValue(page_config, 'description').length > 600"
              @click="isDescCollapsed = !isDescCollapsed"
            >
              <template v-if="isDescCollapsed">READ MORE</template>
              <template v-else>READ LESS</template>
            </button>
          </div>
        </div>
      </div>

      <transition name="slide-up">
        <div class="sort__modal" v-if="showSortByModal">
          <div class="sort__modal--header flex-align-center justify-between">
            <h4 class="label font-body">Sort by</h4>
            <div v-on:click="closeModal($event, 'sort')">
              <svg-wrapper class="close-icon" :svg_src="'close'"></svg-wrapper>
            </div>
          </div>
          <div class="sort__modal--content">
            <ul class="sort-list">
              <li
                v-for="(sortitem, index) in context.sort_on"
                :key="index + '-sort'"
                @click="selectedSort = sortitem"
              >
                <div
                  :link="sortitem.url"
                  class="sort-item flex-align-center font-body"
                  :class="[sortitem.url]"
                >
                  <svg-wrapper
                    class="radio-icon selected"
                    v-if="selectedSort.value === sortitem.value"
                    :svg_src="'radio-selected'"
                  ></svg-wrapper>
                  <svg-wrapper
                    v-else
                    class="radio-icon"
                    :svg_src="'radio'"
                  ></svg-wrapper>
                  {{ sortitem.display }}
                </div>
              </li>
            </ul>
          </div>
          <div class="sort__modal--footer">
            <button
              class="actionBtn btn-secondary font-body"
              @click="
                resetSort();
                closeModal($event, 'sort');
              "
            >
              Reset
            </button>
            <button
              class="actionBtn btn-primary font-body"
              @click="
                updateSelection(selectedSort.value);
                closeModal($event, 'sort');
              "
            >
              Apply
            </button>
          </div>
        </div>
      </transition>
      <transition name="slide-up">
        <fdk-filter-modal class="filter__modal" v-if="showFilterModal">
          <template slot-scope="filterModalData">
            <div
              class="filter__modal--header flex-align-center justify-between"
            >
              <h4 class="label font-body">Filter</h4>
              <span
                class="close-icon"
                @click="
                  closeModal($event, 'filter');
                  filterModalData.closeModal();
                "
              >
                <svg-wrapper :svg_src="'close'"></svg-wrapper>
              </span>
            </div>
            <div class="filter__modal--content">
              <div class="pane leftPane">
                <ul>
                  <li
                    class="filter-title"
                    v-for="(filteritem, idx) in filterModalData.filters"
                    :key="idx + '-mobile'"
                    @click="filterModalData.updateSelectedItem(filteritem, idx)"
                    :class="{
                      active: filterModalData.selected_item == idx,
                    }"
                  >
                    <h5 class="modal-text font-body">
                      {{ filteritem.key.display }}
                    </h5>
                  </li>
                </ul>
              </div>
              <div class="pane rightPane">
                <div
                  class="filter-disp"
                  v-if="filterModalData.filters[filterModalData.selected_item]"
                >
                  <FilterList
                    :filter="
                      filterModalData.filters[filterModalData.selected_item]
                    "
                    isMobileView
                    :key="filterModalData.selected_item"
                    :reset="resetSlider"
                    @updateFilter="
                      filterModalData.updateFilter(
                        $event,
                        filterModalData.selected_item
                      )
                    "
                    @slider-query="
                      filterModalData.updateSliderInfo(
                        $event,
                        filterModalData.filters[filterModalData.selected_item]
                      )
                    "
                  />
                </div>
              </div>
            </div>
            <div class="filter__modal--footer">
              <button
                class="actionBtn btn-secondary font-body"
                @click="
                  filterModalData.resetFilters();
                  resetSlider = !resetSlider;
                  filterModalData.applyFilters();
                  showFilterModal = false;
                "
              >
                Reset
              </button>
              <button
                class="actionBtn btn-primary font-body"
                @click="
                  filterModalData.applyFilters();
                  closeModal($event, 'filter');
                "
              >
                Apply
              </button>
            </div>
          </template>
        </fdk-filter-modal>
      </transition>
      <button
        class="back-top"
        v-if="getPageConfigValue(page_config, 'back_top') && isToTopActive"
        @click="scrollToTop()"
      >
        <svg-wrapper class="arrow-top-icon" :svg_src="'back-top'"></svg-wrapper>
        <span class="text caption-normal font-body">Back to top</span>
      </button>
    </template>
  </div>
</template>
<settings>
{
  "props": [
    {
      "type": "checkbox",
      "id": "product_number",
      "label": "Show product numbers",
      "default": true
    },
    {
      "id": "loading_options",
      "type": "select",
      "options": [
        {
          "value": "view_more",
          "text": "View More"
        },
        {
          "value": "infinite",
          "text": "Infinite Loading"
        },
        {
          "value": "pagination",
          "text": "Pagination"
        }
      ],
      "default": "infinite",
      "label": "Loading Options"
    },
    {
      "type": "checkbox",
      "id": "back_top",
      "label": "Show back to top button",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "in_new_tab",
      "label": "Open product in new tab",
      "default": true,
      "info": "Open product in new tab for desktop"
    },
    {
      "type": "checkbox",
      "id": "hide_brand",
      "label": "Hide Brand Name",
      "default": false,
      "info": "Check to hide Brand name"
    },
    {
      "id": "grid_desktop",
      "type": "select",
      "options": [
        {
          "value": "desktop-grid-4",
          "text": "4 Cards"
        },
        {
          "value": "desktop-grid-2",
          "text": "2 Cards"
        }
      ],
      "default": "desktop-grid-4",
      "label": "Default grid layout desktop"
    },
    {
      "id": "grid_tablet",
      "type": "select",
      "options": [
        {
          "value": "tablet-grid-3",
          "text": "3 Cards"
        },
        {
          "value": "tablet-grid-2",
          "text": "2 Cards"
        }
      ],
      "default": "tablet-grid-3",
      "label": "Default grid layout tablet"
    },
    {
      "id": "grid_mob",
      "type": "select",
      "options": [
        {
          "value": "mob-grid-2",
          "text": "2 Cards"
        },
        {
          "value": "mob-grid-1",
          "text": "1 Card"
        }
      ],
      "default": "mob-grid-1",
      "label": "Default grid layout mobile"
    },
    {
      "id": "description",
      "type": "textarea",
      "default": "",
      "label": "Description"
    },
    {
      "type": "extension",
      "id": "extension",
      "label": "Extension Positions",
      "info": "Handle extension in these positions",
      "positions": [
        {
          "value": "bottom_left_corner",
          "text": "Bottom left corner of image"
        }
      ],
      "default": {}
    }
  ]
}
</settings>

<script>
import {
  getPageConfigValue,
  detectMobileWidth,
  throttle,
  debounce,
} from "../../helper/utils";
import fyproductcard from "./../../global/components/fy-product-card.vue";
import { isBrowser } from "browser-or-node";
import sortDD from "./../../global/components/plp/sort-dd.vue";
import pagination from "../../global/components/plp/pagination.vue";
import stickyColumn from "../../global/components/plp/sticky-column.vue";
import SvgWrapper from "./../../components/common/svg-wrapper.vue";
import FilterItem from "../../global/components/fy-filter-item.vue";
import FilterList from "../../global/components/fy-filter-list.vue";
import InfiniteLoader from "../../global/components/infinite-loader.vue";

export default {
  name: "fdk-plp",
  components: {
    "fy-product-card": fyproductcard,
    "sort-dd": sortDD,
    "svg-wrapper": SvgWrapper,
    "sticky-column": stickyColumn,
    pagination,
    FilterItem,
    FilterList,
    InfiniteLoader,
  },
  props: {
    context: {},
  },

  watch: {
    active_product_uid: function () {
      this.context.item.map((item) => {
        if (item.uid === this.active_product_uid) {
          item.is_active = true;
        } else {
          item.is_active = false;
        }
      });
    },
    showFilterModal(newValue) {
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
  data() {
    return {
      topPosition: 0,
      active_product_uid: 0,
      showFilterModal: false,
      showSortByModal: false,
      resetSlider: false,
      products: [
        {
          isImageLoading: true,
        },
      ],
      isMobile: false,
      isDescCollapsed:
        getPageConfigValue(this.page_config, "description").length > 600,
      showMobileHeader: true,
      scrollY: 0,
      showShimmer: true,
      selectedSort: {},
      desktopGrid:
        getPageConfigValue(this.page_config, "grid_desktop") ||
        "desktop-grid-2",
      tabletGrid:
        getPageConfigValue(this.page_config, "grid_tablet") || "tablet-grid-3",
      mobileGrid:
        getPageConfigValue(this.page_config, "grid_mob") || "mob-grid-1",
    };
  },
  created() {
    if (isBrowser) window.addEventListener("scroll", this.handleScroll);
    if (isBrowser) {
      Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.onload = img.onerror = resolve;
              })
          )
      ).then(() => {
        this.showShimmer = false;
      });
    }
  },
  destroyed() {
    if (isBrowser) window.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {
    this.isMobile = detectMobileWidth();
    if (this.isMobile && isBrowser) {
      window.scrollTo({
        top: 0.5,
        left: 0,
        behavior: "smooth",
      });
      this.scrollToTop();
    }
    setTimeout(() => {
      this.topPosition =
        window.scrollY + this.$refs.plpWrapper.getBoundingClientRect().top;
    }, 1200);
  },
  methods: {
    getPageConfigValue,
    redirectToProduct(event, productUrl) {
      if (this.isLoadedInIframe()) {
        event.preventDefault();
        this.$router.push(productUrl);
        return;
      }
    },
    slideUpEventListener(id) {
      this.active_product_uid = id;
    },
    slideDownEventListener() {
      this.active_product_uid = 0;
    },
    resetFilters() {
      this.$router.push({ query: {} });
    },
    updateSelectedOptions(item, modalUpdate) {
      if (this.$refs && this.$refs.mobileActionContainer) {
        modalUpdate(item, item.filterIndex);
      }
      if (item.url) {
        this.$router.push(item.url);
      } else {
        this.getRangeURL(item);
      }
    },
    getRangeURL(item) {
      let key = this.context.filters[item.filterIndex].key.name;
      let q = { ...this.$route.query };
      if (Object.keys(q).includes(key)) {
        delete q[key];
      }
      this.$router.push({ ...this.$route, query: q });
    },
    updateSelection: function updateSelection(val) {
      const sortItemIndex = this.context.sort_on.findIndex(
        (item) => item.value === val
      );
      this.$router.push(this.context.sort_on[sortItemIndex].url);
    },
    closeModal: function closeModal(event, type) {
      if (type === "sort") {
        this.showSortByModal = false;
      } else if (type === "filter") {
        this.showFilterModal = false;
      }
    },
    viewModal(event, type) {
      if (type === "sort") {
        this.selectedSort = this.getSelectedSort;
        this.showSortByModal = true;
      } else if (type === "filter") {
        this.showFilterModal = true;
      }
    },
    isLoadedInIframe() {
      if (isBrowser && window.location !== window.parent.location) {
        return true;
      } else {
        return false;
      }
    },
    handleScroll: throttle(function () {
      const windowScrollY = isBrowser ? window.scrollY : 0;
      this.topPosition =
        window.scrollY + this.$refs.plpWrapper.getBoundingClientRect().top;
      this.scrollY = windowScrollY;
      if (window.innerWidth < 1024) {
        this.showMobileHeader = false;
        this.debounceScroll();
      }
    }, 400),
    debounceScroll: debounce(function () {
      this.showMobileHeader = true;
    }, 450),
    scrollToTop() {
      if (isBrowser) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    },
    resetSort() {
      let q = { ...this.$route.query };
      if (Object.keys(q).includes("sort_on")) {
        delete q["sort_on"];
      }
      this.$router.push({ ...this.$route, query: q });
    },
  },
  computed: {
    dynamicStyle() {
      return {
        "--topPosition": this.topPosition ? `${this.topPosition}px` : "",
      };
    },
    getSearchQuery() {
      const searchQuery = this.$route?.query?.q;
      return searchQuery ? `Results for "${searchQuery}"` : false;
    },
    getProductCount() {
      if (this.context?.product_count === 1) {
        return `${this.context?.product_count} item`;
      }
      return `${this.context?.product_count} items`;
    },
    getProducts: function getProducts() {
      return this.context.items.map((item) => {
        item.is_active = false;
        this.showShimmer = false;
        return item;
      });
    },
    hrefTarget() {
      return getPageConfigValue(this.page_config, "in_new_tab") &&
        !this.isMobile
        ? "_blank"
        : "_self";
    },
    listingPriceConfig() {
      return this.context.app_features?.feature?.common?.listing_price?.value;
    },
    isToTopActive() {
      return this.scrollY > 200;
    },
    getSelectedSort() {
      return this.context.sort_on.find((sortItem) => sortItem.is_selected);
    },
    isLoadingOptionPagination() {
      return (
        getPageConfigValue(this.page_config, "loading_options") === "pagination"
      );
    },
    isLoadingOptionViewMore() {
      return (
        getPageConfigValue(this.page_config, "loading_options") === "view_more"
      );
    },
    getPaginationValue() {
      return {
        ...this.context.page,
        current: this.context?.page?.current || 1,
        total:
          this.context?.page?.total ||
          Math.ceil(this.context?.page?.item_total / 12),
      };
    },
  },
};
</script>

<style lang="less" scoped>
@lg-min: 1024px;

.plp-wrapper {
  position: relative;
  padding-bottom: 80px;

  .breadcrumbs {
    span {
      color: @TextDisabled;

      &.active {
        color: @ButtonPrimary;
      }
    }

    &.br-desktop {
      padding: 16px 40px 24px;

      @media @tablet {
        display: none;
      }
    }

    &.br-mobile {
      text-align: center;
      margin-top: 24px;
      padding: 0 32px;

      @media @desktop {
        display: none;
      }
    }
  }

  .mobile__header {
    padding: 13px 16px;
    box-shadow: 0px 4px 8px 0px #a6a3a524;
    margin-bottom: 24px;
    background-color: #fff;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    position: fixed;
    transition: top 0.25s ease-in-out;

    &.active {
      top: var(--topPosition, var(--headerHeight));
    }

    @media @desktop {
      display: none;
    }

    &--left {
      .filter,
      .sort {
        color: @TextHeading;
        cursor: pointer;

        .icon {
          fill: @TextHeading;
          margin-right: 4px;
          width: 16px;
          height: 16px;
        }
      }

      .filter {
        padding-right: 16px;
        border-right: 1px solid @DividerStokes;
        margin-right: 16px;
      }
    }

    &--right {
      .col-icon {
        fill: @TextHeading;
      }
    }
  }

  .col-icon {
    padding: 4px;
    border: 1px solid transparent;
    border-radius: 2px;
    cursor: pointer;
    &:not(:last-child) {
      margin-right: 8px;
    }
    &.active {
      border-color: @DividerStokes;
    }
    & > .inline-svg {
      width: 16px;
      height: 16px;
      @media @mobile-up {
        width: 18px;
        height: 18px;
      }
    }
    &.tablet {
      @media @mobile {
        display: none;
      }
    }
    &.mobile {
      @media @mobile-up {
        display: none;
      }
    }
  }

  .content-wrapper {
    padding: 78px 16px 0;
    isolation: isolate;
    @media @tablet-strict {
      padding: 78px 40px 0;
    }

    @media @desktop {
      display: flex;
      padding: 0 40px;
    }

    .left {
      flex: 0 0 259px;
      margin-right: 16px;
      z-index: 1;
      @media @tablet {
        display: none;
      }
      .filter-header {
        padding-bottom: 16px;
        border-bottom: 1px solid @DividerStokes;
        margin-bottom: 8px;
        &__title {
          .h4(mobile);
        }
      }

      .filter {
        &:not(:last-child) {
          border-bottom: 1px solid @DividerStokes;
          margin-bottom: 20px;
        }
      }
    }

    .right {
      flex-grow: 1;

      &__header {
        padding: 0 4px;
        margin-bottom: 24px;

        @media @desktop {
          padding: 0 8px;
        }

        &--left {
          display: flex;
          align-items: baseline;
          .column-gap(4px);

          @media @desktop {
            .column-gap(8px);
          }

          .title {
            .text-line-clamp();
          }

          .product-total-count {
            white-space: nowrap;
          }
        }

        &--right {
          .sort-by {
            margin-right: 14px;
          }

          .col-icon {
            fill: @TextHeading;
          }

          @media @tablet {
            display: none;
          }
        }
      }

      .plp-container {
        /deep/.list-items {
          background: none;
        }
      }

      .product-container {
        display: grid;
        grid-auto-rows: auto;
        grid-template-rows: 1fr;
        .grid-gap(16px);

        &.mob-grid-1 {
          grid-template-columns: 1fr;
        }

        &.mob-grid-2 {
          grid-template-columns: repeat(2, 1fr);
        }

        @media @mobile-up {
          &.tablet-grid-2 {
            grid-template-columns: repeat(2, 1fr);
          }

          &.tablet-grid-3 {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media @desktop {
          &.desktop-grid-2 {
            grid-template-columns: repeat(2, 1fr);
          }

          &.desktop-grid-4 {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      }

      .view-more-btn-wrapper,
      .pagination-wrapper {
        margin-top: 24px;

        .view-more-btn {
          background: transparent;
          padding: 12px 32px;

          &:hover {
            background-color: @ButtonPrimary;
          }
        }
      }
    }
  }

  .plp__desc {
    background: @ThemeAccentL2;
    border: 1px solid @DividerStokes;
    border-radius: 12px;
    padding: 16px;
    margin-top: 24px;

    @media @desktop {
      margin-top: 36px;
    }

    &--content {
      color: @TextBody;
    }

    &--read-more {
      padding: 12px;
      background: transparent;
      margin-top: 16px;

      @media @desktop {
        &:hover {
          background-color: @ButtonPrimary;
        }
      }
    }
  }

  .sort__modal,
  .filter__modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 100;
    background-color: @DialogBackground;

    &--content {
      flex-grow: 1;
    }

    &--footer {
      padding: 14px 16px;
      display: flex;
      .column-gap(16px);

      .actionBtn {
        flex: 1;
        padding: 15px 28px;
        font-size: 12px;
        font-weight: 500;
        line-height: 14px;
      }
    }
  }

  .sort__modal {
    &--header {
      padding: 16px;
      border-bottom: 1px solid @DividerStokes;

      .close-icon {
        fill: @TextHeading;
        cursor: pointer;
        width: 24px;
        height: 24px;
      }
    }

    &--content {
      padding: 8px;
      overflow-y: auto;

      .sort-list {
        & > li:not(:last-child) {
          margin-bottom: 8px;
        }

        .sort-item {
          font-size: 12px;
          line-height: 14px;
          color: @TextHeading;

          .radio-icon {
            width: 28px;
            height: 28px;
            padding: 4px;
            margin-right: 8px;

            &.selected {
              color: @ButtonPrimary;
            }
          }
        }
      }
    }
  }

  .filter__modal {
    &--header {
      padding: 16px;
      border-bottom: 1px solid @DividerStokes;

      .close-icon {
        fill: @TextHeading;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
    }

    &--content {
      overflow: hidden;
      display: flex;

      .leftPane {
        flex: 0 0 122px;
        overflow-y: auto;
        border-right: 1px solid @DividerStokes;

        .filter-title {
          padding: 14px 16px;
          border-bottom: 1px solid @DividerStokes;

          &.active {
            border-right: 2px solid @ButtonPrimary;
          }
        }
      }

      .rightPane {
        flex-grow: 1;
        overflow-y: auto;
        padding: 8px;
      }
    }
  }

  .back-top {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    color: @ThemeAccentD2;
    box-shadow: 0px 8px 8px -4px rgba(0, 0, 0, 0.6),
      0px 4px 6px -4px rgba(0, 0, 0, 0.12);
    background-color: @DialogBackground;
    border-radius: 24px;
    transition: top 0.25s ease-in-out;
    border: none;
    position: fixed;
    top: calc(var(--topPosition, var(--headerHeight)) + 69px);
    right: 50%;
    transform: translateX(50%);

    & > .arrow-top-icon {
      fill: currentColor;
      width: 8px;
      height: 11px;
    }

    @media @desktop {
      justify-content: center;
      top: unset;
      right: 40px;
      bottom: 40px;
      width: 40px;
      height: 40px;

      & > .text {
        display: none;
      }

      & > .arrow-top-icon {
        width: 10px;
        height: 14px;
      }
    }
  }
}
</style>
