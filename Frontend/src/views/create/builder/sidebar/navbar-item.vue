<template>
  <button class="nav-item centred"
          @click="$emit('click')">
    <span class="material-icons">{{ icon }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "navbar-item",
  emits: ["click"],
  props: {
    icon: String
  }

});
</script>

<style scoped>
button {
  outline: none;
  border: none;
  cursor: pointer;
  background: transparent;
  transition: .167s ease-in-out all;
  border-radius: 4px;
  padding: 4px;
  pointer-events: none;
}

button span {
  color: rgba(0, 0, 0, .5);
  border-radius: 50%;
  transition: .167s ease-in-out all;
}

button[active=true] {
  background: var(--page-bg);
  pointer-events: all;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, .44);
}

button[active=true] span {
  color: var(--main);
}
</style>
