<template>
  <div class="section-extension-root" :style="dynamicStyles">
    <!-- Extension Slot -->
    <fdk-extension :templates="templates" />
  </div>
</template>

<!-- #region  -->
<settings>
{
    "name": "section_extension",
    "label": "Extensions",
    "props": [
        {
          "type": "extension",
          "id": "extension",
          "label": "Extension Positions",
          "info": "Handle extension in these positions",
          "positions": [
            {
              "value": "section_extension",
              "text": ""
            }
          ],
          "default": {}
        }
    ]
}
</settings>
<!-- #endregion -->

<script>
import { getGlobalConfigValue } from "../helper/utils";

export default {
  props: ["settings", "global_config"],
  computed: {
    templates() {
      return this.settings.props?.extension?.value?.["section_extension"] || [];
    },
    dynamicStyles() {
      return {
        padding: "16px 0",
        "margin-bottom": `${getGlobalConfigValue(
          this.global_config,
          "section_margin_bottom"
        )}px`,
      };
    },
  },
};
</script>

<style>
.section-extension-root {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
</style>
