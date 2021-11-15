<template>
  <app-camera ref="camera" :orbit-controls="orbitControls" :aspect="aspect"
              @anim-start="startAnimation" @anim-done="stopAnimation"/>
  <app-scene ref="scene" @loaded="onLoad" @focus="focusPlanet"/>
  <div class="sim-ui" v-if="loaded">
    <playback-menu
      :speed="speed"
      :paused="paused"
      @toggle-pause="togglePause"
      @speed-down="decreaseSpeed"
      @speed-up="increaseSpeed"
    />
    <zoom-controller ref="zoomer" @adjust-zoom="zoomCamera($event)"/>
  </div>
</template>

<script lang="ts">
import { BASE_SPEED, MAX_SPEED, MIN_SPEED, } from "@/assets/util/sim.constants";
import PlaybackMenu from "@/components/ui/sim/playback-menu.vue";
import ZoomController from "@/components/ui/sim/zoom-controller.vue";
import { nextTick } from "@vue/runtime-core";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three/src/math/Vector3";
import { defineComponent, getCurrentInstance, onMounted, PropType, ref, } from "vue";
import AppCamera from "./AppCamera.vue";
import AppScene from "./AppScene.vue";


export default defineComponent({
  name: "SceneController",
  components: { ZoomController, PlaybackMenu, AppScene, AppCamera },
  props: {
    orbitControls: Object as PropType<OrbitControls>,
    aspect: Number,
  },
  emits: ["loaded"],
  setup(props) {
    const loaded = ref<boolean>(false);
    const speed = ref<number>(BASE_SPEED);
    const paused = ref<boolean>(false);
    const animating = ref<boolean>(false);
    const lastPause: { by: string | undefined } = { by: undefined };

    function pause() {
      paused.value = true;
    }

    function unpause() {
      paused.value = false;
    }

    function togglePause(event: Event) {
      // Wait for animation to finish and unpause naturally
      if (paused.value === true && lastPause.by === "animation") return;
      if (event instanceof KeyboardEvent) lastPause.by = "keyboard";
      else if (event instanceof MouseEvent) lastPause.by = "mouse";
      paused.value = !paused.value;
    }

    function increaseSpeed() {
      if (speed.value < MAX_SPEED) speed.value += 1;
    }

    function decreaseSpeed() {
      if (speed.value > MIN_SPEED) speed.value -= 1;
    }

    function zoomCamera(zoom: number) {
      camera.value.setZoom(zoom);
    }

    function setupCamera(sceneData) {
      const width = sceneData.furthestObjectDistance * 2.0;
      const height = sceneData.largestObjectSize * 1.5;
      const camPos = new Vector3(width, height, width);
      camera.value.setupCamera(camPos);
    }

    function render() {
      scene.value.animate(paused.value, speed.value);
      camera.value.animate(paused.value, speed.value);
    }

    function focusPlanet(event: MeshMouseEvent) {
      camera.value?.focus(event.component);
    }

    function startAnimation() {
      animating.value = true;
      if (paused.value === false) {
        lastPause.by = "animation";
        pause();
      }
    }

    function stopAnimation() {
      animating.value = false;
      if (paused.value === true && lastPause.by === "animation") unpause();
    }

    onMounted(() => {
      nextTick(() => {
        props.orbitControls.enableDamping = true;
        props.orbitControls.enablePan = true;
        props.orbitControls.enableRotate = true;
        props.orbitControls.enableZoom = true;
      });
    });

    function resize(width: number, height: number) {
      camera.value.update(width / height);
    }

    const scene = ref<typeof AppScene>(null);
    const camera = ref<typeof AppCamera>(null);
    const zoomer = ref<typeof ZoomController>(null);
    const { emit } = getCurrentInstance();

    function onLoad(sceneData) {
      loaded.value = true;
      setupCamera(sceneData);
      emit("loaded");
    }

    window.addEventListener("keydown", (e) => {
      if (animating.value === true) return;
      switch (e.key) {
        case "r":
          camera.value.reset();
          scene.value.reset();
          zoomer.value.reset();
          return;
        case "p":
          togglePause(e);
          return;
        case "<":
          decreaseSpeed();
          return;
        case ">":
          increaseSpeed();
          return;
        case "+":
          camera.value.zoomIn();
          return;
        case "-":
          camera.value.zoomOut();
          return;
      }
    });

    return {
      scene,
      camera,
      zoomer,
      speed,
      paused,
      loaded,
      startAnimation,
      stopAnimation,
      render,
      increaseSpeed,
      decreaseSpeed,
      togglePause,
      zoomCamera,
      focusPlanet,
      onLoad,
      resize,
    };
  },
});
</script>

<style scoped>
.sim-ui {
  animation-duration: 1.67s;
  animation-name: fadeIn;
  animation-fill-mode: forwards;
  opacity: 0;
  animation-delay: 1.33s;
}
</style>
