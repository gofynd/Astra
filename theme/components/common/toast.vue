<template>
  <div v-show="displayToast" :class="`b2 toast ${variant}`" :id="id">
    <div class="flex-align-center">
      <svg-wrapper
        v-if="toastIcon"
        :svg_src="toastIcon"
        class="toast__icon toast__icon--leading"
      />
      <span class="b3 toast__message">{{ content }}</span>
    </div>
  </div>
</template>

<script>
import SvgWrapper from "./svg-wrapper";
export default {
  name: "fdk-popup",
  components: {
    "svg-wrapper": SvgWrapper,
  },
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
      toastIcon: "",
      timer: null,
      displayToast: false,
    };
  },
  methods: {
    showToast: function showToast(setVariant = "", toastIcon = "") {
      if (["success", "error", "info"].includes(setVariant)) {
        this.variant = setVariant;
      }

      this.toastIcon = toastIcon;

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
  border-radius: 6px;
  box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.04);
  padding: 8px 12px;
  position: fixed;
  z-index: 5;
  left: 50%;
  transform: translateX(-50%);
  top: 25%;

  &__icon {
    height: 20px;
    width: 20px;
    cursor: pointer;

    &--leading {
      margin-right: 12px;
    }
  }
}

.success {
  background-color: @SuccessBackground;
  color: @SuccessText;

  .toast__icon--leading {
    ::v-deep svg path {
      stroke: @SuccessText;
    }
  }
}

.error {
  background-color: @ErrorBackground;
  color: @ErrorText;

  .toast__icon--leading {
    ::v-deep svg path {
      stroke: @ErrorText;
    }
  }
}

.info {
  background-color: @InformationBackground;
  color: @InformationText;

  .toast__icon--leading {
    ::v-deep svg path {
      stroke: @InformationText;
    }
  }
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
