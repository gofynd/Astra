<template>
  <div class="error">
    <h1 class="heading font-header">Error 404</h1>
    <div class="description font-body b2">
      Sorry, the page cannot be found. Please use the search bar or navigation
      menu to find what you were looking for, or contact our support team if you
      believe this is a technical error. Thank you for visiting our website.
    </div>
    <fdk-link :link="'/'" class="continue_shopping-btn btn-secondary font-body"
      >RETURN TO HOMEPAGE</fdk-link
    >
  </div>
</template>

<script>
export default {
  name: "PageNotFound",
};
</script>

<style lang="less" scoped>
.error {
  background-color: @PageBackground;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 75vh;
  justify-content: center;
}
.heading {
  margin: 24px 24px 12px;
  @media @tablet {
    line-height: 32px;
  }
}
.description {
  display: flex;
  justify-content: center;
  max-width: 480px;
  text-align: center;
  color: @TextBody;
  @media @desktop {
    font-size: 16px;
    line-height: 20px;
  }
}
.continue_shopping-btn {
  display: flex;
  border: 1px solid @ButtonPrimary;
  color: @ButtonPrimary;
  width: 222px;
  margin: 20px;
  max-width: 484px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 15px 20px;
  font-size: 14px;
  line-height: 16px;
  @media @mobile {
    font-size: 12px;
    line-height: 14px;
  }
}
.button {
  display: flex;
  justify-content: center;
}

.content .cart-page-container {
  ::v-deep .action-container {
    padding: none;
    background-color: var(--pageBackground);
  }
}
</style>
