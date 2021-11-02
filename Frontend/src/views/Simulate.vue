<template>
  <page fill>
    <renderer ref="renderer" />
  </page>
</template>

<script lang="ts">
  import Renderer from "@/components/three/scene/Renderer.vue";
  import { defineComponent, ref } from "vue";
  import Page from "@/components/ui/layout/page.vue";

  export default defineComponent({
    name: "Simulate",
    components: { Renderer, Page },
    setup() {
      const renderer = ref<typeof Renderer>(null);
      return { renderer };
    },
  });
</script>

<style></style>
