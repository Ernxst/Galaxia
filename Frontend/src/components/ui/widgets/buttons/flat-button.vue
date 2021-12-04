<template>
  <div class="button-container centred">
    <button :data-disabled="disabled"
            :style="`--button-bg: ${bg}`"
            :type="type"
            class="flat-button noselect centred"
            @click="onClick"
            @mouseenter="onMouseEnter"
            @mouseleave="onMouseLeave"
            @keyup.enter="onClick">
      <span>{{ text }}</span>
      <slot></slot>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "flat-button",
  emits: ["click", "mouseenter", "mouseleave"],
  props: {
    text: { type: String, default: "" },
    bg: { type: String, default: "var(--main)" },
    type: { type: String, default: "button" },
  },
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
      this.$emit("mouseenter", event)
    },
    onMouseLeave(event) {
      // TODO: Stop button hover sound
      this.mouseEntered = false;
      this.$emit("mouseleave", event)
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
.button-container {
  border: 1px solid var(--text-colour);
  padding: 2px;
}

button {
  --button-bg: var(--main);
  background: var(--button-bg);
  outline: 0;
  border: 0;
  padding: 12px 18px;
  cursor: pointer;
  transition: .15s ease-in-out all;
  color: var(--text-colour);
  width: 100%;
  height: 100%;
}

button:hover, button:focus {
  filter: brightness(1.5);
}

button span {
  font-size: 12px;
  text-shadow: 0 0 8px var(--page-bg);
}

button:hover span, button:focus span {
  text-shadow: none;
}

button[data-disabled=true] {
  pointer-events: none;
  filter: brightness(0.33);
}

@media (min-width: 480px) {
  button span {
    font-size: 1.25vw;
  }
}
</style>
