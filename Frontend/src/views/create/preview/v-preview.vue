<template>
  <div class="previewer centred">
    <section class="preview centred">
      <span class="label">Previewing: <strong>{{ data.name }}</strong></span>
      <span class="label speed"><strong>1</strong> Frame = <strong>{{ timeStep }}</strong></span>
      <RendererController :controls="true"
                          :enable-pan="false"
                          :scene-component="sceneComponent"
                          :scene-props="sceneProps"
                          :teleport="false" />
    </section>
    <span :data-show="!previewing"
          class="no-preview centred abs">{{ message }}</span>
  </div>
</template>

<script lang="ts">
import { EARTH_DAY_LENGTH } from "@/assets/util/celestial.constants";
import { TIME_STEP } from "@/assets/util/sim.constants";
import RendererController from "@/components/three/engine/RendererController.vue";
import { useStore } from "@/store/store";
import PreviewScene from "@/views/create/preview/preview-scene.vue";
import { CelestialBodyData, Simulation } from "@/views/create/util/types";
import { computed, defineComponent, PropType, toRefs } from "vue";


export default defineComponent({
  name: "v-preview",
  components: { RendererController },
  props: {
    data: Object as PropType<CelestialBodyData>,
    previewing: Boolean,
  },
  setup(props) {
    const secondsPerFrame = TIME_STEP * EARTH_DAY_LENGTH;
    const minutes = Math.floor(secondsPerFrame / 60.0);
    const seconds = secondsPerFrame % 60.0;
    const timeStep = `${minutes} MINS ${seconds}s`;

    const store = useStore();
    const { data } = toRefs(props);
    const modelType = computed(() => store.getters["simulation/modelType"]);
    const sceneProps = computed(() => ({ data: data.value, type: modelType.value }));

    const message = computed(() => {
      if (modelType.value && modelType.value !== 'star') {
        let array: CelestialBodyData[];
        if (modelType.value === 'moon')
          array = store.getters["simulation/moons"];
        else {
          const simulation: Simulation = store.getters["simulation/simulation"];
          array = modelType.value === 'planet' ? simulation.planets : simulation.asteroidBelts;
        }
        const preposition = modelType.value === 'asteroid belt' ? 'an' : 'a';
        if (array.length > 0) return `Click ${preposition} ${modelType.value} button in the builder menu to preview`;
        return `Use the builder menu to add a new ${modelType.value} to the simulation`;
      }
      return "No preview available for this step";
    });

    return { sceneComponent: PreviewScene, sceneProps, timeStep, message, modelType };
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

.label {
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

.speed strong {
  text-transform: none;
}

.no-preview {
  height: 100%;
  text-align: center;
  z-index: 13;
  background: var(--page-bg);
  display: none;
}

.no-preview[data-show=true] {
  display: flex;
}

.previewer, .no-preview {
  padding: 24px 16px;
  width: 100%;
  height: 100%;
}

@media (min-width: 768px) {
  .previewer, .no-preview {
    padding: 32px;
  }
}
</style>
