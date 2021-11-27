<template>
  <page :bg="false"
        fill>
    <renderer-controller ref="renderer"
                         :ui="true"
                         :controls="true"
                         :track-gestures="false"
                         :scene-component="sceneComponent"
                         :scene-props="{ starSystemName: starSystem}">
    </renderer-controller>
  </page>
</template>

<script lang="ts">
import RendererController from "@/components/three/engine/RendererController.vue";
import Page from "@/components/ui/layout/page.vue";
import SimulateScene from "@/views/simulate/simulate-scene.vue";
import { defineComponent, ref } from "vue";


export default defineComponent({
  name: "Simulate",
  components: { RendererController, Page },
  computed: {
    starSystem(): string {
      return "Solar System";
    },
    sceneComponent() {
      return SimulateScene;
    }
  },
  setup() {
    const renderer = ref<typeof RendererController>(null);
    return { renderer };
  },
});
</script>

<style></style>
