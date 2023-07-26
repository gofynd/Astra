<template>
  <div>
    <div class="desc-container-mobile">
      <accordion :is-open="false" v-if="isProductHighlightAvailable">
        <template v-slot:accordion-title>
          <div class="h5">
            {{ productHighlight.title }}
          </div>
        </template>
        <template v-slot:accordion-content>
          <ul
            class="b2 pdp-detail bullet-spacing"
            v-if="
              productHighlight &&
              productHighlight.details &&
              productHighlight.details.length
            "
          >
            <li v-for="(item, index) in productHighlight.details" :key="index">
              {{ item }}
            </li>
          </ul>
          <div v-else class="no-data-placeholder">No Data Found</div>
        </template>
      </accordion>
      <accordion :is-open="false">
        <template v-slot:accordion-title>
          <div class="h5">
            {{ productDescription.title }}
          </div>
        </template>
        <template v-slot:accordion-content>
          <div class="b2 pdp-detail" v-if="productDescription.details">
            <fdk-html-content
              class="product-long-description"
              :content="productDescription.details"
            ></fdk-html-content>
          </div>
          <div v-else class="no-data-placeholder">No Data Found</div>
        </template>
      </accordion>
      <accordion
        :is-open="false"
        v-for="(attribute, index) in getGroupedAttributes"
        :key="index"
      >
        <template v-slot:accordion-title>
          <div class="h5">
            {{ attribute.title }}
          </div>
        </template>
        <template v-slot:accordion-content>
          <ul
            :class="[
              'b2 pdp-detail',
              {
                'bullet-spacing': getPageConfigValue(
                  page_config,
                  'product_details_bullets'
                ),
              },
            ]"
            v-if="attribute?.details?.length"
          >
            <li v-for="(property, val) in attribute.details" :key="val + index">
              <span class="prop">{{ `${property.key} :` }}&nbsp;</span>
              <span class="val" v-html="property.value"></span>
            </li>
          </ul>
          <div v-else class="no-data-placeholder">No Data Found</div>
        </template>
      </accordion>
    </div>

    <div class="desc-container-desktop">
      <div class="tabs-container">
        <h5
          v-if="isProductHighlightAvailable"
          :class="['tabs', { active: activeTab === 0 }]"
          @click="activeTab = 0"
        >
          {{ productHighlight.title }}
        </h5>
        <h5
          :class="['tabs', { active: activeTab === 1 }]"
          @click="activeTab = 1"
        >
          {{ productDescription.title }}
        </h5>
        <h5
          v-for="attribute in getGroupedAttributes"
          :key="attribute.tabId"
          :class="['tabs', { active: activeTab === attribute.tabId }]"
          @click="activeTab = attribute.tabId"
        >
          {{ attribute.title }}
        </h5>
      </div>
      <div class="b2 details">
        <template v-if="activeTab === 0 && isProductHighlightAvailable">
          <ul
            class="items"
            v-if="productHighlight.details && productHighlight.details.length"
          >
            <li v-for="(item, index) in productHighlight.details" :key="index">
              {{ item }}
            </li>
          </ul>
          <div v-else class="no-data-placeholder">No Data Found</div>
        </template>
        <template v-if="activeTab === 1">
          <fdk-html-content
            class="product-long-description"
            v-if="productDescription.details"
            :content="productDescription.details"
          ></fdk-html-content>
          <div v-else class="no-data-placeholder">No Data Found</div>
        </template>
        <template v-if="getActiveGroupedAttribute">
          <ul
            :class="{
              items: getPageConfigValue(page_config, 'product_details_bullets'),
            }"
            :key="getActiveGroupedAttribute.tabId"
            v-if="getActiveGroupedAttribute?.details?.length"
          >
            <li
              v-for="(property, val) in getActiveGroupedAttribute.details"
              :key="val + index"
            >
              <span class="prop">{{ `${property.key} :` }}&nbsp;</span>
              <span class="val" v-html="property.value"></span>
            </li>
          </ul>
          <div v-else class="no-data-placeholder">No Data Found</div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.desc-container-desktop {
  display: none;
  margin: 3rem 0;

  @media @desktop {
    display: block;
  }

  .tabs-container {
    display: flex;

    .tabs {
      padding: 8px 32px;
      color: @TextLabel;
      cursor: pointer;
    }

    .active {
      background-color: @ThemeAccentL2;
      color: @TextHeading;
      border: 1px solid @DividerStokes;
      border-radius: 12px 12px 0 0;
      border-bottom: 1px solid @ThemeAccentL2;
      margin-bottom: -1px;
    }
  }
  .details {
    padding: 24px 32px 24px 16px;
    background: @ThemeAccentL2;
    border: 1px solid @DividerStokes;
    border-radius: 0px 12px 12px 12px;

    .items {
      list-style: outside;
      padding-left: 1rem;
    }
  }
}
.ukt-links {
  font-weight: 500;
}
.return {
  font-size: 14px;
  font-weight: 500;
}
.desc-container-mobile {
  display: none;
  padding: 0 1rem;
  margin: 2rem 0;

  @media @tablet-strict {
    padding: 0 1.5rem;
  }

  @media @tablet {
    display: block;
  }

  .section-text {
    margin: 10px 0px;
  }
}
.pdp-detail {
  display: table;
  width: 100%;
  list-style: outside;
  padding: 14px 0;
}

.bullet-spacing {
  padding-left: 16px;
}

.pdp-table {
  width: 100%;
  position: relative;
  display: inherit;
  table-layout: fixed;
  box-sizing: border-box;

  &:last-child {
    .prop {
      border-bottom: none;
    }
    .val {
      border-bottom: none;
    }
  }
  .prop {
    display: table-cell;
  }
  .val {
    display: table-cell;
    /deep/img {
      width: 100%;
      height: auto;
    }
  }
}
.no-data-placeholder {
  color: gray;
  text-align: center;
  padding: 1rem;
}

.product-long-description {
  & > :first-child {
    margin-top: 0;
  }
  & > :last-child {
    margin-bottom: 0;
  }
}
</style>

<script>
import accordionVue from "../../../global/components/fy-accordion.vue";
import { getPageConfigValue } from "../../../helper/utils";

export default {
  name: "product_desc",
  components: {
    accordion: accordionVue,
  },
  props: {
    product: {
      type: Object,
      default: () => {
        return {};
      },
    },
    page_config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    product() {
      this.activeTab = (this.product?.highlights || []).length ? 0 : 1;
      this.productDescription = {
        ...this.productDescription,
        details: this.product?.description || "",
      };
      this.productHighlight = {
        ...this.productHighlight,
        details: this.product?.highlights || [],
      };
    },
  },

  data() {
    return {
      activeTab: (this.product?.highlights || []).length ? 0 : 1,
      productDescription: {
        details: this.product?.description || "",
        title: "Product Description",
      },
      productHighlight: {
        details: this.product?.highlights || [],
        title: "Product Highlights",
      },
    };
  },
  mounted() {},
  computed: {
    isProductHighlightAvailable() {
      return this.productHighlight?.details?.length;
    },
    getGroupedAttributes() {
      let counter = 1;
      return this.product?.grouped_attributes.map((item) => {
        counter++;
        return {
          ...item,
          tabId: counter,
        };
      });
    },
    getActiveGroupedAttribute() {
      return this.getGroupedAttributes.find(
        (item) => item.tabId === this.activeTab
      );
    },
  },
  methods: {
    getPageConfigValue,
  },
};
</script>
