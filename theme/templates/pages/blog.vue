<template>
  <div class="blog-container">
    <div class="hero-banner">
      <emerge-image
        class="hero-image"
        :aspectRatio="21 / 9"
        :mobileAspectRatio="3 / 4"
        :src="getDesktopHeroImage"
        :sources="[
          {
            breakpoint: { min: 1400 },
            width: 1500,
          },
          {
            breakpoint: { min: 1023 },
            width: 1200,
          },
          {
            breakpoint: { min: 800 },
            width: 850,
          },
          {
            breakpoint: { min: 481 },
            width: 550,
          },
          {
            breakpoint: { max: 480 },
            width: 480,
            url: getMobileHeroImage,
          },
        ]"
        :alt="getPageConfigValue(page_config, 'banner_text')"
        :showOverlay="displayOverlay"
        :overlayColor="getOverlayColor"
      />
      <h1 class="hero-text d1 font-header">
        {{ getPageConfigValue(page_config, "banner_text") }}
      </h1>
    </div>
    <div class="breadcrumbs caption-normal font-body">
      <span><fdk-link :link="'/'">Home</fdk-link>&nbsp; / &nbsp;</span>
      <span class="active">Blog</span>
    </div>
    <fdk-blog>
      <template v-slot="{ fetchBlogs }">
        <template v-if="getPageConfigValue(page_config, 'infinite_scroll')">
          <fdk-infinite-scrolling
            @loadmore="loadmoreBlogs(fetchBlogs)"
            :loadingData="context.blogs?.loading"
          >
            <div class="blogs">
              <div
                class="blog"
                :class="{ 'blog-lg': i % 7 === 0 }"
                v-for="(blog, i) in context.blogs?.items"
                :key="i"
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
                  <h3
                    class="blog__info--title font-header"
                    :class="{ h1: i % 7 === 0 && isDesktop }"
                  >
                    <fdk-link
                      :link="`/blog/${blog.slug}`"
                      :title="blog.title"
                      :target="'_blank'"
                      >{{ blog.title }}</fdk-link
                    >
                  </h3>
                  <div
                    class="blog__info--content b1 font-body"
                    v-if="i % 7 === 0 && getBlogContent(blog)"
                  >
                    {{ getBlogContent(blog) }}
                  </div>
                  <div
                    class="blog__info--meta font-body flex-align-center"
                    :class="[`${i % 7 === 0 && isDesktop ? 'b1' : 'b2'}`]"
                  >
                    <span>{{ blog?.author?.name }}</span>
                    <svg-wrapper
                      class="divider"
                      :svg_src="'ellipse'"
                    ></svg-wrapper>
                    <span>{{
                      getFormattedDate(blog?.date_meta?.created_on)
                    }}</span>
                  </div>
                  <fdk-link
                    :link="`/blog/${blog.slug}`"
                    :title="blog.title"
                    class="blog__info--button btn-primary font-body"
                    v-if="i % 7 === 0"
                    :target="'_blank'"
                    >READ MORE</fdk-link
                  >
                </div>
              </div>
            </div>
          </fdk-infinite-scrolling>
        </template>
        <template v-else>
          <div class="blogs">
            <div
              class="blog"
              :class="{ 'blog-lg': i % 7 === 0 }"
              v-for="(blog, i) in context.blogs?.items"
              :key="i"
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
                <h3
                  class="blog__info--title font-header"
                  :class="{ h1: i % 7 === 0 && isDesktop }"
                >
                  <fdk-link
                    :link="`/blog/${blog.slug}`"
                    :title="blog.title"
                    :target="'_blank'"
                    >{{ blog.title }}</fdk-link
                  >
                </h3>
                <div
                  class="blog__info--content b1 font-body"
                  v-if="i % 7 === 0 && getBlogContent(blog)"
                >
                  {{ getBlogContent(blog) }}
                </div>
                <div
                  class="blog__info--meta font-body flex-align-center"
                  :class="[`${i % 7 === 0 && isDesktop ? 'b1' : 'b2'}`]"
                >
                  <span>{{ blog?.author?.name }}</span>
                  <svg-wrapper
                    class="divider"
                    :svg_src="'ellipse'"
                  ></svg-wrapper>
                  <span>{{
                    getFormattedDate(blog?.date_meta?.created_on)
                  }}</span>
                </div>
                <fdk-link
                  :link="`/blog/${blog.slug}`"
                  :title="blog.title"
                  class="blog__info--button btn-primary font-body"
                  v-if="i % 7 === 0"
                  :target="'_blank'"
                  >READ MORE</fdk-link
                >
              </div>
            </div>
          </div>
          <div
            class="view-more-btn-wrapper flex-center"
            v-if="context.blogs?.page?.has_next"
          >
            <button
              class="btn-secondary view-more-btn font-body"
              @click="loadmoreBlogs(fetchBlogs)"
              tabindex="0"
            >
              View More
            </button>
          </div>
        </template>
      </template>
    </fdk-blog>
  </div>
