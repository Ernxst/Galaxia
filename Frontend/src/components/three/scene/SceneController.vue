<template>
  <app-camera ref="camera" :orbit-controls="orbitControls" :aspect="aspect" />
  <app-scene ref="scene" @loaded="onLoad" />
</template>

<script lang="ts">
  import {
    BASE_SPEED,
    MAX_SPEED,
    MIN_SPEED,
  } from "@/assets/util/sim.constants";
  import { nextTick } from "@vue/runtime-core";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import {
    defineComponent,
    getCurrentInstance,
    onMounted,
    PropType,
    ref,
  } from "vue";
  import AppCamera from "./AppCamera.vue";
  import AppScene from "./AppScene.vue";

  export default defineComponent({
    name: "SceneController",
    components: { AppScene, AppCamera },
    props: {
      orbitControls: Object as PropType<OrbitControls>,
      aspect: Number,
    },
    emits: ["loaded"],
    setup(props) {
      const speed = ref<number>(BASE_SPEED);
      const paused = ref<boolean>(false);
      const animating = ref<boolean>(false);
      const lastPause = { by: undefined };

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

      function setDefaultCamPos() {
        camera.value.setDefaultCamPos();
      }

      function render() {
        scene.value.animate(paused.value, speed.value);
        camera.value.animate(paused.value, speed.value);
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
      const { emit } = getCurrentInstance();

      function onLoad() {
        // TODO: Other initialisation tasks
        setDefaultCamPos();
        emit("loaded");
      }

      window.addEventListener("keydown", (e) => {
        if (animating.value === true) return;
        switch (e.key) {
          case "r":
            camera.value.reset();
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
        speed,
        paused,
        setDefaultCamPos,
        startAnimation,
        stopAnimation,
        render,
        increaseSpeed,
        decreaseSpeed,
        togglePause,
        onLoad,
        resize,
      };
    },
  });
</script>

<style scoped></style>
