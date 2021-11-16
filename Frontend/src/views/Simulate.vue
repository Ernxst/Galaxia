<template>
  <page fill>
    <renderer-controller ref="renderer"/>
  </page>
</template>

<script lang="ts">
import RendererController from "@/components/three/engine/RendererController.vue";
import Page from "@/components/ui/layout/page.vue";
import { defineComponent, ref } from "vue";


export default defineComponent({
  name: "Simulate",
  components: { RendererController, Page },
  setup() {
    const renderer = ref<typeof RendererController>(null);
    return { renderer };
  },
});
</script>

<style></style>
