<template>
  <div class="product-variants" v-if="variants && variants.length > 0">
    <div
      v-for="(item, type) in variants"
      :key="item.header + type"
      class="variant-wrapper"
    >
      <template v-if="item.key === 'is_set'">
        <template v-for="(variant, index) in item.items">
          <template v-if="isProductSet !== variant.value">
            <div class="help light-xxs" :key="variant.slug + index">
              Interested in {{ getVariantSetText }}?
              <fdk-link class="ukt-links" :link="getProductLink(variant)">
                Pick {{ getVariantSetText }}
              </fdk-link>
            </div>
          </template>
        </template>
      </template>
      <template v-else>
        <div
          v-if="getSelectedVariantLabel(item)"
          class="caption-normal variant-title"
        >
          {{ getSelectedVariantLabel(item) }}
        </div>
        <div v-if="item.display_type === 'image'">
          <div class="variant-container">
            <div
              v-for="(variant, index) in item.items"
              :key="variant.slug + index"
              class="variant-item-image"
              :class="{
                selected: isVariantSelected(variant),
                unavailable: !variant.is_available,
              }"
            >
              <fdk-link :link="getProductLink(variant)">
                <emerge-image
                  :src="getImageURL(variant)"
                  :sources="[{ width: 52 }]"
                  :alt="variant.name"
                  :global_config="global_config"
                />
              </fdk-link>
              <div
                :class="
                  isVariantSelected(variant) ? 'selected-overlay' : 'overlay'
                "
              />
              <svg-wrapper
                class="selected-icon"
                :svg_src="'check'"
              ></svg-wrapper>
            </div>
          </div>
        </div>
        <div v-else-if="item.display_type === 'color'">
          <div class="variant-container">
            <div
              v-for="(variant, index) in item.items"
              :key="variant.slug + index"
              class="variant-item-color"
            >
              <fdk-link
                :link="getProductLink(variant)"
                :title="variant.color_name"
              >
                <div
                  :style="{
                    background: '#' + variant.color,
                  }"
                  class="color"
                  :class="{
                    selected: isVariantSelected(variant),
                    unavailable: !variant.is_available,
                  }"
                >
                  <div
                    :class="
                      isVariantSelected(variant)
                        ? 'selected-overlay'
                        : 'overlay'
                    "
                  >
                    <span></span>
                  </div>
                  <svg-wrapper
                    class="selected-icon"
                    :svg_src="'check'"
                  ></svg-wrapper>
                </div>
              </fdk-link>
            </div>
          </div>
        </div>
        <div v-else-if="item.display_type === 'text'">
          <div class="variant-container">
            <div
              v-for="(variant, index) in item.items"
              :key="variant.slug + index"
              class="variant-item-text b2"
              :class="{
                selected: isVariantSelected(variant),
                unavailable: !variant.is_available,
              }"
            >
              <fdk-link :link="getProductLink(variant)">
                <div>{{ variant.value }}</div>
              </fdk-link>
              <span></span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.variant-title {
  color: @TextLabel;
}

.variant-wrapper {
  margin-top: 24px;
}

.variant-container {
  display: flex;
  align-items: center;
  .grid-gap(6px, 8px);
  flex-wrap: wrap;
  margin-top: 6px;
  &::-webkit-scrollbar {
    display: none;
  }
  .variant-item-image,
  .variant-item-color .color {
    width: 48px;
    height: 48px;
    border-radius: 4px;
    position: relative;
    overflow: hidden;

    @media @desktop {
      width: 56px;
      height: 56px;
    }

    &:not(.selected) {
      .overlay,
      .selected-icon {
        display: none;
      }
    }
    &:is(.unavailable) {
      .overlay {
        display: block;
        background: rgba(255, 255, 255, 0.7);
      }
    }
    &:hover {
      .overlay {
        display: block;
      }
    }
    .overlay {
      background: rgba(255, 255, 255, 0.4);
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      pointer-events: none;
    }
    .selected-overlay {
      display: none;
    }
    .selected-icon {
      height: 24px;
      width: 24px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      fill: @ButtonSecondary;
    }
  }
  .variant-item-image {
    display: inline-block;
    cursor: pointer;
  }
  .variant-item-color {
    .color {
      width: 40px;
      height: 40px;
      border: 1px solid @DividerStokes;

      &.unavailable .overlay > span {
        position: absolute;
        height: 80px;
        width: 80px;
        bottom: 0;
        border-left: 1px solid @ButtonSecondary;
        transform: rotate(45deg);
        transform-origin: bottom left;
      }
    }
  }
  .variant-item-text {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid @DividerStokes;
    padding: 4px 12px;
    color: @TextHeading;
    cursor: pointer;
    position: relative;
    &:not(.unavailable):hover {
      background-color: @ThemeAccentL2;
    }
    &.selected {
      background-color: @ThemeAccent;
    }
    &.unavailable {
      color: @TextDisabled;
      span {
        position: absolute;
        .inset(0);
        background-color: @DividerStokes;
        clip-path: polygon(
          calc(100% + 1px) 0,
          100% 0,
          0 100%,
          0 calc(100% + 1px)
        );
      }
    }
  }
}
</style>

<script>
import emergeImage from "./../../global/components/common/emerge-image.vue";
import SvgWrapper from "../../components/common/svg-wrapper.vue";

export default {
  name: "product-variants",
  components: {
    "emerge-image": emergeImage,
    "svg-wrapper": SvgWrapper,
  },
  props: {
    variants: {
      type: Array,
    },
    product: {},
    global_config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    isProductSet() {
      return this.product.is_set;
    },
    getVariantSetText() {
      return this.isProductSet ? "Size" : "Set";
    },
  },
  methods: {
    getProductLink(item) {
      return "/product/" + item.slug;
    },
    getImageURL(item) {
      if (Array.isArray(item.medias) && item.medias.length > 0) {
        return item.medias[0].url;
      }
      return "";
    },
    isVariantSelected(item) {
      return item?.slug === this.$route?.params?.slug;
    },
    getSelectedVariantLabel(item) {
      const selectedVariant =
        item?.items?.find((variant) => this.isVariantSelected(variant)) || {};
      let selectedValue = "";

      if (["color", "image"].includes(item.display_type)) {
        selectedValue = selectedVariant?.color_name;
      } else {
        selectedValue = selectedVariant?.value;
      }

      return `${item.header ? item.header + ": " : ""}${
        selectedValue ? selectedValue + " (selected)" : ""
      }`;
    },
  },
};
</script>
