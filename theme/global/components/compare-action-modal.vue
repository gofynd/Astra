<template>
  <div class="update-compare-container font-body">
    <div class="overlay" @click="hideModal"></div>

    <transition name="slide">
      <div class="update-compare-modal">
        <div class="cross-btn" v-on:click="hideModal">
          <img src="./../../assets/images/close-icon.png" />
        </div>
        <div class="modal-container">
          <div class="modal-title">
            <div class="warning">
              <img src="./../../assets/images/compare-warning.png" />
            </div>
            <div class="bold-md primary-text">{{ compare_msg.title }}</div>
            <!-- <div class="regular-md secondary-text">You can compare upto 3 products at a time</div> -->
          </div>
          <div class="modal-content">
            <fdk-compare-action>
              <template slot-scope="compareAction">
                <div class="button-container">
                  <div>
                    <button
                      :global_config="global_config"
                      class="reset-button common-button"
                      @click="
                        reset(
                          compareAction.addCompare,
                          compareAction.removeCompare
                        )
                      "
                    >
                      Reset
                    </button>
                  </div>
                  <div>
                    <button
                      class="compare-button common-button"
                      :global_config="global_config"
                      @click="goToCompare"
                    >
                      Go to Compare
                    </button>
                  </div>
                </div>
              </template>
            </fdk-compare-action>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "compare-action-modal",
  props: {
    compare_slugs: {
      default: [],
    },
    compare_msg: {},
    product_uid: {},
    global_config: {},
  },
  components: {},
  methods: {
    hideModal() {
      this.$emit("hide-compare-action-modal");
    },
    reset(addHandler, removeHandler) {
      //remove all compare products first
      for (let i = 0; i < this.compare_slugs.length; i++) {
        removeHandler(this.compare_slugs[i], false);
      }

      //add current product uid
      addHandler(this.product_uid)
        .then((res) => {
          //todo
          this.goToCompare();
        })
        .catch((err) => {
          //show error
        });
    },
    goToCompare() {
      this.$router.push({ path: "/compare" });
    },
  },
};
</script>

<style lang="less" scoped>
.update-compare-container {
  margin-top: 5px;

  .update-compare-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    box-shadow: 0px -1px 2px 1px #eee;
    max-width: 550px;
    width: 90%;
    height: fit-content;
    border-radius: 3px;
    overflow: hidden;
    background-color: #fff;
    transition: all 0.25s ease;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow-y: hidden;
    z-index: 40;
    text-align: -webkit-center;
    .modal-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 24px 35px;
      @media @mobile {
        padding: 16px;
      }
    }
    .modal-title {
      .primary-text {
        color: #000;
        text-align: center;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.4px;
        text-transform: capitalize;
        line-height: 27px;
        width: 60%;
        padding-top: 24px;
        @media @mobile {
          padding: 0 20px;
          font-size: 16px;
          width: 100%;
        }
      }

      .warning {
        text-align: center;
        img {
          margin: auto;
          @media @mobile {
            width: -webkit-fill-available;
          }
        }
      }
    }
    .common-button {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.24px;
      text-transform: uppercase;
      padding: 12px 35px;
    }

    .button-container {
      display: flex;
      gap: 15px;
      align-items: center;
      bottom: 0;
      box-sizing: border-box;
      margin: 24px auto;
      width: 65%;
      @media @tablet {
        align-items: inherit;
        flex-direction: column;
        width: 100%;
      }
      button {
        width: 100%;
      }
      & > :first-child {
        flex: 0 0 40%;
      }
      & > :nth-child(2) {
        flex: 0 0 55%;
      }
      .reset-button {
        border-radius: 4px;
        border: 0.8px solid @DividerStokes;
        color: @ButtonPrimary;
        background: @ButtonSecondary;
      }
      .compare-button {
        color: @ButtonSecondary;
        background-color: @ButtonPrimary;
        border-radius: 4px;
        border: 0.8px solid @DividerStokes;
      }
    }
  }
}
.cross-btn {
  cursor: pointer;
  display: flex;
  align-self: flex-end;
  width: -webkit-fill-available;
  justify-content: flex-end;
  float: right;
  padding: 16px 24px;
  @media @mobile {
    padding: 8px;
  }
  img {
    width: 16px;
  }
}
.overlay {
  background-color: #000;
  opacity: 0.75;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 15;
}

//animations

.slide-leave-active,
.slide-enter-active {
  transition: 0.5s;
}
.slide-enter {
  transform: translate(0, 100%);
}
.slide-leave-to {
  transform: translate(0, 100%);
}
</style>
