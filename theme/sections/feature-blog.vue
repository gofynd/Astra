<template>
  <section
    v-if="blogItems.length !== 0"
    class="blog-section"
    :style="dynamicStyles"
  >
    <h2
      class="blog-section__heading font-header pr-16"
      v-if="getSectionPropValue('heading')"
    >
      {{ getSectionPropValue("heading") }}
    </h2>
    <div
      class="blog-section__description b4 font-body pr-16"
      v-if="getSectionPropValue('description')"
    >
      {{ getSectionPropValue("description") }}
    </div>
    <glide-carousel
      class="blog-section__list"
      :class="{ 'pr-16': isSingleBlogItem }"
      :glide-options="getGlideOptions"
      :has-arrows="true"
      :has-bullets="true"
      :show-per-page="true"
      v-if="getBlogItems.length"
    >
      <glide-slide
        class="blog"
        v-for="(blog, index) in getBlogItems"
        :key="index"
      >
        <div class="blog__image">
          <fdk-link
            :link="`/blog/${blog.slug}`"
            :title="blog.title"
            :target="'_blank'"
          >
            <emerge-image
              :aspectRatio="16 / 9"
              :mobileAspectRatio="4 / 3"
              :src="blog?.feature_image?.secure_url"
              :alt="blog.title"
            />
          </fdk-link>
        </div>
        <div class="blog__info">
          <div class="blog__info--title-section">
            <h3 class="blog__info--title font-header">
              <fdk-link
                :link="`/blog/${blog.slug}`"
                :title="blog.title"
                :target="'_blank'"
              >
                {{ blog.title }}
              </fdk-link>
            </h3>
            <div
              class="blog__info--tags flex-align-center font-body"
              v-if="blog?.tags.length > 0"
            >
              <h4>
                {{ getBlogTag(blog) }}
              </h4>
              <h4 v-if="blog?.tags?.[1]">
                {{ blog?.tags?.[1] }}
              </h4>
            </div>
          </div>
          <div class="blog__info--meta b2 font-body flex-align-center">
            <span>{{ blog?.author?.name }}</span>
            <svg-wrapper class="divider" :svg_src="'ellipse'"></svg-wrapper>
            <span>{{ getFormattedDate(blog?.publish_date) }}</span>
          </div>
        </div>
      </glide-slide>
    </glide-carousel>
    <div class="blog-section__cta-wrapper pr-16">
      <fdk-link
        class="blog-section__cta btn-secondary"
        :link="`/blog/`"
        :target="'_blank'"
      >
        View All
      </fdk-link>
    </div>
  </section>
</template>

<settings>
{
  "name": "feature_blog",
  "label": "Feature Blog",
  "props": [
    {
      "type": "text",
      "id": "heading",
      "default": "Feature Blog",
      "label": "Heading",
      "info":"Heading text of the section"
    },
    {
      "type": "textarea",
      "id": "description",
      "default": "Chique is a fast-growing indowestern womenswear brand having several stores pan India. Simple, innovative and progressive,",
      "label": "Description",
      "info":"Description text of the section"
    }
  ]
}
</settings>

