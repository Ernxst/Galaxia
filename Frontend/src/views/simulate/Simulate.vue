<template>
  <page :bg="false"
        :footer="false"
        fill>
    <renderer-controller ref="renderer"
                         v-if="starSystem.name"
                         :controls="true"
                         :scene-component="sceneComponent"
                         :scene-props="{ starSystem: starSystem}"
                         :show-tour="true"
                         :track-gestures="false"
                         :ui="true">
    </renderer-controller>
    <loading-popup text="Fetching Simulation"
                   :visible="loading" />
  </page>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import RendererController from "@/components/three/engine/RendererController.vue";
import Page from "@/components/ui/layout/page.vue";
import { useStore } from "@/store/store";
import LoadingPopup from "@/views/sign-in/loading-popup.vue";
import SimulateScene from "@/views/simulate/simulate-scene.vue";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";


export default defineComponent({
  name: "Simulate",
  components: { LoadingPopup, RendererController, Page },
  props: {
    simulationID: { type: Number, required: true },
    username: String,
  },
  computed: {
    sceneComponent() {
      return SimulateScene;
    }
  },
  setup(props) {
    const renderer = ref<typeof RendererController>(null);

    const store = useStore();
    const router = useRouter();
    const starSystem = ref<StarSystem>({});
    const loading = ref<boolean>(true);

    store.dispatch("starSystem/fetchSimulation", props.simulationID)
      .then((simulation) => {
        loading.value = false;
        starSystem.value = simulation;
      })
      .catch((error) => {
        loading.value = false;
        alert(error);
        if (error.includes("Could not find a simulation with ID"))
          router.push({ name: "home", params: { username: props.username } });
      });

    return { renderer, starSystem, loading, };
  },
});
</script>

<style></style>
