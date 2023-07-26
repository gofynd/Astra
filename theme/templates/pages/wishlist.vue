<template>
  <div class="wl-cont flex-column">
    <div v-if="context.favourites && context.favourites.loading">
      <fdk-loader></fdk-loader>
    </div>
    <div class="breadcrumbs caption-normal">
      <span><fdk-link :link="'/'">Home</fdk-link>&nbsp; / &nbsp;</span>
      <span class="active">Wishlist</span>
    </div>
    <div class="title__block flex-row">
      <h1 class="title__block--title h4 font-body">Wishlist</h1>
      <span class="title__block--count b1 font-body">
        {{ getProductCount }}
      </span>
    </div>
    <div v-if="getFollowProducts?.length > 0">
      <fdk-infinite-favourites class="products-container">
        <template slot-scope="infiniteLoaderData">
          <transition-group name="fade" tag="div" class="grid-wrapper">
            <div
              class="wishlist-card"
              v-for="product in getFollowProducts"
              :key="`p-wl-${product.uid}`"
            >
              <fdk-link :link="productLink(product)" class="wl-link">
                <fy-product-card
                  class="desktop-grid-4-card tablet-grid-3-card mob-grid-2-card"
                  :showWishlist="true"
                  :isWishListPage="true"
                  :product="product"
                  :global_config="global_config"
                />
              </fdk-link>
            </div>
          </transition-group>
          <InfiniteLoader
            class="loading-animation"
            v-if="infiniteLoaderData.hasNext"
          ></InfiniteLoader>
        </template>
      </fdk-infinite-favourites>
    </div>
    <div class="empty-container flex-center" v-else>
      <div class="empty-state">
        <div class="h2 title">
          You do not have any product added to wishlist
        </div>
        <p class="sub-title b1">Add products to wishilst</p>
        <fdk-link :link="'/'" class="cta-btn btn-secondary inline-block"
          >CONTINUE SHOPPING</fdk-link
        >
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.wl-cont {
  min-height: 700px;
  padding: 10px 16px;

  @media @mobile-up {
    padding: 24px 16px 88px;
  }

  @media @desktop {
    padding: 16px 40px 80px;
  }

  .breadcrumbs {
    margin-bottom: 16px;

    @media @mobile-up {
      margin-bottom: 24px;
    }

    span {
      color: @TextDisabled;

      &.active {
        color: @ButtonPrimary;
      }
    }
  }

  .title__block {
    .column-gap(8px);
    margin-bottom: 10px;
    align-items: baseline;

    @media @mobile-up {
      margin-bottom: 24px;
    }
  }

  .wl-link {
    -webkit-tap-highlight-color: transparent;
  }

  .products-container {
    ::v-deep .list-items {
      background: none;
    }

    .loading-animation {
      margin: 10px auto 0 !important;
    }
  }

  .grid-wrapper {
    display: grid;
    .grid-gap(10px, 16px);
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: auto;

    @media @mobile-up {
      .grid-gap(24px, 16px);
      grid-template-columns: repeat(3, 1fr);
    }

    @media @desktop {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .empty-container {
    background: @ThemeAccentL4;
    flex-grow: 1;

    .empty-state {
      margin: 0 auto;
      max-width: 254px;
      text-align: center;

      @media @mobile-up {
        max-width: 450px;
      }

      .title {
        margin-bottom: 8px;
      }

      .sub-title {
        margin-bottom: 32px;
      }

      .cta-btn {
        border: none;
        min-width: 180px;
        padding: 17px;

        @media @desktop {
          min-width: 220px;
          padding: 20px 24px;
        }
      }
    }
  }
}
</style>
<script>
import InfiniteLoader from "../../global/components/infinite-loader.vue";
import productCard from "./../../global/components/fy-product-card.vue";

export default {
  name: "wishlist",
  components: {
    "fy-product-card": productCard,
    InfiniteLoader,
  },
  computed: {
    getFollowProducts() {
      return (
        this.context?.favourites?.items?.filter((product) => product.follow) ||
        []
      );
    },
    getProductCount() {
      if (this.getFollowProducts.length === 1) {
        return `1 item`;
      }
      return `${this.getFollowProducts.length} items`;
    },
  },
  methods: {
    productLink(product) {
      return `/product/${product.slug}`;
    },
  },
};
</script>
