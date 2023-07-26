<template>
  <div class="main-wrapper">
    <div class="product-container">
      <div class="product-medias">
        <div class="carousel-container">
          <image-skeleton class="carousel-icons" />
          <div class="media-wrapper">
            <image-skeleton
              class="active-media"
              :aspectRatio="0.8"
              :mobileAspectRatio="0.8"
            />
            <image-skeleton class="peek-media" :aspectRatio="0.2465" />
          </div>

          <image-skeleton class="carousel-icons" />
          <div class="bullet-container">
            <image-skeleton
              class="bullet-icons"
              v-for="index in 4"
              :key="index"
            />
          </div>
        </div>

        <div class="thumbnail-container">
          <image-skeleton
            class="thumbnail-items"
            :aspectRatio="0.8"
            v-for="index in 4"
            :key="index"
          />
        </div>
      </div>
      <div class="product-info-container">
        <image-skeleton
          class="placeholder-1"
          :aspectRatio="12.25"
          :mobileAspectRatio="12.25"
        />
        <image-skeleton
          class="placeholder-2"
          :aspectRatio="9.2"
          :mobileAspectRatio="9.2"
        />
        <image-skeleton
          class="placeholder-3"
          :aspectRatio="5.33"
          :mobileAspectRatio="5.33"
        />
        <image-skeleton
          class="placeholder-4"
          :aspectRatio="39.43"
          :mobileAspectRatio="39.43"
        />
        <div class="variant-wrapper">
          <image-skeleton
            class="variant-items"
            v-for="index in 2"
            :key="index"
          />
        </div>
        <div class="button-wrapper">
          <image-skeleton
            class="size-dropdown"
            :aspectRatio="2.55"
            :mobileAspectRatio="2.55"
          />
          <image-skeleton
            class="cart-button"
            :aspectRatio="7.08"
            :mobileAspectRatio="7.08"
          />
        </div>
        <image-skeleton
          class="placeholder-5"
          :aspectRatio="9.86"
          :mobileAspectRatio="9.86"
        />
        <image-skeleton
          class="placeholder-6"
          :aspectRatio="7.46"
          :mobileAspectRatio="7.46"
        />
        <image-skeleton
          class="placeholder-7"
          :aspectRatio="2.7"
          :mobileAspectRatio="2.7"
        />
      </div>
    </div>
    <div class="product-details-container">
      <image-skeleton :aspectRatio="7.4" :mobileAspectRatio="2.56" />
    </div>
    <div class="product-extension-container">
      <image-skeleton :aspectRatio="3" :mobileAspectRatio="0.9" />
    </div>
  </div>
</template>

<script>
import imageSkeleton from "../skeletons/image-skeleton.vue";
export default {
  components: {
    "image-skeleton": imageSkeleton,
  },
};
</script>
<style lang="less" scoped>
/deep/ .card {
  border-radius: 6px;
}

.main-wrapper {
  @media @desktop {
    padding: 0 2.5rem;
    margin-top: 1.5rem;
  }
}

.product-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  @media @desktop {
    flex-direction: row;
  }

  .product-medias {
    width: 100%;

    @media @desktop {
      margin-right: 40px;
      width: 58.18%;
    }

    .carousel-container {
      display: flex;
      align-items: center;

      @media @tablet {
        flex-direction: column;
      }

      .media-wrapper {
        display: flex;
        width: 100%;

        .active-media {
          @media @desktop {
            margin: 0 32px;
          }

          @media @tablet-strict {
            margin-right: 4px;
            width: 76.44%;
          }
        }
        .peek-media {
          width: 23.56%;
          display: none;

          @media @tablet-strict {
            display: block;
          }
        }
      }

      .carousel-icons {
        width: 48px;

        @media @tablet {
          display: none;
        }
      }

      .bullet-container {
        display: flex;
        margin-top: 24px;

        @media @desktop {
          display: none;
        }

        .bullet-icons {
          width: 14px;
          height: 4px;
          border-radius: 25px;
          margin-right: 8px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .thumbnail-container {
      display: flex;
      justify-content: center;
      margin-top: 1rem;

      @media @tablet {
        display: none;
      }

      .thumbnail-items {
        width: 59px;
        margin-right: 8px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .product-info-container {
    width: 100%;

    @media @desktop {
      width: 41.82%;
      box-sizing: border-box;
    }

    @media @tablet-strict {
      padding: 0 24px;
    }

    @media @mobile {
      padding: 0 16px;
    }

    .placeholder-1 {
      width: 71%;

      @media @tablet {
        margin-top: 16px;
      }
    }
    .placeholder-2 {
      margin-top: 6px;
    }
    .placeholder-3 {
      margin-top: 12px;
      width: 26.08%;
    }
    .placeholder-4 {
      margin-top: 24px;
    }
    .placeholder-5 {
      margin-top: 12px;
    }
    .placeholder-6 {
      margin-top: 48px;

      @media @tablet {
        display: none;
      }
    }
    .placeholder-7 {
      margin-top: 24px;

      @media @tablet {
        display: none;
      }
    }
    .variant-wrapper {
      display: flex;
      margin-top: 6px;

      .variant-items {
        width: 56px;

        margin-right: 8px;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .button-wrapper {
      display: flex;
      justify-content: space-between;
      margin-top: 48px;

      @media @tablet {
        margin-top: 32px;
      }

      .size-dropdown {
        width: 25.9%;
      }
      .cart-button {
        width: 71.92%;
      }
    }
  }
}

.product-details-container {
  margin: 3rem 0;

  @media @tablet {
    margin: 2rem 0;
  }

  @media @tablet-strict {
    padding: 0 24px;
  }

  @media @mobile {
    padding: 0 16px;
  }
}

.product-extension-container {
  margin-bottom: 40px;

  @media @tablet-strict {
    padding: 0 24px;
  }

  @media @mobile {
    padding: 0 16px;
  }
}
</style>
