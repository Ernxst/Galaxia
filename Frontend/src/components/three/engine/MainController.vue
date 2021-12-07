<template>
  <camera-controller ref="camera"
                     :orbit-controls="orbitControls"
                     :show-tour="showTour"
                     :track-gestures="trackGestures"
                     @pause="pause"
                     @play="play"
                     @anim-start="startAnimation"
                     @anim-done="stopAnimation"
                      />
  <scene-controller ref="scene"
                    :scene-component="sceneComponent"
                    :scene-props="sceneProps"
                    @focus="planetMeshClicked"
                    @loaded="onSceneLoad" />

  <template v-if="loaded && ui">
    <ui-controller ref="gui"
                   @intro-complete="startTour"
                   @reset="reset"
                   @follow-body="navButtonClicked"
                   @open-factfile="openFactfile"
                   @close-factfile="closeFactfile" />
  </template>
</template>

<script lang="ts">
import { MeshMouseEvent } from "@/@types/three/mesh-mouse-event";
import { BASE_SPEED } from "@/assets/util/sim.constants";
import UiController from "@/components/ui/sim/ui-controller.vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { defineComponent, PropType, ref, } from "vue";
import CameraController from "./camera/CameraController.vue";
import SceneController from "./SceneController.vue";


export default defineComponent({
  name: "MainController",
  components: { UiController, SceneController, CameraController },
  emits: ["loaded"],
  props: {
    orbitControls: Object as PropType<OrbitControls>,
    sceneComponent: Object,
    sceneProps: { type: Object, default: {} },
    ui: { type: Boolean, default: false },
    trackGestures: { type: Boolean, default: false },
    showTour: { type: Boolean, default: false },
  },
  data() {
    return {
      sceneLoaded: false,
      controlsLoaded: false,
    };
  },
  computed: {
    loaded() {
      return this.sceneLoaded && this.controlsLoaded;
    }
  },
  watch: {
    orbitControls() {
      this.controlsLoaded = true;
    },
    loaded() {
      this.$emit("loaded");
      if (this.ui)
        setTimeout(() => {
          this.$refs.gui.startIntro();
        }, 1500);
    }
  },
  methods: {
    onSceneLoad(sceneData) {
      this.$refs.camera.setupCamera(sceneData.camPos, sceneData.models);
      this.sceneLoaded = true;
      if (this.ui)
        this.$nextTick(() => {
          this.$refs.gui.setStarSystem(sceneData.starSystem);
        });
    }
  },
  setup(props) {
    const scene = ref<typeof SceneController>(null);
    const camera = ref<typeof CameraController>(null);
    const gui = ref<typeof UiController>(null);

    function startTour() {
      camera.value.startTour();
    }

    function planetMeshClicked(event: MeshMouseEvent) {
      const { name, isStar, isMoon } = event.component;
      if (gui.value.animating || !gui.value.shouldFollow(name)) return;
      gui.value.followBody(name, isStar, isMoon);
      camera.value.focus(event.component);
    }

    function navButtonClicked(event) {
      const { name, isStar, isMoon } = event;
      const component = scene.value.findComponent(name, isStar, isMoon);
      planetMeshClicked({ component });
    }

    function startAnimation() {
      if (props.ui)
        gui.value.startAnimation();
    }

    function stopAnimation() {
      if (props.ui)
        gui.value.stopAnimation();
    }

    function pause() {
      gui.value.pause();
    }

    function play() {
      gui.value.unpause();
    }

    function openFactfile() {
      camera.value.openFactfile();
    }

    function closeFactfile() {
      camera.value.closeFactfile();
    }

    function reset() {
      camera.value.reset();
      gui.value.reset();
    }

    function render() {
      const paused = props.ui ? gui.value.paused : false;
      const speed = props.ui ? gui.value.speed : BASE_SPEED;
      scene.value.animate(paused, speed);
      camera.value.animate(paused, speed);
    }

    return {
      scene,
      camera,
      gui,
      openFactfile,
      closeFactfile,
      startAnimation,
      stopAnimation,
      render,
      startTour,
      planetMeshClicked,
      navButtonClicked,
      reset,
      pause,
      play,
    };
  },
});
</script>

<style scoped></style>