</template>

<settings>
{
  "props": [
    {
      "type": "image_picker",
      "id": "banner_image_desktop",
      "default": "",
      "label": "Desktop / Tablet Banner",
      "options": {
        "aspect_ratio": "21:9",
        "aspect_ratio_strict_check":true
      }
    },
    {
      "type": "image_picker",
      "id": "banner_image_mobile",
      "default": "",
      "label": "Mobile banner",
      "options": {
        "aspect_ratio": "3:4",
        "aspect_ratio_strict_check":true
      }
    },
    {
      "type": "text",
      "id": "banner_text",
      "default": "",
      "label": "Blog description"
    },
    {
      "id": "overlay_option",
      "type": "select",
      "options": [
        {
          "value": "no_overlay",
          "text": "No Overlay"
        },
        {
          "value": "white_overlay",
          "text": "White Overlay"
        },
        {
          "value": "black_overlay",
          "text": "Black Overlay"
        }
      ],
      "default": "no_overlay",
      "label": "Overlay Option",
      "info": "Use this option to add a black or white semi-transparent overlay on top of the image. This will help you to stand out your text content"
    },
    {
      "type": "checkbox",
      "id": "infinite_scroll",
      "label": "Enable infinity scroll",
      "default": true,
      "info": "If it is enabled, view more button will not be shown, only on scroll blogs will be displayed"
    }
  ]
}
</settings>

<script>
import { isBrowser } from "browser-or-node";
import { getPageConfigValue } from "../../helper/utils";
import emergeImage from "../../global/components/common/emerge-image.vue";
import SvgWrapper from "../../components/common/svg-wrapper.vue";

