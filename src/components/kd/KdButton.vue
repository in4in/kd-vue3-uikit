<template>
  <el-button v-bind="$props">
    <slot />
  </el-button>
</template>

<script lang="ts">
import { ElButton } from "element-plus";

export default {
  name: "KdButton",
  components: { ElButton },
  props: {
    size: {
      type: String,
      required: false,
      default: "",
      validator: (value: string) => ["large", "small", ""].includes(value),
    },
    type: {
      type: String,
      required: false,
      default: "primary",
      validator: (value: string) => ["primary", "success", "warning", "danger", "info", "text"].includes(value),
    },
    plain: {
      type: Boolean,
      required: false,
      default: false,
    },
    round: {
      type: Boolean,
      required: false,
      default: false,
    },
    circle: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
$color: green;
* {
  color: $color;
}
</style>
