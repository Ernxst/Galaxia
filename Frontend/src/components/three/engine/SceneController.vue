<template>
  <Scene ref="scene">
    <template v-if="dataLoaded">
      <teleport to="body" :disabled="!teleport">
        <loader
          v-if="!assetsLoaded"
          :assets-to-load="assetsToLoad"
          @assets-loaded="assetsLoaded = true"
        />
      </teleport>
    </template>
    <component :is="sceneComponent"
               ref="app"
               v-bind="sceneProps"
               @focus="$emit('focus', $event)"
               @loaded="onSceneLoad"
               @data-loaded="onDataLoad" />
  </Scene>
</template>

<script lang="ts">
import { SCENE_SCALE } from "@/assets/util/sim.constants";
import { Scene as ThreeScene } from "three/src/scenes/Scene";
import { Scene } from "troisjs";
import { defineComponent, getCurrentInstance, ref } from "vue";
import Loader from "./loader.vue";


export default defineComponent({
  name: "SceneController",
  components: { Scene, Loader },
  props: {
    sceneComponent: Object,
    sceneProps: { type: Object, default: {} },
    teleport: { type: Boolean, default: true },
  },
  emits: ["loaded", "focus"],
  setup() {
    const scene = ref<typeof Scene>(null);
    const app = ref(null);
    const dataLoaded = ref<boolean>(false);
    const assetsToLoad = ref<number>(0);
    const assetsLoaded = ref(false);
    const { emit } = getCurrentInstance();

    function onDataLoad(assets: number) {
      assetsToLoad.value = assets;
      dataLoaded.value = true;
    }

    function onSceneLoad(sceneData) {
      const threeScene: ThreeScene = scene.value.scene;
      threeScene.scale.multiplyScalar(SCENE_SCALE);
      emit("loaded", sceneData);
    }

    function animate(paused: boolean, speed: number) {
      if (!paused) app.value.animate(speed);
    }

    function findComponent(name: string, isStar: boolean, isMoon: boolean) {
      return app.value.findComponent(name, isStar, isMoon);
    }

    return {
      animate,
      findComponent,
      onDataLoad,
      onSceneLoad,
      dataLoaded,
      assetsToLoad,
      assetsLoaded,
      app,
      scene,
    };
  },
});
</script>

<style scoped></style>
