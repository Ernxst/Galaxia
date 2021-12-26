<template>
  <button @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "custom-button",
  emits: ["click", "mouseenter", "mouseleave"],
  data() {
    return {
      disabled: false,
      mouseEntered: false,
    };
  },
  methods: {
    onClick(event) {
      // TODO: Play button click sound here
      this.$emit("click", event);
    },
    onMouseEnter(event) {
      // TODO: Play button hover sound here
      this.mouseEntered = true;
      this.$emit("mouseenter", event);
    },
    onMouseLeave(event) {
      // TODO: Stop button hover sound
      this.mouseEntered = false;
      this.$emit("mouseleave", event);
    },
    enable() {
      this.disabled = false;
    },
    disable() {
      this.disabled = true;
    },
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
