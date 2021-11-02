<template>
  <main class="centred" v-bind="$attrs">
    <slot></slot>
  </main>
  <app-footer />
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import AppFooter from "./app-footer.vue";
  export default defineComponent({
    name: "page",
    components: { AppFooter },
  });
</script>

<style scoped>
  main[fill] {
    min-width: 100%;
    width: 100%;
    min-height: 100vh;
    height: 100%;
  }

  main[pad] {
    padding: 16px;
  }

  main[column] {
    flex-direction: column;
  }

  @media (min-width: 480px) {
    main[pad] {
      padding: 24px;
    }
  }
</style>
