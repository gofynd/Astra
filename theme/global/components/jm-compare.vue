<template>
  <div class="compare-page font-body">
    <!--Search Container-->
    <transition mode="out-in" name="fade">
      <div class="add-search-container" v-if="showPopup" key="search">
        <div>
          <fdk-compare-search
            ref="compare-search"
            class="search-box"
            :pageSize="15"
            :filter="{ l3_categories: firstCategory }"
          >
            <template slot-scope="searchData">
              <div class="search-block">
                <div class="search-header">
                  <div class="add-search-title">Search Here</div>
                  <div
                    v-if="!checkIfEmptyCompareData"
                    class="cross-btn"
                    @click.stop="hideMenu"
                  >
                    <svg-wrapper :svg_src="'close'"></svg-wrapper>
                  </div>
                </div>
                <div class="search-container">
                  <input
                    class="input-box"
                    type="text"
                    v-model="searchtext"
                    @keydown.enter.prevent
                    @keyup.enter="searchData.executeQuery(searchtext)"
                    @input="(evt) => handleSearch(searchData, evt)"
                    placeholder="Search Product here"
                  />
                  <svg-wrapper
                    :svg_src="'search-black'"
                    class="search-icon"
                  ></svg-wrapper>
                </div>
              </div>
              <div class="popularhdng">Add to compare</div>
              <div class="notFound-block" v-if="searchData.noResults">
                <div class="notFound h5">No Product Found</div>
              </div>

              <div
                class="landingBestsellerHandest"
                :class="{ 'search-results': showPopup }"
                v-if="searchData.suggestions.length > 0"
              >
                <div
                  class="whiteSmallRBox"
                  v-for="(data, index) in getSearchFilteredData(
                    searchData.suggestions
                  )"
                  :key="index"
                >
                  <fdk-compare-action class="add-to-compare-button">
                    <template slot-scope="compare">
                      <div
                        class="media"
                        @click="
                          addCompareProducts(compare.addCompare, data.slug);
                          clearSearch(searchData, data.slug);
                        "
                      >
                        <div class="media-left">
                          <emerge-image
                            class="fill"
                            :src="data.media.url"
                            :sources="[{ width: 55 }]"
                          />
                        </div>
                        <div class="media-left-name">{{ data.name }}</div>
                      </div>
                    </template>
                  </fdk-compare-action>
                </div>
              </div>
            </template>
          </fdk-compare-search>
        </div>
      </div>

      <!--Compared Products-->
      <div class="compare-container" v-if="!showPopup" key="products">
        <!-- Product List -->
        <div class="product-list slider" ref="productContainerBig">
          <div class="empty-state-cont">
            <div
              class="add-phone-button"
              v-if="
                compared_products?.data?.items?.length < 4 ||
                compare_slugs.length === 0
              "
              @click="showAddPhone()"
            >
              <svg-wrapper :svg_src="'compare_arrows'" />
              <div>Add Products To Compare</div>
            </div>
            <!-- <p class="bullet">OR</p> -->
          </div>
          <template v-if="compared_products?.data?.items?.length > 0">
            <div
              v-for="(item, index) in compared_products.data.items"
              :key="index"
              class="product"
            >
              <div class="product-cont">
                <div class="product-image-wrap">
                  <fdk-compare-action class="cross-btn">
                    <template slot-scope="compareAction">
                      <div v-on:click="handleRemove(compareAction, item.slug)">
                        <svg-wrapper :svg_src="'close'"></svg-wrapper>
                      </div>
                    </template>
                  </fdk-compare-action>
                  <emerge-image
                    @click.stop="getProductLink(item)"
                    :src="item.medias.length > 0 ? item.medias[0].url : ''"
                    :sources="[{ width: 200 }]"
                  />
                </div>
                <div
                  class="product-name"
                  :title="item.name"
                  @click.stop="getProductLink(item)"
                >
                  {{ item.name }}
                </div>
                <div class="price-effective">
                  {{ getPrice(item.price.effective) }}
                </div>
                <div
                  class="price-marked"
                  :style="{
                    visibility:
                      item.price.effective.min != item.price.marked.min
                        ? 'visibile'
                        : 'hidden',
                  }"
                >
                  <span class="mrp-text">
                    M.R.P
                    <span
                      :style="
                        global_config
                          ? `text-decoration: line-through;color:var(--textlabel)`
                          : 'text-decoration: line-through;'
                      "
                      >{{ getPrice(item.price.marked) }}</span
                    >
                  </span>
                  <!-- <span class="save-text">
                  Save:
                  <span>{{ getPriceDifference(item.price) }}</span>
                </span> -->
                </div>
                <fdk-cart class="cart-wrapper">
                  <template slot-scope="cart">
                    <button
                      class="button btn-secondary flex-center add-to-cart font-body"
                      @click="addProductForCheckout(cart, false)"
                      v-if="
                        !getGlobalConfigValue('disable_cart') &&
                        context?.product_meta?.sellable
                      "
                    >
                      <svg-wrapper :svg_src="'cart'" class="cart-icon" />
                      ADD TO CART
                    </button>
                  </template>
                </fdk-cart>
              </div>
            </div>
          </template>
        </div>

        <!-- Attribute List -->
        <div class="attribute-list">
          <div
            class="attribute"
            v-if="compared_products?.data?.items?.length > 0"
          >
            <div
              v-for="(attributes_metadata, id) in compared_products?.data
                ?.attributes_metadata"
              :key="id"
            >
              <!-- JC: hiding title <div class="attr-title">{{ attributes_metadata.title }}</div> -->
              <div
                v-for="(attribute, aid) in attributes_metadata.details"
                :key="'cl' + id + aid"
                class="attr-list-wrap"
              >
                <div
                  class="attr-name align-attribute"
                  :class="{ differ: isDifferent(attribute) }"
                >
                  {{ attribute.display }}
                </div>
                <div class="attr-desc slider">
                  <!-- @touchmove="swipeHandler($event, 'attrDesc')"
                @touchstart="startTouch($event, 'attrDesc')" -->
                  <div
                    v-for="(cProduct, id) in compared_products.data.items"
                    :key="'cp' + id"
                    class="attr-desc-name align-attribute"
                  >
                    <img :src="attribute.logo" alt />
                    <span
                      class="attr"
                      v-if="checkHtml(getAttribute(cProduct, attribute))"
                      style="text-align: left"
                      v-html="getAttribute(cProduct, attribute)"
                    ></span>
                    <span class="attr" v-else>
                      {{ getAttribute(cProduct, attribute) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--Error Message-->
      <div
        class="error-message attr"
        v-if="compared_products?.data?.items?.length >= 4"
      >
        *You can only add four products at a time
      </div>
    </transition>
    <toast :id="'toast-message'" :content="toast_message"></toast>
  </div>
</template>

<script>
import { checkHtml } from "./../../helper/utils";
import { getGlobalConfigValue } from "./../../helper/utils";
import toast from "../../components/common/toast.vue";
import emergeImage from "../../global/components/common/emerge-image.vue";
import SvgWrapper from "./../../components/common/svg-wrapper.vue";

import BreadCrumb from "../../components/product-description/breadcrumb.vue";
export default {
  components: {
    toast,
    "emerge-image": emergeImage,
    "svg-wrapper": SvgWrapper,
    "bread-crumb": BreadCrumb,
  },
  data: function data() {
    return {
      toast_message: "",
      is_difference_checked: false,
      showPopup: false,
      searchtext: "",
      dragging: false,
      scrollLeft: null,
      startX: null,
    };
  },
  props: {
    compared_products: {
      type: Object,
      default() {
        return {};
      },
    },
    compare_slugs: {
      type: Array,
      default() {
        return [];
      },
    },
    addProductForCheckout: {
      type: Function,
    },
    context: {},
    global_config: {
      type: Object,
    },
  },

  methods: {
    checkHtml,
    getGlobalConfigValue(id) {
      return getGlobalConfigValue(this.global_config, id);
    },
    addCompareProducts(promiseFn, product_slug) {
      this.showPopup = false;
      window.scrollTo(0, 0);
      if (this.compare_slugs.length < 4) {
        promiseFn(product_slug)
          .then((res) => {})
          .catch((err) => {
            //show error
            this.showToast(err.message || "Something went wrong");
          });
      } else {
        //show popup max upto 3
        this.showToast("You can only compare 4 products at a time");
      }
    },
    handleRemove(compareAction, slug) {
      compareAction.removeCompare(slug);
      this.$refs["compare-search"]?.fetchSuggestions();
    },
    handleSearch(searchData, evt) {
      this.searchtext = evt.target.value;
      searchData.fetchSuggestions({ search: this.searchtext, pageSize: 15 });
    },
    showToast: function showToast(message) {
      if (message) {
        this.toast_message = message;
      }
      var x = document.getElementById("toast-message");
      x.className = "toast show";
      setTimeout(function () {
        x.className = x.className.replace("toast show", "toast hide");
      }, 3000);
    },
    getSearchFilteredData: function getSearchFilteredData(item) {
      var array = [];
      var filteredArray = [];
      array = item.filter((res) => {
        const index = this.compare_slugs.findIndex((slug) => res.slug === slug);
        if (index === -1) {
          return res;
        }
      });
      filteredArray = array;
      return filteredArray;
    },
    isAlreadyInCompare: function isAlreadyInCompare(uid) {
      const found = this.compare_slugs.findIndex(
        (compare_slugs) => compare_slugs === uid
      );
      if (found === -1) return true;
      return false;
    },
    clearSearch(searchData, slug) {
      this.searchtext = "";
      this.selected = "";
      this.showPopup = false;
      let filterData = this.getFilterData(searchData, slug);
      this.$refs["compare-search"]?.fetchSuggestions({ filter: filterData });
      window.scrollTo(0, 0);
    },
    getFilterData(searchData, slug) {
      if (searchData.suggestions) {
        for (let i = 0; i < searchData.suggestions.length; i++) {
          if (searchData.suggestions[i].slug === slug) {
            return { l3_categories: searchData.suggestions[i].category_id };
          }
        }
      }
      return {};
    },
    showAddPhone: function showAddPhone() {
      this.showPopup = true;
      window.scrollTo(0, 0);
    },
    hideMenu(event) {
      event.stopPropagation();
      this.showPopup = false;
      this.searchtext = "";
    },
    differenceClicked: function differenceClicked() {
      this.is_difference_checked = !this.is_difference_checked;
    },
    getProductLink: function getProductLink(item) {
      this.$router.push("/product/" + item.slug);
    },
    isDifferent(id) {
      let temp = [];
      this.compared_products.data.items.forEach((p) => {
        temp.push(p.attributes[id.key]);
      });
      var res = temp.every((v) => v === temp[0]);
      return !res && this.is_difference_checked;
    },
    getAttribute: function (item, attribute) {
      let value = item.attributes[attribute.key];
      if (!value) {
        return "---";
      } else if (Array.isArray(value)) {
        value = value.join(", ");
      }
      return value;
    },
    getPriceDifference(price) {
      return this.$options.filters.currencyformat(
        price.marked.max - price.effective.max
      );
    },
    getPrice(price) {
      if (price.min === price.max) {
        return this.$options.filters.currencyformat(price.min.toFixed(2));
      }
      return (
        this.$options.filters.currencyformat(price.min.toFixed(2)) +
        " - " +
        this.$options.filters.currencyformat(price.max.toFixed(2))
      );
    },
  },
  computed: {
    checkIfEmptyCompareData() {
      return (
        !this.compared_products?.data?.items ||
        (this.compared_products?.data?.items &&
          this.compared_products?.data?.items.length === 0)
      );
    },
    firstCategory() {
      let products = this.compared_products?.data?.items;
      return products?.[0]?.categories?.[0]?.uid;
    },
  },
  watch: {
    $route(to, from) {
      if (
        this.checkIfEmptyCompareData &&
        !(this.$route.query.id && this.$route.query.id.length > 0)
      ) {
        this.showPopup = true;
      } else {
        this.showPopup = false;
      }
    },
  },
  mounted() {
    if (this.checkIfEmptyCompareData) {
      this.showPopup = true;
    }
    let value = 0;
    window.addEventListener("scroll", () => {
      {
        if (
          this.$refs &&
          this.$refs.productContainerSmall &&
          this.$refs.productContainerBig
        ) {
          let productContainerSmall = this.$refs.productContainerSmall;
          let productContainerBig = this.$refs.productContainerBig;
          let YOffset =
            productContainerBig.offsetTop + productContainerBig.offsetHeight;

          value = YOffset === 0 ? value : YOffset;
          if (window.pageYOffset >= value) {
            productContainerSmall.classList.add("sticky");
            productContainerSmall.style.display = "flex";
            productContainerBig.style.visibility = "hidden";
            productContainerSmall.scrollLeft = productContainerBig.scrollLeft;
          } else {
            productContainerSmall.classList.remove("sticky");
            productContainerBig.style.visibility = "visible";
            productContainerSmall.style.display = "none";
          }
        }
      }
    });
    if (
      this.$refs["compare-search"] &&
      this.$refs["compare-search"].suggestions &&
      this.$refs["compare-search"].suggestions.length
    ) {
      this.getSearchFilteredData(this.$refs["compare-search"].suggestions);
    }
  },
};
</script>

<style lang="less" scoped>
.compare-page {
  display: flex;
  padding: 48px 0;
  @media @mobile {
    margin: none;
  }
}

.search-block {
  padding: 24px;
  background-color: @ThemeAccentL4;
}
.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  .add-search-title {
    color: @TextHeading;
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.56px;
    @media @mobile {
      font-size: 16px;
      font-weight: 600;
      letter-spacing: -0.32px;
    }
  }
  .cross-btn {
    top: 10px;
    right: 10px;

    /deep/ .inline-svg {
      width: 16px;
      fill: @TextHeading;
    }
  }
}
.add-search-container {
  position: sticky;
  top: 60px;
  align-self: flex-start;
  width: 100%;
  display: block;
  .search-box {
    .cross-btn {
      top: 10px;
      right: 10px;
      cursor: pointer;
      /deep/ .inline-svg {
        width: 16px;
        height: 16px;
        fill: @TextHeading;
      }
    }
  }
}

.show-phone {
  display: block;
  z-index: 1;
  width: 100%;
}
.compare-container {
  width: 100%;
  overflow-x: auto;
  .product-list {
    display: flex;
    margin-left: auto;
    gap: 2%;
    @media @tablet {
      gap: 16px;
    }
    @media @mobile {
      gap: 8px;
    }
    .product {
      position: relative;
      width: 231px;
      box-sizing: border-box;
      @media @tablet {
        width: 132px;
      }
      @media @mobile {
        width: 140px;
        flex: 0 0 140px;
      }
      .product-cont {
        display: flex;
        flex-direction: column;

        .cross-btn {
          cursor: pointer;
          position: absolute;
          z-index: 1;
          right: 5px;
          top: 5px;

          /deep/ .inline-svg {
            width: 24px;
            height: 24px;
            fill: @TextHeading;
            @media @tablet {
              width: 20px;
              height: 20px;
            }
            @media @mobile {
              width: 11px;
              height: 11px;
            }
          }
        }
        .product-image-wrap {
          /deep/ .fy__img {
            height: 100%;
          }
          /deep/ .image-wrapper {
            border-radius: 24px;
          }
        }

        .product-name {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          line-height: 20px;
          margin-top: 12px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: -0.28px;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          color: @TextBody;
        }
        .price-effective {
          margin: 4px 0 0 0;
          color: @TextHeading;
        }
        .price-marked {
          margin: 4px 0 0 0;
          .mrp-text {
            font-size: 14px;
            color: @TextLabel;
          }
          // .save-text {
          //   font-size: 14px;
          //   color: #079a18;
          //   margin-left: 5px;
          // }
        }
      }
    }
    .empty-state-cont {
      position: relative;
      display: flex;
      align-items: center;
      flex-direction: column;
      text-align: center;
      justify-content: center;
      width: 231px;
      height: auto;
      @media @tablet {
        width: 132px;
      }
      @media @mobile {
        flex: 0 0 140px;
        width: 140px;
      }

      .add-phone-button {
        border-radius: 4px;
        padding: 12px 32px;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
        align-self: stretch;
        border: 0.8px solid @ButtonPrimary;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        @media @tablet {
          padding: 12px 8px;
          display: flex;
          display: -webkit-flex;
          justify-content: center;
          -webkit-justify-content: center;
          align-items: center;
          -webkit-align-items: center;
        }
        & > .inline-svg {
          width: 48px;
          height: 48px;
        }
        img {
          //width: 50px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .attribute-list {
    margin-top: 48px;
    color: @TextHeading;
    @media @tablet {
      margin-top: 16px;
    }
    @media @mobile {
      margin-top: 24px;
    }
    .attribute {
      text-align: center;
      // .attr-title {
      //   font-weight: bold;
      //   padding: 15px 0;
      //   border-bottom: 1px solid #cecece;
      //   width: 75%;
      //   margin-left: auto;
      //   @media @mobile {
      //     width: 100%;
      //   }
    }
    .attr-list-wrap {
      display: flex;
      align-items: center;
      @media @mobile {
        display: flex;
      }
    }
    .attr-name {
      width: 235px;
      line-height: 20px;
      font-weight: 700;
      align-self: stretch;
      background-color: @ThemeAccentL2;
      border-bottom: 1px solid @DividerStokes;
      @media @tablet {
        min-width: 135px;
        width: 135px;
      }
      @media @mobile {
        flex: 0 0 149px;
      }
    }
    .attr-desc {
      display: flex;
      background-color: @ThemeAccentL3;
      align-self: stretch;
      @media @mobile {
        width: 100%;
      }
      .attr-desc-name {
        width: 260px;
        border-bottom: 1px solid var(--dividerStokes, #d4d1d1);
        @media @tablet {
          width: 148px;
        }
        @media screen and (max-width: 1023px) {
          width: 231px;
        }
        @media @mobile {
          background: inherit;
          flex: 0 0 140px;
        }
        span {
          word-wrap: break-word;
          line-height: 20px;
          @media @tablet {
            max-width: 150px;
          }
          @media @mobile {
            max-width: 100px;
          }
        }
        &:last-child {
          border-right: 0;
        }
      }
    }
  }
}

.error-message {
  padding: 16px 0;
  color: @TextBody;
}
.popularhdng {
  font-size: 20px;
  padding: 16px 0;
  font-weight: 700;
  color: var(--text-headings);
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.4px;
  text-transform: capitalize;
}
.notFound-block {
  padding: 8px 8px 16px 8px;
  border-radius: 4px;
  border: 1px solid #d4d1d1;
  background: #fff;
  box-shadow: 0px 8px 24px -4px rgba(78, 63, 9, 0.08),
    0px 4px 4px 0px rgba(78, 63, 9, 0.08);
  @media @tablet {
    padding: 8px;
  }
}
.notFound {
  color: @TextBody;
  line-height: normal;
  padding: 16px;
  background: @ThemeAccentL4;
  @media @tablet {
    padding: 12px;
  }
  @media @mobile {
    padding: 12px 0px;
  }
}
.search-results {
  position: relative;
  height: 400px;
  @media @mobile {
    height: 300px;
  }
  overflow: auto;
}

.landingBestsellerHandest {
  padding: 20px 30px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #d4d1d1;
  box-shadow: 0px 8px 24px -4px rgba(78, 63, 9, 0.08),
    0px 4px 4px 0px rgba(78, 63, 9, 0.08);
  padding: 8px 8px 16px 8px;

  .whiteSmallRBox {
    width: 100%;
    background: @ThemeAccentL4;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 auto;
    padding: 12px 0 12px 10px;
    position: relative;
    margin-top: 12px;
    @media @tablet {
      padding: 0;
    }
  }
  .media {
    margin-top: 15px;
    display: flex;
    align-items: center;
    color: var(--text-body-text, #3c3131);
    /* Desktop/Body/B3 */
    font-size: 16px;
    font-weight: 400;
    line-height: 20px; /* 125% */
    letter-spacing: -0.32px;
    &:first-child {
      margin-top: 0;
    }
    .media-left {
      flex: 0 0 56px;
      height: 56px;
      margin-right: 12px;
      img {
        width: 55px;
      }
    }
    .media-left-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.product-list-small {
  display: none;
  box-shadow: 0px 3px 6px #00000029;
  width: 75%;
  margin-left: auto;
  @media @mobile {
    display: flex;
    width: 100%;
  }

  .empty-state-cont {
    position: relative;
    margin: auto;
    text-align: center;
    min-height: 100px;
    @media @tablet {
      //flex: 0 0 140px;
    }

    img {
      width: 20%;
      @media @tablet {
        display: none;
      }
    }
  }
}

.search-container {
  display: flex;
  align-items: center;
  padding: 14px 12px;
  border-radius: 4px;
  border: 1px solid @HeaderNav;
  background: @ThemeAccentL5;
  .input-box {
    background-color: @ThemeAccentL5;
    width: 100%;
    box-sizing: border-box;
    border: none;
    padding: none;
    color: @HeaderNav;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: -0.28px;
  }
  .search-icon {
    position: relative;
    width: 40px;
    height: 20px;
  }
}

.slide-leave-active,
.slide-enter-active {
  transition: 0.5s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(100%, 0);
}

.attr-name-spacing {
  padding-left: 10px;
}

.sticky {
  position: sticky;
  top: 114px;
  z-index: 1;
  @media @tablet {
    top: 74px;
    width: 75%;
  }
  @media @mobile {
    top: 74px;
    width: 100%;
  }
}

.spacing {
  padding: 20px 10px !important;
}

.attr {
  font-size: 14px;
}

// .differ {
//   background: #f8f8f8;
//   color: #000000 !important;
// }

.compare-container::-webkit-scrollbar {
  display: none;
}

.empty-attr > img {
  width: 20%;
}
.align-attribute {
  min-width: 149px;
  min-height: 53px;
  display: flex;
  align-items: center;
  padding: 16px;
  text-align: left;
}
.d-flex {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  img {
    width: 40px;
  }
  @media @mobile {
    align-items: center;
  }
}
</style>
