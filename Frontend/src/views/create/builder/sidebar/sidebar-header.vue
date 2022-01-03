<template>
  <header class="centred">
    <span class="tagline">Create your journey</span>
    <h1>{{ title }}</h1>
    <p class="subtitle">{{ text }}</p>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "sidebar-header",
  props: {
    title: String,
    text: String,
  }
});
</script>

<style scoped>
header {
  flex-direction: column;
}

h1 {
  font-size: 21px;
  letter-spacing: 4px;
  margin-top: 0;
  margin-bottom: 8px;
  width: 100%;
  text-align: left;
}

.tagline {
  font-size: 10px;
  width: 100%;
  text-align: left;
  color: rgba(255, 255, 255, .75);
}

p {
  font-size: 12px;
}
</style>
