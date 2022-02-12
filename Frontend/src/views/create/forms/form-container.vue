<template>
  <div class="celestial-props">
    <div class="header">
      <h2>{{ header }}</h2>
      <p>{{ description }}</p>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "form-container",
  props: {
    header: String,
    description: String
  }
});
</script>

<style scoped>
.content {
  display: grid;
  grid-gap: 42px;
}

h2 {
  margin-top: 0;
  background: var(--main);
  color: var(--page-bg);
  padding: 2px 6px;
  font-size: 18px;
}

h2, p {
  text-align: center;
  width: 100%;
}

p {
  margin-top: 0;
  font-size: 11px;
}

@media (min-width: 768px) {
  h2, p {
    text-align: left;
  }
}
</style>
