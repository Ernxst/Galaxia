<template>
  <div class="button-container">
    <button ref="button" :type="type" class="flat-button noselect centred">
      <span>{{ text }}</span>
      <slot></slot>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";


type buttonType = "button" | "submit" | "reset";

export default defineComponent({
  name: "flat-button",
  props: {
    type: {
      type: String as () => buttonType,
      default: "button",
    },
    text: { type: String, default: "" },
  },
  setup() {
    const button = ref<HTMLButtonElement>(null);

    function enable() {
      button.value.classList.remove("disabled");
    }

    function disable() {
      button.value.classList.add("disabled");
    }

    return { enable, disable, button };
  },
});
</script>

<style scoped>

.button-container {
  border: 1px solid var(--text-colour);
  padding: 1px;
}

button {
  --button-bg: var(--main);
  background: var(--button-bg);
  position: relative;
  outline: 0;
  border: 0;
  padding: 12px 18px;
  cursor: pointer;
  transition: .15s ease-in-out all;
  color: var(--text-colour);
}

button:hover {
  filter: brightness(1.5);
}

button span {
  font-size: 1.25vw;
}

.disabled, button[disabled], button[disabled=true] {
  pointer-events: none;
  filter: brightness(33%);
}

@media (max-width: 480px) {
  button span {
    font-size: 12px;
  }
}
</style>
