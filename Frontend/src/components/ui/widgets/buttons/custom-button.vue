<template>
  <button @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import useButton from "@/components/ui/widgets/buttons/use-button";
import { defineComponent } from "vue";


export default defineComponent({
  name: "custom-button",
  emits: ["click", "mouseenter", "mouseleave"],
  setup(props, { emit }) {
    return useButton(emit);
  },
});
</script>

<style scoped>
button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}

button:hover, button:focus {
  border: none;
  outline: none;
}

button[data-disabled=true] {
  pointer-events: none;
  filter: brightness(0.33);
}
</style>
