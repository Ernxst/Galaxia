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
    <template v-if="assetsLoaded">
      <navbar
        ref="navbar"
        :stars="[currentSystem.star]"
        :planets="currentSystem.planets"
        @follow="followPlanet"
      />
    </template>
  </Scene>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import { getAssetsInSystem } from "@/assets/three/loaders";
import { SCENE_SCALE } from "@/assets/util/sim.constants";
import Navbar from "@/components/ui/sim/navbar/Navbar.vue";
import { useStore } from "@/store/store";
import { Scene as ThreeScene } from "three/src/scenes/Scene";
import { Scene } from "troisjs";
import { defineComponent, getCurrentInstance, ref } from "vue";
import Galaxy from "../celestial/containers/galaxy.vue";
import Loader from "./loader.vue";


export default defineComponent({
  name: "AppScene",
  components: { Navbar, Scene, Loader, Galaxy },
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
    const navbar = ref<typeof Navbar>(null);

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
      navbar.value.toggle(undefined);
    }

    function followPlanet(event) {
      const { name, isStar, isMoon } = event;
      const component = galaxy.value.getComponentByName(name, isStar, isMoon);
      emit("focus", { component });
    }

    return {
      animate,
      onLoad,
      followPlanet,
      reset,
      assetsToLoad,
      assetsLoaded,
      galaxy,
      scene,
      navbar,
      currentSystemName,
      currentSystem,
    };
  },
});
</script>

<style scoped></style>