<script>
import { isBrowser } from "browser-or-node";
import {
  getGlobalConfigValue,
  getSectionPropValue,
  throttle,
} from "../helper/utils";
import svgWrapper from "../components/common/svg-wrapper.vue";
import emergeImage from "../global/components/common/emerge-image.vue";
import glideCarousel from "../global/components/glide-carousel.vue";
import glideSlide from "../global/components/glide-slide.vue";
export default {
  props: ["settings", "global_config", "serverProps"],
  data() {
    return {
      windowWidth: isBrowser ? window.innerWidth : 0,
      blogItems: this.serverProps || [],
      flag: false,
    };
  },
  components: {
    "glide-carousel": glideCarousel,
    "glide-slide": glideSlide,
    "emerge-image": emergeImage,
    "svg-wrapper": svgWrapper,
  },
  initializeServerProps({ settings, apiSDK }) {
    return apiSDK.content
      .getBlogs({ pageNo: 1, pageSize: 12 })
      .then((data) => {
        return data?.items;
      })
      .catch((e) => console.log(e));
  },
  mounted() {
    isBrowser && window.addEventListener("resize", this.onResize);
    this.fetchData();
  },
  computed: {
    getGlideOptions() {
      return {
        startAt: 0,
        focusAt: 0,
        gap: this.getGapValue(24),
        perView: 3,
        swipeThreshold: false,
        dragThreshold: false,
        breakpoints: {
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
    dynamicStyles() {
      return {
        "margin-bottom": `${getGlobalConfigValue(
          this.global_config,
          "section_margin_bottom"
        )}px`,
      };
    },
    isSingleBlogItem() {
      return this.blogItems.length === 1;
    },
    getBlogItems() {
      if (this.windowWidth < 481) {
        return this.blogItems.slice(0, 4);
      }
      return this.blogItems;
    },
  },
  methods: {
    getSectionPropValue(id) {
      return getSectionPropValue(this.settings, id);
    },
    getGlobalConfigValue(id) {
      return getGlobalConfigValue(this.global_config, id);
    },
    onResize: throttle(function () {
      this.windowWidth = isBrowser ? window.innerWidth : 0;
    }, 300),
    getAfterValue(perView, value) {
      return this.getBlogItems?.length > perView ? value : 0;
    },
    getGapValue(gap) {
      return this.getBlogItems?.length === 1 ? 0 : gap;
    },
    fetchData() {
      this.$apiSDK.content
        .getBlogs({ pageNo: 1, pageSize: 12 })
        .then((data) => {
          this.blogItems = data?.items;
        })
        .catch((e) => console.log(e));
    },
    getBlogTag(blog) {
      return blog?.tags?.length > 1 ? `${blog?.tags?.[0]},` : blog?.tags?.[0];
    },
    getFormattedDate(dateString) {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    },
  },
  beforeDestroy() {
    isBrowser && window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style lang="less" scoped>
.glide {
  ::v-deep {
    .bullet-arrow-container {
      @media @mobile {
        display: none;
      }
      @media @tablet-strict {
        margin-top: 16px;
      }
      .glide__arrows {
        @media @tablet {
          display: none;
        }
      }
    }
  }
}
&.pr-16 {
  @media @mobile {
    padding-right: 16px;
  }
}
.blog-section {
  padding: 0 0 0 16px;
  @media @mobile-up {
    padding: 16px 24px;
  }
  @media @desktop {
    padding: 16px 40px;
  }
  &__heading {
    text-align: center;
    margin-bottom: 8px;
    @media @mobile-up {
      margin-bottom: 16px;
    }
  }
  &__description {
    text-align: center;
    margin: 0 auto;
    max-width: 620px;
  }
  &__list {
    margin-top: 24px;
    @media @mobile-up {
      margin-top: 16px;
    }
    @media @desktop {
      margin-top: 32px;
    }
  }
  &__cta-wrapper {
    text-align: center;
    margin-top: 24px;
    @media @mobile-up {
      display: none;
    }
  }
  &__cta {
    height: 44px;
    padding: 12px 24px;
    display: inline-block;
    text-transform: uppercase;
    border-radius: @ButtonRadius;
  }
}
.blog {
  &__image {
    margin-bottom: 16px;
    @media @desktop {
      margin-bottom: 24px;
    }
    .image-wrapper {
      border-radius: @ImageRadius;
      ::v-deep .fy__img {
        height: 100%;
        object-fit: cover;
        transition: 300ms all cubic-bezier(0, 0, 0.2, 1);
        @media @desktop {
          &:hover {
            transform: scale(1.1);
          }
        }
      }
    }
  }
  &__info {
    &--tags {
      flex-wrap: wrap;
      .column-gap(8px);
      margin-bottom: 8px;
      @media @desktop {
        margin-bottom: 12px;
      }
      & > h4 {
        color: @ButtonPrimary;
        text-transform: uppercase;
      }
    }
    &--title {
      .text-line-clamp(3);
      margin-bottom: 2px;
      @media @mobile-up {
        .text-line-clamp(2);
      }
    }
    &--meta {
      color: @TextLabel;
      .divider {
        margin: 0 8px;
        width: 4px;
        height: 3px;
      }
      @media @tablet-strict {
        flex-wrap: wrap;
        span {
          flex-basis: 100%;
          &:first-child {
            margin-bottom: 4px;
            color: @TextBody;
          }
        }
        .divider {
          display: none;
        }
      }
    }
  }
}
</style>
