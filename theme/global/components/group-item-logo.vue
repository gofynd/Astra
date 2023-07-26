<template>
  <div class="card-item group-item-logo" :title="getTitle">
    <fdk-link :link="generateLink">
      <emerge-image
        :src="getCardLogo"
        class="logo-card"
        :sources="[{ width: 200 }]"
      />
    </fdk-link>
  </div>
</template>

<style lang="less" scoped>
.card-item {
  .logo-card {
    border-radius: @ImageRadius;
  }
}
</style>

<script>
import emergeImage from "../../global/components/common/emerge-image.vue";
const placeholder = require("../../assets/images/placeholder9x16.png");

export default {
  name: "groupItem",
  components: {
    "emerge-image": emergeImage,
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
    cardtype: {
      type: String,
      enum: ["BRANDS", "CATEGORIES", "COLLECTIONS", "WISHLIST", "PRODUCT"],
    },
    global_config: {},
  },
  computed: {
    getTitle() {
      let title = this.card.name;
      if (this.card.product_name) {
        title += " " + this.card.product_name;
      }
      return title;
    },
    getCardLogo() {
      return this.card.logo?.url || placeholder;
    },
    generateLink() {
      if (this.cardtype === "COLLECTIONS") {
        return "/collection/" + this.card.slug;
      }
      if (this.cardtype === "PRODUCT") {
        return "/product/" + this.card.slug;
      }
      if (this.cardtype === "BRANDS") {
        return "/products/?brand=" + this.card.slug;
      }
      return "/products/?" + this.card.action.url.split("?")[1];
    },
  },
};
</script>
