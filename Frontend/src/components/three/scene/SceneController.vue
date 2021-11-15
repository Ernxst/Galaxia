<template>
  <app-camera ref="camera" :orbit-controls="orbitControls" :aspect="aspect"
              @anim-start="startAnimation" @anim-done="stopAnimation"
              @adjust-zoom="zoomCamera"/>
  <app-scene ref="scene" @loaded="onLoad" @focus="focusPlanet"/>
  <template v-if="loaded">
    <simulation-ui ref="gui" @zoom-update="zoomCamera"/>
  </template>
</template>

<script lang="ts">
import { MeshMouseEvent } from "@/@types/three/mesh-mouse-event";
import SimulationUi from "@/components/ui/sim/simulation-ui.vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three/src/math/Vector3";
import { defineComponent, getCurrentInstance, PropType, ref, } from "vue";
import AppCamera from "./AppCamera.vue";
import AppScene from "./AppScene.vue";


export default defineComponent({
  name: "SceneController",
  components: { SimulationUi, AppScene, AppCamera },
  props: {
    orbitControls: Object as PropType<OrbitControls>,
    aspect: Number,
  },
  emits: ["loaded"],
  setup() {
    const scene = ref<typeof AppScene>(null);
    const camera = ref<typeof AppCamera>(null);
    const gui = ref<typeof SimulationUi>(null);
    const { emit } = getCurrentInstance();
    const loaded = ref<boolean>(false);

    function onLoad(sceneData) {
      const width = sceneData.furthestObjectDistance * 2.0;
      const height = sceneData.largestObjectSize * 1.5;
      camera.value.setupCamera(new Vector3(width, height, width));
      loaded.value = true;
      emit("loaded");
    }

    function resize(width: number, height: number) {
      camera.value.update(width / height);
    }

    function focusPlanet(event: MeshMouseEvent) {
      gui.value.disableZoom();
      camera.value.focus(event.component);
    }

    function zoomCamera(zoom: number) {
      camera.value.setZoom(zoom);
      gui.value.setZoom(zoom);
    }

    function startAnimation() {
      gui.value.startAnimation();
    }

    function stopAnimation() {
      gui.value.stopAnimation();
    }

    function render() {
      const paused = gui.value.paused;
      const speed = gui.value.speed;
      scene.value.animate(paused, speed);
      camera.value.animate(paused, speed);
    }

    window.addEventListener("keydown", (e) => {
      if (gui.value.animating) return;
      switch (e.key) {
        case "r":
          camera.value.reset();
          scene.value.reset();
          gui.value.reset();
          return;
        case "p":
          gui.value.togglePause(e);
          return;
        case "<":
          gui.value.decreaseSpeed();
          return;
        case ">":
          gui.value.increaseSpeed();
          return;
        case "+":
          gui.value.zoomIn();
          return;
        case "-":
          gui.value.zoomOut();
          return;
      }
    });

    return {
      scene,
      camera,
      gui,
      loaded,
      startAnimation,
      stopAnimation,
      render,
      zoomCamera,
      focusPlanet,
      onLoad,
      resize,
    };
  },
});
</script>

<style scoped></style>
