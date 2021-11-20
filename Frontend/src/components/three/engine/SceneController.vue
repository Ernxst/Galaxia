<template>
  <Scene ref="scene">
    <template v-if="dataLoaded">
      <loader
        v-if="!assetsLoaded"
        :assets-to-load="assetsToLoad"
        @assets-loaded="assetsLoaded = true"
      />
      <template>
        <Galaxy
          ref="galaxy"
          :star-system="currentSystemName"
          name="Milky Way"
          @scene-loaded="onLoad"
          @focus-on-body="$emit('focus', $event)"
        />
      </template>
    </template>
  </Scene>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import { getAssetsInSystem } from "@/assets/three/loaders";
import { SCENE_SCALE } from "@/assets/util/sim.constants";
import { useStore } from "@/store/store";
import { Scene as ThreeScene } from "three/src/scenes/Scene";
import { Scene } from "troisjs";
import { defineComponent, getCurrentInstance, onMounted, ref } from "vue";
import Galaxy from "../celestial/containers/galaxy.vue";
import Loader from "./loader.vue";


export default defineComponent({
  name: "SceneController",
  components: { Scene, Loader, Galaxy },
  emits: ["loaded", "focus"],
  created() {
  },
  setup() {
    const currentSystemName = ref<string>("Solar System");
    const currentSystem = ref<StarSystem>({});
    const dataLoaded = ref<boolean>(false);
    const assetsToLoad = ref<number>(0);

    onMounted(async () => {
      const store = useStore();
      await store.dispatch("starSystem/fetchAllStarSystems");
      currentSystem.value = store.getters["starSystem/starSystem"](
        currentSystemName.value
      );
      assetsToLoad.value = getAssetsInSystem(currentSystem.value);
      dataLoaded.value = true;
    });

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
      dataLoaded,
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
