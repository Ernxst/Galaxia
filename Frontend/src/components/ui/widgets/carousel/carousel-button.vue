<template>
  <button @click="$emit('click', $event)">
    <span class="material-icons">keyboard_double_arrow_right</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "carousel-button",
  emits: ["click"]
});
</script>

<style scoped>
button {
  background: none;
  width: 48px;
  height: 200px;
  position: relative;
  border: 1px solid var(--main);
  cursor: pointer;
  backdrop-filter: blur(4px);
  margin: auto;
}

button[right] {
  transform: rotate(180deg);
}

button::before, button::after {
  background: var(--main);
  opacity: .2;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

button::after {
  opacity: 1;
  top: 100%;
  transition: .15s ease-in-out top;
}

button[right]::after {
  top: 0;
  bottom: 100%;
  transition-property: bottom;
}

button:hover::after {
  top: 0;
}

button[right]:hover::after {
  bottom: 0;
}

span {
  color: var(--main);
  transform: rotate(180deg);
  transition: .2s ease-in-out color;
  position: relative;
  z-index: 1;
}

button:hover span {
  color: var(--text-colour);
}

@media (max-width: 768px) {
  button {
    width: 66.7%;
    height: 100%;
    padding: 8px 0;
  }

  button[left] span {
    transform: rotate(-90deg);
  }

  button[right] span {
    transform: rotate(-90deg);
  }
}

@media (max-width: 640px) {
  button {
    width: 50%;
  }
}

@media (max-width: 480px) {
  button {
    width: 100%;
  }
}
</style>
