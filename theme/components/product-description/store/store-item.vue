<template>
  <div class="stores">
    <div class="store-item regular-xxs">
      <label>
        <input
          type="radio"
          name="store_item"
          :value="JSON.stringify(storeitem)"
          @click="selectStoreItem"
          :checked="storeitem.selected"
        />
        <div class="store-info">
          <div class="store-left">
            <svg-wrapper
              class="radio-icons"
              :svg_src="`${isActive ? 'radio-selected' : 'radio'}`"
            ></svg-wrapper>
          </div>
          <div class="store-right">
            <p :class="`${isActive ? 'caption-semi-bold' : 'caption-normal'}`">
              {{ storeLabel }}
            </p>
          </div>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
import SvgWrapper from "./../../common/svg-wrapper.vue";
export default {
  name: "store-item",
  components: {
    "svg-wrapper": SvgWrapper,
  },
  props: {
    storeitem: {},
    activeStoreInfo: {},
  },
  data() {
    return {
      isOpen: this.storeitem.isOpen || false,
    };
  },
  computed: {
    isActive() {
      if (this.activeStoreInfo) {
        if (
          this.activeStoreInfo.seller.uid === this.storeitem.seller.uid &&
          this.activeStoreInfo.store.uid === this.storeitem.store.uid
        ) {
          return true;
        }
      }
      return false;
    },
    storeLabel() {
      return (
        this.storeitem.store?.name +
        (this.storeitem.seller?.name ? ", " + this.storeitem.seller?.name : "")
      );
    },
  },
  methods: {
    selectStoreItem() {
      this.$emit("select-store-item", this.storeitem);
    },
  },
};
</script>

<style lang="less" scoped>
.stores {
  animation: fadeIn 0.25s ease-in;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  .store-item {
    display: flex;
    align-items: center;

    label {
      width: 100%;
      cursor: pointer;
    }
    input[type="radio"] {
      display: none;
    }
    .store-info {
      display: flex;
      align-items: center;

      .store-right {
        margin-left: 8px;
        display: block;
      }
    }
  }
}

.radio-icons {
  width: 20px;
  height: 20px;
}
</style>
