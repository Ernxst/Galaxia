<template>
  <Scene ref="scene">
    <loader
      v-if="!assetsLoaded"
      :assets-to-load="assetsToLoad"
      @assets-loaded="assetsLoaded = true"
    />
    <Galaxy
      ref="galaxy"
      name="Milky Way"
      :star-system="currentSystemName"
      @scene-loaded="onLoad"
      @focus-on-body="$emit('focus', $event)"
    />
  </Scene>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import { getAssetsInSystem } from "@/assets/three/loaders";
import { SCENE_SCALE } from "@/assets/util/sim.constants";
import { useStore } from "@/store/store";
import { Scene as ThreeScene } from "three/src/scenes/Scene";
import { Scene } from "troisjs";
import { defineComponent, getCurrentInstance, ref } from "vue";
import Galaxy from "../celestial/containers/galaxy.vue";
import Loader from "./loader.vue";


export default defineComponent({
  name: "AppScene",
  components: { Scene, Loader, Galaxy },
  emits: ["loaded", "focus"],
  created() {
    this.$store.dispatch("starSystem/fetchAllStarSystems");
  },
  setup() {
    const currentSystemName = ref<string>("Solar System");
    const store = useStore();
    const currentSystem: StarSystem = store.getters["starSystem/starSystem"](
      currentSystemName.value
    );

    const assetsToLoad = getAssetsInSystem(currentSystem);
    const assetsLoaded = ref(false);
    const scene = ref<typeof Scene>(null);
    const galaxy = ref<typeof Galaxy>(null);

    function animate(paused: boolean, speed: number) {
      if (!paused) galaxy.value.evolve(speed);
    }

    const { emit } = getCurrentInstance();

    function onLoad(sceneData) {
      const threeScene: ThreeScene = scene.value.scene;
      threeScene.scale.multiplyScalar(SCENE_SCALE);
      emit("loaded", sceneData);
    }

    function reset() {
    }

    function findComponent(name: string, isStar: boolean, isMoon: boolean) {
      return galaxy.value.getComponentByName(name, isStar, isMoon);
    }

    return {
      animate,
      onLoad,
      findComponent,
      reset,
      assetsToLoad,
      assetsLoaded,
      galaxy,
      scene,
      currentSystemName,
      currentSystem,
    };
  },
});
</script>

<style scoped></style>
