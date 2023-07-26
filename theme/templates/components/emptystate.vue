<template>
  <div class="error">
    <h3 class="heading font-header">{{ getTitle }}</h3>
    <!--<div class="description font-body">
      We apologize for any inconvenience caused, but it seems that the page
      you're trying to access cannot be found.
    </div> -->
    <fdk-link :link="'/'" class="continue_shopping-btn font-body btn-secondary"
      >RETURN TO HOMEPAGE</fdk-link
    >
  </div>
</template>

<script>
export default {
  name: "EmptyState",
  props: ["title", "subtitle", "button", "context"],
  mounted() {},
  computed: {
    getTitle() {
      return this.context?.title?.replace(".", "") || "No Data Found";
    },
  },
};
</script>

<style lang="less" scoped>
.error {
  background-color: @PageBackground;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  justify-content: center;
  height: 100%;
  min-height: 75vh;
}
.heading {
  font-size: 32px;
  line-height: 42px;
  margin: 0 0 32px;
  text-transform: lowercase;
  &::first-letter {
    text-transform: capitalize;
  }
  @media @tablet {
    font-size: 24px;
    line-height: 32px;
    text-align: center;
  }
}
.description {
  display: flex;
  justify-content: center;
  max-width: 480px;
  margin: 12px auto 32px;
  text-align: center;
  line-height: 18px;
  letter-spacing: -0.02em;
  color: @TextBody;
}
.continue_shopping-btn {
  display: flex;
  justify-content: center;
  border: 1px solid @ButtonPrimary;
  color: @ButtonPrimary;
  width: 204px;
  max-width: 484px;
  height: 44px;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 4px;
  font-size: 14px;
  line-height: 16.42px;
  @media @mobile {
    font-size: 12px;
    line-height: 14.08px;
  }
}
</style>
