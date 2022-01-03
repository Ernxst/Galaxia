<template>
  <section class="preview centred">
    <span v-if="modelValue">Previewing: <strong>{{ modelValue.name }}</strong></span>
    <span class="speed"><strong>1</strong> Frame = <strong>{{ timeStep }}</strong> Earth Days</span>
    <RendererController :scene-component="sceneComponent"
                        :scene-props="{ data: modelValue, type: type, }"
                        :teleport="false"
                        :controls="true"
                        :enable-pan="false" />
    <slot></slot>
  </section>
</template>

<script lang="ts">
import { TIME_STEP } from "@/assets/util/sim.constants";
import RendererController from "@/components/three/engine/RendererController.vue";
import Preview3D from "@/views/create/builder/preview/preview-3d.vue";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "builder-preview",
  components: { RendererController },
  props: {
    modelValue: Object,
    type: String as PropType<"star" | "moon" | "planet">,
  },
  computed: {
    sceneComponent() {
      return Preview3D;
    },
    timeStep(): number {
      return TIME_STEP;
    }
  },
});
</script>

<style scoped>
.preview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, .16);
  border: 1px solid var(--main);
}

.preview span {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--main);
  color: var(--page-bg);
  font-size: 11px;
  padding: 4px 8px;
  z-index: 6;
}

.preview .speed {
  bottom: 0;
  right: 0;
  top: unset;
  left: unset;
  font-size: 10px;
}
</style>
