<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    name: "App",
    watch: {
      $route(to, _) {
        if (to.hash) {
          this.$nextTick(() => {
            this.scrollToId(to.hash.slice(1));
          });
        }
      },
    },
    methods: {
      scrollToId(id: string) {
        try {
          const element = document.getElementById(id);
          if (!element) return;
          window.scrollTo({
            top: element.offsetTop,
            behavior: "smooth",
          });
        } catch {
          location.hash = id;
        }
      },
    },
  });
</script>

<style scoped></style>
