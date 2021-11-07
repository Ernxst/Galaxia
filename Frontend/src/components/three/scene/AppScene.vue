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
    />
  </Scene>
</template>

<script lang="ts">
  import { SCENE_SCALE } from "@/assets/util/sim.constants";
  import { useStore } from "@/store/store";
  import { Scene as ThreeScene } from "three/src/scenes/Scene";
  import { Scene } from "troisjs";
  import { defineComponent, getCurrentInstance, ref } from "vue";
  import Galaxy from "../celestial/containers/galaxy.vue";
  import Loader from "./loader.vue";
  import { getAssetsInSystem } from "@/assets/three/loaders/index";

  export default defineComponent({
    name: "AppScene",
    components: { Scene, Loader, Galaxy },
    emits: ["loaded"],
    created() {
      this.$store.dispatch("starSystem/fetchAllStarSystems");
    },
    setup() {
      const currentSystemName = ref<string>("Solar System");
      const store = useStore();
      const currentSystem = store.getters["starSystem/starSystem"](
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

      function onLoad() {
        const threeScene: ThreeScene = scene.value.scene;
        threeScene.scale.multiplyScalar(SCENE_SCALE);
        emit("loaded");
      }

      return {
        animate,
        onLoad,
        assetsToLoad,
        assetsLoaded,
        galaxy,
        scene,
        currentSystemName,
      };
    },
  });
</script>

<style scoped></style>
