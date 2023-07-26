<template>
  <div :class="`b2 toast ${variant}`" :id="id" v-show="displayToast">
    {{ content }}
  </div>
</template>

<script>
module.exports = {
  name: "fdk-popup",
  props: {
    content: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      variant: "info",
      timer: null,
      displayToast: false,
    };
  },
  methods: {
    showToast: function showToast(setVariant = "") {
      if (["success", "error", "info"].includes(setVariant)) {
        this.variant = setVariant;
      }

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.displayToast = true;
      this.timer = setTimeout(() => {
        this.displayToast = false;
      }, 3000);
    },
  },
};
</script>

<style lang="less" scoped>
.toast {
  visibility: visible;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.18);
  border-radius: 8px;
  padding: 19.5px 24px;
  position: fixed;
  z-index: 5;
  left: 50%;
  transform: translateX(-50%);
  top: 25%;
}

.success {
  background-color: @SuccessBackground;
  color: @SuccessText;
  border-left: 1.4px solid @SuccessText;
}

.error {
  background-color: @ErrorBackground;
  color: @ErrorText;
  border-left: 1.4px solid @ErrorText;
}

.info {
  background-color: @InformationBackground;
  color: @InformationText;
  border-left: 1.4px solid @InformationText;
}

.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

.hide {
  visibility: hidden;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