export default {
  props: ["context", "settings", "page_config"],
  components: {
    "emerge-image": emergeImage,
    "svg-wrapper": SvgWrapper,
  },
  data() {
    return {
      windowWidth: isBrowser ? window.innerWidth : 0,
    };
  },
  computed: {
    isDesktop() {
      return this.windowWidth > 768;
    },
    getMobileHeroImage() {
      return (
        getPageConfigValue(this.page_config, "banner_image_mobile") ||
        require("../../assets/images/placeholder3x4.png")
      );
    },
    getDesktopHeroImage() {
      return (
        getPageConfigValue(this.page_config, "banner_image_desktop") ||
        require("../../assets/images/placeholder21x9.png")
      );
    },
    displayOverlay() {
      const overlayOption = getPageConfigValue(
        this.page_config,
        "overlay_option"
      );

      return !!(overlayOption && overlayOption !== "no_overlay");
    },
    getOverlayColor() {
      const overlayType = getPageConfigValue(
        this.page_config,
        "overlay_option"
      );

      return overlayType === "black_overlay" ? "#000000" : "#ffffff";
    },
  },
  mounted() {
    isBrowser && window.addEventListener("resize", this.onResize);
  },
  methods: {
    getPageConfigValue,
    onResize() {
      this.windowWidth = isBrowser ? window.innerWidth : 0;
    },
    loadmoreBlogs(fetchBlogs) {
      if (this.context?.blogs?.page?.has_next) {
        fetchBlogs({ pageNo: this.context?.blogs?.page?.current + 1 });
      }
    },
    getFormattedDate(dateString) {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    },
    getBlogContent(blog) {
      if (!isBrowser) return "";
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        blog?.content.find((content) => content.type === "html")?.value || "",
        "text/html"
      );
      const elements = doc.querySelectorAll("table");
      if (elements) {
        elements.forEach((e) => {
          e.remove();
        });
      }
      return doc.body.textContent;
    },
    getBlogTag(blog) {
      return blog?.tags?.length > 1 ? `${blog?.tags?.[0]},` : blog?.tags?.[0];
    },
  },
  beforeDestroy() {
    isBrowser && window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style lang="less" scoped>
@rowGap: 40px;
@specialMobileMargin: @rowGap - 16px;
.blog-container {
  padding-bottom: 64px;
  .hero-banner {
    position: relative;
    .hero-image {
      isolation: isolate;
      @media @tablet-strict {
        .aspect-ratio(21 / 9);
      }
    }
    .hero-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      padding: 0 16px;
      text-align: center;
      @media @desktop {
        max-width: 923px;
      }
    }
  }
  .breadcrumbs {
    padding: 8px 16px;
    margin-bottom: 32px;
    @media @mobile-up {
      padding: 8px 24px;
      margin-bottom: 32px;
    }
    @media @desktop {
      padding: 8px 40px;
      margin-bottom: 48px;
    }
    span {
      color: @ButtonPrimary;
      &.active {
        color: @TextDisabled;
      }
    }
  }
  .view-more-btn-wrapper {
    margin-top: 32px;
    @media @desktop {
      margin-top: 40px;
    }
    .view-more-btn {
      padding: 12px 16px;
      @media @desktop {
        padding: 15px 32px;
        min-width: 148px;
      }
    }
  }
  .blogs {
    display: grid;
    .grid-gap(@rowGap, 24px);
    grid-template-columns: 1fr;
    margin: 0 16px;
    @media @mobile-up {
      margin: 0 24px;
      grid-template-columns: repeat(3, 1fr);
    }
    @media @desktop {
      margin: 0 40px;
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
        .text-line-clamp(2);
        margin-bottom: 2px;
        @media @mobile-up {
          margin-bottom: 8px;
        }
      }
      &--meta {
        color: @TextLabel;
        .divider {
          margin: 0 8px;
          width: 4px;
          height: 3px;
        }
      }
    }
    @media @mobile {
      &:nth-child(7n - 2),
      &:nth-child(7n - 1),
      &:nth-child(7n) {
        display: flex;
        align-items: center;
        .blog {
          &__image {
            margin: 0;
            flex: 0 0 46.88%;
            margin-right: 16px;
          }
          &__info {
            &--tags,
            &--meta {
              display: none;
            }
            &--title {
              .text-line-clamp(3);
            }
          }
        }
      }
      &:nth-child(7n - 1) {
        margin: -@specialMobileMargin 0;
        &:is(:last-child) {
          padding-bottom: @specialMobileMargin;
        }
      }
      &:nth-child(7n - 2) {
        padding-top: 16px;
      }
      &:nth-child(7n) {
        padding-bottom: 16px;
      }
    }
    @media @tablet-strict {
      &__info {
        &--title {
          .text-line-clamp(3);
        }
        &--meta {
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
    &.blog-lg {
      @media @desktop {
        grid-column-start: 1;
        grid-column-end: -1;
        display: flex;
        align-items: center;
        padding: 16px 0;
        .blog {
          &__image {
            margin: 0;
            flex: 0 0 66.1%;
            margin-right: 24px;
          }
          &__info {
            flex-grow: 1;
            &--title,
            &--content,
            &--meta {
              margin-bottom: 32px;
              .divider {
                margin: 0 12px;
              }
            }
            &--content {
              .text-line-clamp(6);
            }
            &--button {
              padding: 16px 32px;
              display: inline-block;
            }
          }
        }
        &:nth-child(2n) {
          flex-direction: row-reverse;
          .blog {
            &__image {
              margin-right: 0;
              margin-left: 24px;
            }
          }
        }
      }
      @media @tablet {
        .blog {
          &__info {
            &--content,
            &--button {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
