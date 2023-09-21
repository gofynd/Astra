<template>
  <fdk-pincode ref="pdpPincode">
    <template slot-scope="pincodeAction">
      <div class="delivery-info">
        <h4 class="delivery-label b2">Select delivery location</h4>
        <div class="delivery" v-if="isMounted">
          <input
            ref="deliveryPincode"
            autocomplete="off"
            v-model="pincode_value"
            placeholder="Please enter PIN code to check delivery time"
            class="b2 pincode-input font-body"
            type="text"
            maxlength="11"
          />
          <button
            class="button btn-primary font-body"
            @click="checkPincode(pincodeAction)"
            :disabled="(errMessage && showError) || selectPincodeError"
          >
            <span class="flex-align-center">
              CHECK
              <svg-wrapper
                :svg_src="'delivery'"
                class="delivery-icon"
              ></svg-wrapper>
            </span>
          </button>
        </div>
        <div class="caption-normal error" v-if="errMessage && showError">
          {{ errMessage }}
        </div>
        <div
          class="caption-normal empty-pincode"
          v-else-if="selectPincodeError"
        >
          {{ "Please enter valid pincode before Add to cart/ Buy now" }}
        </div>
        <template
          v-if="
            storeInfo &&
            getDeliveryDate &&
            !showError &&
            !errMessage &&
            !selectPincodeError &&
            pincode_value
          "
        >
          <div class="delivery-date">
            <svg-wrapper
              :svg_src="'delivery'"
              class="delivery-icon"
            ></svg-wrapper>
            <p class="caption-normal">
              {{ getDeliveryDate }}
            </p>
          </div>
        </template>
      </div>
    </template>
  </fdk-pincode>
</template>

<style lang="less" scoped>
.delivery {
  margin-bottom: 4px;
  display: flex;
  border-radius: @ButtonRadius;
  background-color: @ThemeAccentL4;
}
.delivery-info {
  margin-top: 48px;

  @media @tablet {
    margin-top: 32px;
  }

  .delivery-label {
    margin-bottom: 6px;
    color: @TextHeading;
  }
  .ukt-links {
    .user-select-none();
    font-size: 15px;
  }
}
.delivery-date {
  color: @SuccessText;
  display: flex;
  align-items: center;

  .delivery-icon {
    width: 14px;
    height: 12px;

    /deep/ svg {
      path {
        fill: @SuccessText;
      }
    }
  }

  p {
    margin-left: 0.25rem;
  }
}
.error {
  color: @ErrorText;
}
.button {
  // background: none;
  border: none;
  padding: 0 1rem;
  cursor: pointer;
  text-transform: uppercase;
  // color: @ButtonPrimary;

  // & > span {
  //   border-bottom: 1px solid @ButtonPrimary;
  // }
  .delivery-icon {
    display: block;
    width: 14px;
    height: 12px;
    margin-left: 0.5rem;

    @media @tablet {
      display: none;
    }
  }
}

.pincode-input {
  background: none;
  border: none;
  padding: 1rem 0.5rem;
  width: 100%;
  text-overflow: ellipsis;
}

.error {
  color: @ErrorText;
}
.empty-pincode {
  color: @InformationText;
}
</style>

<script>
import isEmpty from "lodash/isEmpty";
import SvgWrapper from "../common/svg-wrapper.vue";

export default {
  name: "delivery-info",
  components: {
    "svg-wrapper": SvgWrapper,
  },
  props: {
    storeInfo: {},
    id: {
      type: Number,
    },
    context: {},
    showUserPincodeModal: {},
    pincode: {},
    selectPincodeError: {
      type: Boolean,
      default: false,
    },
    errMessage: {
      type: String,
      default: "",
    },
    showError: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    storeInfo() {
      if (this.storeInfo) {
        this.fromPincode = `${this.storeInfo.pincode}`;
        this.toPincode = this.pincode;
      }
    },
    pincode_value(newVal) {
      this.$emit("changeCurrentPincodeValue", newVal);
      this.$emit("disableSelectPincodeError", false);

      const reg = new RegExp(/^(?=.{2,11}$)[a-z0-9]+([ -]?[a-z0-9]+)*$/i);
      if (!reg.test(newVal)) {
        this.$emit("onPincodeError", "Invalid pincode");
      } else {
        this.$emit("hidePincodeError");
      }
    },
  },
  data() {
    return {
      pincode_value: "",
      toPincode: this.pincode || "",
      fromPincode: "",
      tatInfo: {},
      isMounted: false,
    };
  },
  computed: {
    getDeliveryDate() {
      let options = {
        weekday: "short",
        month: "short",
        day: "numeric",
      };
      const { min, max } = this.storeInfo?.delivery_promise || {};
      if (!min) {
        return false;
      }
      const dateFormatter = new Intl.DateTimeFormat(undefined, options);
      const minDate = dateFormatter.format(new Date(min));
      const maxDate = dateFormatter.format(new Date(max));
      return `Will be delivered ${
        min === max ? `on ${minDate}` : `between ${minDate} - ${maxDate}`
      }`;
    },
  },

  mounted() {
    this.isMounted = true;
    this.pincode_value = this.pincode;
  },
  methods: {
    onNewPincodeReceived(obj) {
      let newPincode = obj.pincode_value;
      this.toPincode = newPincode;
      this.$emit("pincodeChanged", newPincode);
    },
    checkPincode(pincodeAct) {
      this.$emit("disableSelectPincodeError", false);

      return pincodeAct
        .validatePincode(this.pincode_value)
        .then((valid) => {
          if (valid) {
            this.$emit("hidePincodeError");
            const pincodeData = {
              pincode_value: this.pincode_value,
              pincode_act: pincodeAct,
            };
            this.onNewPincodeReceived(pincodeData);
            this.$emit("hideTatError");
          } else {
            throw {
              message: "Something went wrong",
            };
          }

          return true;
        })
        .catch((err) => {
          this.$emit("onPincodeError", err.message);
          return false;
        });
    },
  },
};
</script>
