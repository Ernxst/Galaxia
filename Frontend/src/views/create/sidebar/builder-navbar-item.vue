<template>
  <button class="nav-item centred">
    <span class="icon material-icons">{{ icon }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "builder-navbar-item",
  props: {
    icon: { type: String, required: true }
  }
});
</script>

<style scoped>
.nav-item {
  outline: none;
  border: none;
  cursor: pointer;
  background: transparent;
  transition: .167s ease-in-out all;
  border-radius: 4px;
  padding: 4px;
  pointer-events: none;
}

.nav-item .icon {
  color: rgba(0, 0, 0, .5);
  border-radius: 50%;
  transition: .167s ease-in-out all;
}

.nav-item[active=true] {
  background: var(--page-bg);
  pointer-events: all;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, .44);
}

.nav-item[active=true] .icon {
  color: var(--main);
}
</style>
