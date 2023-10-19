<template>
  <fdk-infinite-scrolling :loadingData="loading" :style="dynamicStyles">
    <div class="section-between-space">
      <div>
        <h2
          class="section-heading font-header"
          v-if="getSectionPropValue(settings, 'heading')"
        >
          {{ getSectionPropValue(settings, "heading") }}
        </h2>
        <p
          class="section-description b-small font-body"
          v-if="getSectionPropValue(settings, 'description')"
        >
          {{ getSectionPropValue(settings, "description") }}
        </p>
      </div>
      <div
        class="categories-block"
        :class="[`card-${getSectionPropValue(settings, 'per_row')}`]"
        :style="`--per-row:${getSectionPropValue(settings, 'per_row')}`"
        v-if="isMounted && showStackedView"
      >
        <div v-for="(card, index) in getCategories" :key="index">
          <div :data-cardtype="'Categories'" class="pos-relative">
            <fdk-link
              :link="`/products/?category=${card?.slug}&department=${card.action?.page?.query?.department}`"
            >
              <emerge-image
                :src="card?.banners?.portrait?.url"
                :aspectRatio="0.8"
                :mobileAspectRatio="0.8"
                :class="
                  getSectionPropValue(settings, 'img_fill') ? 'streach' : ''
                "
                :sources="[
                  { breakpoint: { min: 769 }, width: 416 },
                  { breakpoint: { max: 768 }, width: 232 },
                  { breakpoint: { max: 480 }, width: 336 },
                ]"
              />
              <div class="flex-justify-center">
                <div
                  class="categories-name h5 font-body inline-block"
                  v-if="card.name && card.name.length > 0"
                  :title="card.name"
                >
                  {{ card.name }}
                </div>
              </div>
            </fdk-link>
          </div>
        </div>
      </div>
      <div
        v-else-if="isMounted && showScrollView"
        class="categories-horizontal"
        :class="[
          `card-${getSectionPropValue(settings, 'per_row')}`,
          `${getCategories.length === 1 ? 'single-card' : ''}`,
        ]"
      >
        <glideCarouselVue
          :glideOptions="glideOptions"
          :showPerPage="true"
          hasArrows
        >
          <glideSlideVue v-for="(card, index) in getCategories" :key="index">
            <div :data-cardtype="'Categories'" class="pos-relative">
              <fdk-link
                :link="`/products/?category=${card.slug}&department=${card.action?.page?.query?.department}`"
              >
                <emerge-image
                  :src="card?.banners?.portrait?.url"
                  :aspectRatio="0.8"
                  :mobileAspectRatio="0.8"
                  :class="
                    getSectionPropValue(settings, 'img_fill') ? 'streach' : ''
                  "
                  :sources="[
                    { breakpoint: { min: 769 }, width: 360 },
                    { breakpoint: { max: 768 }, width: 232 },
                    { breakpoint: { max: 480 }, width: 136 },
                  ]"
                />
                <div class="flex-justify-center">
                  <button
                    class="categories-name h5 font-body inline-block"
                    v-if="card.name && card.name.length > 0"
                    :title="card.name"
                  >
                    {{ card.name }}
                  </button>
                </div>
              </fdk-link>
            </div>
          </glideSlideVue>
        </glideCarouselVue>
      </div>
      <div v-else-if="isDemoBlock" class="defaultBlock card-4">
        <div v-for="index in 4" :key="'CATEGORIES' + index">
          <div :data-cardtype="'Categories'" class="pos-relative">
            <emerge-image
              :src="getPlaceHolder"
              :aspectRatio="0.8"
              :mobileAspectRatio="0.8"
              class="streach"
              :sources="[
                { breakpoint: { min: 769 }, width: 360 },
                { breakpoint: { max: 768 }, width: 232 },
                { breakpoint: { max: 480 }, width: 136 },
              ]"
            />
            <div class="flex-justify-center">
              <button
                class="categories-name h5 font-body inline-block"
                :title="'CATEGORY ' + index"
              >
                {{ "CATEGORY " + index }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex-justify-center gap-above-button"
        v-if="getSectionPropValue(settings, 'button_text')"
      >
        <fdk-link :link="'/categories/'">
          <button
            class="btn-secondary section-button font-body"
            v-if="getSectionPropValue(settings, 'button_text')"
          >
            {{ getSectionPropValue(settings, "button_text") }}
          </button>
        </fdk-link>
      </div>
    </div>
  </fdk-infinite-scrolling>
</template>
<settings>
{
    "name":"categories_listing",
    "label":"Categories Listing",
    "props": [
    {
      "id": "layout_mobile",
      "type": "select",
      "options": [
        {
          "value": "stacked",
          "text": "Stack"
        },
        {
          "value": "horizontal",
          "text": "Horizontal"
        }
      ],
      "default": "horizontal",
      "label": "Mobile Layout",
      "info": "Alignment of content"
    },
    {
      "id": "layout_desktop",
      "type": "select",
      "options": [
        {
          "value": "grid",
          "text": "Stack"
        },
        {
          "value": "horizontal",
          "text": "Horizontal"
        }
      ],
      "default": "horizontal",
      "label": "Desktop Layout",
      "info": "Alignment of content"
    },
    {
      "type":"range",
      "id":"per_row",
      "label":"Display categories per row (desktop)",
      "min":"3",
      "max":"5",
      "step":"1",
      "info":"It'll not work for mobile layout",
      "default":"4"
    },
    {
      "type": "color",
      "id": "img_container_bg",
      "category": "Image Container",
      "default": "#00000000",
      "label": "Container Background Color",
      "info": "This color will be used as the container background color of the Product/Collection/Category/Brand images wherever applicable"
    },
    {
      "type": "checkbox",
      "id": "img_fill",
      "category": "Image Container",
      "default": false,
      "label": "Fit image to the container",
      "info": "If the image aspect ratio is different from the container, the image will be clipped to fit the container. The aspect ratio of the image will be maintained"
    },
    {
      "type": "text",
      "id": "heading",
      "default": "Our Top Categories",
      "label": "Heading",
      "info":"Heading text of the section"
    },
    {
      "type": "textarea",
      "id": "description",
      "default": "Explore your true style",
      "label": "Description",
      "info":"Description text of the section"
    },
    {
      "type": "text",
      "id": "button_text",
      "default": "",
      "label": "Button Text"
    }
  ],
  "blocks": [
    {
      "type": "category",
      "name": "Category Item",
      "props": [
        {
          "type": "department",
          "id": "department",
          "label": "Select Department"
        }
      ]
    }
  ],
  "preset": {
      "blocks": [
        {
          "name": "Category Item"
        },
        {
          "name": "Category Item"
        },
        {
          "name": "Category Item"
        },
         {
          "name": "Category Item"
        }
      ]
    }
}
</settings>
<style lang="less" scoped>
/deep/.glide__arrows {
  @media @tablet {
    display: none;
  }
}
/deep/ .glide__bullets {
  @media @mobile {
    display: none;
  }
}
::v-deep .streach {
  img {
    object-fit: cover !important;
    height: 100% !important;
  }
  picture {
    background-color: var(--bg-color) !important;
  }
}

div[data-cardtype="Categories"] {
  border-radius: @ImageRadius;
  overflow: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black); //safari fix

  cursor: pointer !important;
  ::v-deep img {
    transition: 300ms all cubic-bezier(0, 0, 0.2, 1);
  }
  &:hover {
    ::v-deep img {
      transform: scale(1.1);
    }
  }
}
.gap-above-button {
  margin-top: 24px;
  @media @tablet-strict {
    margin-top: 16px;
  }
  @media @desktop {
    margin-top: 32px;
  }
}
.section-heading {
  text-align: center;
  margin-bottom: 8px;

  @media @tablet-strict {
    margin-bottom: 4px;
  }

  @media @desktop {
    margin-bottom: 16px;
  }
}
.section-description {
  text-align: center;
  padding: 0 40px;
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 24px;
  @media @desktop {
    margin-bottom: 32px;
  }
}
.categories-block {
  padding: 0 16px;
  margin: 0 auto;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, calc((100% - 12px) / 2));
  .grid-gap(12px);
  @media @mobile-up {
    padding: 0 24px;
    grid-template-columns: repeat(auto-fit, calc((100% - 24px) / 3));
  }
  @media @desktop {
    padding: 0 40px;
    .grid-gap(36px,24px);
    grid-template-columns: repeat(
      auto-fit,
      calc((100% - (24px * (var(--per-row) - 1))) / var(--per-row))
    );
  }
}
.categories-horizontal {
  padding: 0 0 0 16px;
  @media @mobile-up {
    padding: 0 24px;
  }
  @media @desktop {
    padding: 0 40px;
  }
  &.single-card {
    padding: 0 16px;
  }
}
.categories-name {
  position: absolute;
  border: 1px solid @DividerStokes;
  background-color: @ThemeAccentL5;
  border-radius: @ButtonRadius;
  padding: 7px 15px;
  text-align: center;
  bottom: 12px;
  left: 12px;
  right: 12px;
  width: calc(100% - 24px);
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  color: @TextBody;
  @media @desktop {
    padding: 14px 15px;
  }
}
.categories-block,
.categories-horizontal,
.defaultBlock {
  @media @desktop {
    &.card-3,
    &.card-4 {
      .categories-name {
        left: 40px;
        right: 40px;
        width: calc(100% - 80px);
      }
    }
  }
}
.categories-block {
  @media @desktop {
    &.card-5 {
      .categories-name {
        left: 45px;
        right: 45px;
        width: calc(100% - 90px);
      }
    }
  }
}
.categories-horizontal {
  @media @mobile {
    .categories-name {
      left: 24px;
      right: 24px;
      width: calc(100% - 48px);
      padding: 15px;
    }
  }
  @media @desktop {
    &.card-5 {
      .categories-name {
        left: unset;
        right: unset;
      }
    }
  }
}
.pos-relative {
  position: relative;
}
.defaultBlock {
  padding: 0 16px;
  margin: 0 auto;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, calc((100% - 12px) / 2));
  .grid-gap(12px);
  @media @mobile-up {
    padding: 0 24px;
    grid-template-columns: repeat(auto-fit, calc((100% - 24px) / 3));
  }
  @media @desktop {
    padding: 0 40px;
    .grid-gap(36px,24px);
    grid-template-columns: repeat(
      auto-fit,
      calc((100% - (24px * (4 - 1))) / 4)
    );
  }
}
.section-button {
  padding: 12px 28px;
  text-transform: uppercase;
  border-radius: @ButtonRadius;
  cursor: pointer;
}
/deep/ .glide--swipeable {
  cursor: auto;
}
</style>
<script>
import { isBrowser } from "browser-or-node";
import emergeImageVue from "../global/components/common/emerge-image.vue";
import glideCarouselVue from "../global/components/glide-carousel.vue";
import glideSlideVue from "../global/components/glide-slide.vue";
import { getSectionPropValue, getGlobalConfigValue } from "../helper/utils";
export default {
  props: ["settings", "apiSDK", "global_config", "serverProps"],
  components: {
    "emerge-image": emergeImageVue,
    glideCarouselVue,
    glideSlideVue,
  },
  data() {
    return {
      isLoading: false,
      categories: this.serverProps || [],
      windowWidth: isBrowser ? window.innerWidth : 0,
      isMounted: false,
      glideOptions: {
        startAt: 0,
        focusAt: 0,
        gap: this.getGapValue(24),
        perView: getSectionPropValue(this.settings, "per_row"),
        swipeThreshold: false,
        dragThreshold: false,
        breakpoints: {
          768: {
            perView: 3,
            gap: this.getGapValue(12),
          },
          480: {
            perView: 1,
            gap: this.getGapValue(12),
            peek: {
              before: 0,
              after: this.getAfterValue(1, 50),
            },
            swipeThreshold: 80,
            dragThreshold: 120,
          },
        },
      },
    };
  },
  initializeServerProps({ settings, apiSDK }) {
    const categories =
      settings?.blocks?.reduce((acc, b) => {
        if (b?.props?.department?.value)
          return [...acc, b?.props?.department?.value];
      }, []) || [];
    if (categories.length !== 0) {
      return Promise.all(
        categories.map((department) => {
          return apiSDK.catalog.getCategories({
            department,
          });
        })
      )
        .then((results) => {
          let category = [];
          results.forEach((result) => {
            result.data?.[0]?.items.forEach((item) => {
              getLastCategory(item);
              function getLastCategory(item) {
                if (item.childs.length !== 0) {
                  item.childs.forEach((child) => {
                    return getLastCategory(child);
                  });
                } else {
                  category = [...category, item];
                }
              }
            });
          });
          return category;
        })
        .catch((e) => console.log(e));
    }
  },
  watch: {
    settings: {
      handler: function (newVal, oldVal) {
        if (
          newVal.props?.layout_mobile?.value !==
            oldVal.props?.layout_mobile?.value ||
          newVal.props?.layout_desktop?.value !==
            oldVal.props?.layout_desktop?.value ||
          this.isBlocksChanged(newVal.blocks, oldVal.blocks)
        ) {
          this.categories = [];
          this.fetchCategories();
        }
      },
      deep: true,
    },
    getCategories: {
      handler() {
        this.glideOptions = {
          startAt: 0,
          focusAt: 0,
          gap: this.getGapValue(24),
          perView: getSectionPropValue(this.settings, "per_row"),
          swipeThreshold: false,
          dragThreshold: false,
          breakpoints: {
            768: {
              perView: 3,
              gap: this.getGapValue(12),
            },
            480: {
              perView: 1,
              gap: this.getGapValue(12),
              peek: {
                before: 0,
                after: this.getAfterValue(1, 50),
              },
              swipeThreshold: 80,
              dragThreshold: 120,
            },
          },
        };
      },
      deep: true,
    },
  },
  methods: {
    isBlocksChanged(newBlocks, oldBlocks) {
      return JSON.stringify(newBlocks) !== JSON.stringify(oldBlocks);
    },
    fetchCategories() {
      const promisesArr = [];
      this.isLoading = true;
      this.settings.blocks.forEach((block) => {
        if (block.props?.department?.value) {
          this.isLoading = true;
          promisesArr.push(
            this.$apiSDK.catalog.getCategories({
              department: block.props.department.value,
            })
          );
        }
      });
      Promise.all(promisesArr).then((responses) => {
        responses.forEach((response) => {
          if (response) {
            response.data?.map((d) => {
              d.items.length
                ? d.items?.map((item) => {
                    this.reRenderItem(item);
                  })
                : "";
            });
          }
        });
        this.isLoading = false;
      });
    },
    reRenderItem(item) {
      if (item.childs.length !== 0) {
        item.childs.map((child) => {
          return this.reRenderItem(child);
        });
      } else {
        this.categories = [...this.categories, item];
      }
    },
    getSectionPropValue,
    onResize() {
      this.windowWidth = isBrowser ? window.innerWidth : 0;
    },
    getAfterValue(perView, value) {
      return this.getCategories?.length > perView ? value : 0;
    },
    getGapValue(gap) {
      return this.getCategories?.length === 1 ? 0 : gap;
    },
  },
  computed: {
    getPlaceHolder() {
      return require("../assets/images/placeholder9x16.png");
    },
    showStackedView() {
      const hasCategories = (this.categories || []).length !== 0;
      if (this.windowWidth <= 768) {
        return (
          hasCategories &&
          this.getSectionPropValue(this.settings, "layout_mobile").includes(
            "stacked"
          )
        );
      }
      return (
        hasCategories &&
        this.getSectionPropValue(this.settings, "layout_desktop").includes(
          "grid"
        )
      );
    },
    showScrollView() {
      const hasCategories = (this.categories || []).length !== 0;
      if (this.windowWidth <= 768) {
        return (
          hasCategories &&
          this.getSectionPropValue(this.settings, "layout_mobile").includes(
            "horizontal"
          )
        );
      } else {
        return (
          hasCategories &&
          this.getSectionPropValue(this.settings, "layout_desktop").includes(
            "horizontal"
          )
        );
      }
    },
    getCategories() {
      let perRowItem = this.getSectionPropValue(this.settings, "per_row");
      if (this.showScrollView) {
        if (this.windowWidth >= 481 && this.windowWidth <= 768) {
          return this.categories?.slice(0, 12);
        } else if (this.windowWidth <= 480) {
          return this.categories?.slice(0, 4);
        } else {
          return this.categories?.slice(0, perRowItem * 4);
        }
      } else {
        if (this.windowWidth >= 481 && this.windowWidth <= 768) {
          return this.categories?.length > 6
            ? this.categories?.slice(0, 6)
            : this.categories;
        } else if (this.windowWidth <= 480) {
          return this.categories?.length > 8
            ? this.categories?.slice(0, 8)
            : this.categories;
        } else {
          return this.categories?.length > perRowItem * 2
            ? this.categories?.slice(0, perRowItem * 2)
            : this.categories;
        }
      }
    },
    dynamicStyles() {
      return {
        padding: "16px 0",
        "margin-bottom": `${getGlobalConfigValue(
          this.global_config,
          "section_margin_bottom"
        )}px`,
        "--bg-color": `${getSectionPropValue(
          this.settings,
          "img_container_bg"
        )}`,
      };
    },
    isDemoBlock() {
      const categories =
        this.settings?.blocks?.reduce((acc, b) => {
          if (b?.props?.department?.value)
            return [...acc, b?.props?.department?.value];
        }, []) || [];
      return categories.length === 0;
    },
  },
  mounted() {
    this.isMounted = true;
    isBrowser && window.addEventListener("resize", this.onResize);
    this.fetchCategories();
  },
  beforeDestroy() {
    isBrowser && window.removeEventListener("resize", this.onResize);
  },
};
</script>
