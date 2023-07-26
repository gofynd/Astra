<template>
  <div class="sticky-col" ref="element">
    <slot></slot>
  </div>
</template>

<script>
import { isBrowser } from "browser-or-node";
export default {
  name: "sticky-column",
  data() {
    return {
      lastKnownY: 0,
      currentTop: 0,
      pendingRaf: false,
      stickyHeaderOffset: 0,
    };
  },
  destroyed() {
    isBrowser && this.destroyStickyScroll();
  },
  mounted() {
    isBrowser && this.setupStickyScroll();
  },
  methods: {
    setupStickyScroll() {
      this.getInitialValues();
      window.addEventListener("scroll", this.checkPosition);
    },
    destroyStickyScroll() {
      window.removeEventListener("scroll", this.checkPosition);
    },
    getInitialValues() {
      this.lastKnownY = window.scrollY || 0;
      this.currentTop = 0;
      this.pendingRaf = false;
      this.stickyHeaderOffset = this.getStickyHeaderOffset();
    },
    checkPosition() {
      if (this.pendingRaf) return;
      this.pendingRaf = true;
      requestAnimationFrame(() => {
        const { top } = this.$refs.element.getBoundingClientRect();
        const maxTop =
          top +
          window.scrollY -
          this.$refs.element.offsetTop +
          this.getTopOffset();
        const minTop =
          this.$refs.element.clientHeight - window.innerHeight + 30;
        if (window.scrollY < this.lastKnownY) {
          this.currentTop -= window.scrollY - this.lastKnownY;
        } else {
          this.currentTop += this.lastKnownY - window.scrollY;
        }
        this.lastKnownY = window.scrollY;
        this.currentTop = Math.min(
          Math.max(this.currentTop, -minTop),
          maxTop,
          this.getTopOffset()
        );
        this.$refs.element.style.top = `${this.currentTop}px`;
        this.pendingRaf = false;
      });
    },
    getTopOffset() {
      if (!this.stickyHeaderOffset) {
        this.stickyHeaderOffset = this.getStickyHeaderOffset();
      }
      return this.stickyHeaderOffset + 30;
    },
    getStickyHeaderOffset() {
      return parseInt(
        getComputedStyle(this.$refs.element).getPropertyValue(
          "--headerHeight"
        ) || 0
      );
    },
  },
};
</script>

<style lang="less" scoped>
.sticky-col {
  position: sticky;
  align-self: start;
  will-change: top;
}
</style>
