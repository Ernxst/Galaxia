<template>
  <template v-if="dataLoaded">
    <Galaxy
      ref="galaxy"
      :star-system="starSystemName"
      name="Milky Way"
      @scene-loaded="onLoad"
      @focus-on-body="$emit('focus', $event)"
    />
  </template>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import { getAssetsInSystem } from "@/assets/three/loaders";
import Galaxy from "@/components/three/celestial/containers/galaxy.vue";
import { useStore } from "@/store/store";
import { Vector3 } from "three/src/math/Vector3";
import { defineComponent, getCurrentInstance, onMounted, ref } from "vue";


export default defineComponent({
  name: "simulate-scene",
  emits: ["dataLoaded", "focus", "loaded"],
  components: { Galaxy },
  props: {
    starSystemName: { type: String, required: true, default: "Solar System" }
  },
  setup(props) {
    const starSystem = ref<StarSystem>({});
    const galaxy = ref<typeof Galaxy>(null);
    const dataLoaded = ref<boolean>(false);
    const { emit } = getCurrentInstance();

    onMounted(async () => {
      const store = useStore();
      await store.dispatch("starSystem/fetchAllStarSystems");
      starSystem.value = store.getters["starSystem/starSystem"](props.starSystemName);
      dataLoaded.value = true;
      emit("dataLoaded", getAssetsInSystem(starSystem.value));
    });

    function onLoad(sceneData) {
      const width = sceneData.furthestObjectDistance * 2.0;
      const height = sceneData.largestObjectSize * 1.5;
      const camPos = new Vector3(width, height, width);
      emit("loaded", { camPos, models: sceneData.models, starSystem: starSystem.value });
    }

    function animate(speed: number) {
      galaxy.value.evolve(speed);
    }

    function findComponent(name: string, isStar: boolean, isMoon: boolean) {
      return galaxy.value.getComponentByName(name, isStar, isMoon);
    }

    return {
      animate,
      findComponent,
      onLoad,
      dataLoaded,
      galaxy,
      starSystem,
    };
  }
});
</script>

<style scoped>

</style>
