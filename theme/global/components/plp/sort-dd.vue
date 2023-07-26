<template>
  <div class="items sort-list" v-click-outside="closeSortOption">
    <span class="dd-label b1 font-body"> Sort by: </span>
    <div
      class="selected b1 flex-align-center justify-start"
      @click="sortOpen = !sortOpen"
    >
      <span class="selectedSort font-body"> {{ selectedsort }} </span>
      <svg-wrapper
        class="icon arrow-icon"
        :class="{ open: sortOpen }"
        :svg_src="'arrow-down'"
      ></svg-wrapper>
    </div>
    <ul v-if="sortOpen && checkMobile" class="menu font-body" id="sortopt">
      <li
        v-for="(sorttype, index) in filteredsorts"
        :key="sorttype.value + index"
        v-on:click="updateSortOption($event, sorttype.value)"
      >
        <span>{{ sorttype.name }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { isBrowser } from "browser-or-node";
import SvgWrapper from "./../../../components/common/svg-wrapper.vue";

export default {
  name: "sort-dd",
  props: {
    filteredsorts: [],
    updateSelection: {},
  },
  components: {
    "svg-wrapper": SvgWrapper,
  },
  data() {
    return {
      sortOpen: false,
    };
  },

  computed: {
    selectedsort() {
      let selectedFilter = this.filteredsorts.filter((x) => x.is_selected);
      if (selectedFilter.length > 0) {
        return selectedFilter[0].name;
      }
      return this.filteredsorts[1].name;
    },
    checkMobile() {
      if (isBrowser) {
        return window.innerWidth > 480;
      } else {
        return false;
      }
    },
  },
  methods: {
    updateSortOption(event, sortValue) {
      this.updateSelection(sortValue);
      this.closeSortOption(event);
    },
    closeSortOption(event) {
      if (event && event.target.id !== "sortopt") {
        this.sortOpen = false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.items {
  margin: auto;
  position: relative;
  padding: 0 10px;
  .user-select-none();
  .flex-center();
  .dd-label {
    color: @TextLabel;
  }

  .selected {
    margin-left: 8px;
    color: @TextHeading;
    cursor: pointer;
    .user-select-none();

    .arrow-icon {
      width: 16px;
      height: 16px;
      fill: @TextHeading;
      margin-left: 4px;
      &.open {
        transform: scale(1, -1);
      }
    }
  }

  .menu {
    background-color: @DialogBackground;
    position: absolute;
    top: 32px;
    left: 10px;
    z-index: @menu;
    margin: auto;
    min-width: 190px;
    border-radius: 8px;
    padding: 16px;

    li {
      font-size: 12px;
      line-height: 14px;
      color: @TextHeading;
      cursor: pointer;
      &:not(:last-child) {
        margin-bottom: 14px;
      }
      &:hover {
        opacity: 0.5;
      }
    }
  }
  &.sort-list {
    .sort-icon {
      display: none;
      @media @mobile {
        display: flex;
      }
    }
    #sortopt {
      @media @mobile {
        display: none;
      }
    }
    @media @mobile {
      .selected {
        .selectedSort {
          display: none;
        }
      }
      .menu {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        li {
          padding: 18px;
          border-bottom: 1px solid @Gray;
          justify-content: center;
          .inline-svg {
            display: none;
          }
        }
      }
    }
  }
}
</style>
