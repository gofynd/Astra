<template>
  <div class="badge-wrapper">
    <template v-for="(badge, index) in getBadgeData">
      <div class="badge-wrapper__item" :key="index">
        <div :class="{ 'badge-wrapper__item--hide': !badge.logo }">
          <fdk-link v-if="badge.url" :link="badge.url" target="_blank">
            <emerge-image
              class="badge-wrapper__logo"
              :src="badge.logo"
              :alt="badge.label"
            />
          </fdk-link>
          <emerge-image
            v-else
            class="badge-wrapper__logo"
            :src="badge.logo"
            :alt="badge.label"
          />
        </div>
        <template v-if="badge.label">
          <fdk-link
            v-if="badge.url"
            class="b2 badge-wrapper__label badge-wrapper__label--link"
            :link="badge.url"
            target="_blank"
          >
            {{ badge.label }}
          </fdk-link>
          <p v-else class="b2 badge-wrapper__label">
            {{ badge.label }}
          </p>
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.badge-wrapper {
  display: grid;
  .grid-gap(28px, 28px);
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 40px;
  justify-items: center;

  @media @mobile {
    margin-top: 32px;
    .grid-gap(16px, 16px);
    grid-template-columns: repeat(1, minmax(0, 1fr));
    justify-items: left;
  }

  @media @tablet-strict {
    margin-top: 32px;
    .grid-gap(52px, 52px);
    grid-template-columns: repeat(4, fit-content(100%));
    justify-content: center;
  }

  &__item {
    width: fit-content;

    @media @mobile {
      display: flex;
      align-items: center;
    }

    &--hide {
      visibility: hidden;
    }
  }

  &__logo {
    width: 32px;
    border-radius: 50%;

    @media @mobile-up {
      margin-left: auto;
      margin-right: auto;
      width: 52px;
    }
  }

  &__label {
    display: block;
    text-align: center;
    max-width: 150px;

    &--link {
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }

    @media @mobile {
      margin-left: 12px;
    }

    @media @mobile-up {
      margin-top: 8px;
    }
  }
}
</style>

<script>
import EmergeImage from "../../global/components/common/emerge-image.vue";

export default {
  components: { "emerge-image": EmergeImage },
  name: "Badges",
  props: {
    page_config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {},
  computed: {
    getBadgeData() {
      let badgeData = [];
      let totalBadges = 5;
      const pageConfig = this.page_config?.props || {};

      if (Object.keys(pageConfig).length) {
        for (let i = 1; i <= totalBadges; i++) {
          badgeData.push({
            logo: pageConfig[`badge_logo_${i}`],
            label: pageConfig[`badge_label_${i}`],
            url: pageConfig[`badge_url_${i}`],
          });
        }
      }

      return badgeData;
    },
  },
};
</script>
