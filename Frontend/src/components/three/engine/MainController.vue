<template>
  <camera-controller ref="camera" :aspect="aspect" :orbit-controls="orbitControls"
                     @pause="pause" @play="play"
                     @anim-start="startAnimation" @anim-done="stopAnimation" @adjust-zoom="zoomCamera"/>
  <scene-controller ref="scene" @focus="focusPlanet" @loaded="onLoad"/>
  <template v-if="loaded">
    <ui-controller ref="gui" @reset="reset" @zoom-update="zoomCamera" @follow-body="followBody"/>
  </template>
</template>

<script lang="ts">
import { MeshMouseEvent } from "@/@types/three/mesh-mouse-event";
import UiController from "@/components/ui/sim/ui-controller.vue";
import { nextTick } from "@vue/runtime-core";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three/src/math/Vector3";
import { defineComponent, getCurrentInstance, PropType, ref, } from "vue";
import CameraController from "./camera/CameraController.vue";
import SceneController from "./SceneController.vue";


export default defineComponent({
  name: "MainController",
  components: { UiController, SceneController, CameraController },
  props: {
    orbitControls: Object as PropType<OrbitControls>,
    aspect: Number,
  },
  emits: ["loaded"],
  setup() {
    const scene = ref<typeof SceneController>(null);
    const camera = ref<typeof CameraController>(null);
    const gui = ref<typeof UiController>(null);
    const { emit } = getCurrentInstance();
    const loaded = ref<boolean>(false);

    function onLoad(sceneData) {
      const width = sceneData.furthestObjectDistance * 2.0;
      const height = sceneData.largestObjectSize * 1.5;
      camera.value.setupCamera(new Vector3(width, height, width));
      loaded.value = true;
      nextTick(() => {
        gui.value.setStarSystem(scene.value.currentSystem);
      });
      emit("loaded");
    }

    function resize(width: number, height: number) {
      camera.value.update(width / height);
    }

    function focusPlanet(event: MeshMouseEvent) {
      if (gui.value.animating) return;
      gui.value.disableZoom();
      const { name, isStar, isMoon } = event.component;
      gui.value.followBody(name, isStar, isMoon);
      camera.value.focus(event.component);
    }

    function followBody(event) {
      const { name, isStar, isMoon } = event;
      const component = scene.value.findComponent(name, isStar, isMoon);
      focusPlanet({ component });
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

    function pause() {
      gui.value.pause();
    }

    function play() {
      gui.value.unpause();
    }

    function reset() {
      camera.value.reset();
      scene.value.reset();
      gui.value.reset();
    }

    function render() {
      const paused = gui.value.paused;
      const speed = gui.value.speed;
      scene.value.animate(paused, speed);
      camera.value.animate(paused, speed);
    }

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
      followBody,
      onLoad,
      resize,
      reset,
      pause,
      play,
    };
  },
});
</script>

<style scoped></style>
