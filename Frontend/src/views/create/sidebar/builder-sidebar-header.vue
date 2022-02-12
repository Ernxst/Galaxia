<template>
  <header class="header centred">
    <span class="tagline">Create your journey</span>
    <h1 class="title">{{ title }}</h1>
    <p class="subtitle">{{ subtitle }}</p>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "builder-sidebar-header",
  props: {
    title: String,
    subtitle: String,
  }
});
</script>

<style scoped>
.header {
  flex-direction: column;
}

.title {
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

.subtitle {
  font-size: 12px;
}
</style>
