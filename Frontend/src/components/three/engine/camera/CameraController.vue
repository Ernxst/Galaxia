<template>
  <Camera ref="camera"
          :far="far"
          :fov="fov"
          :near="near">
    <cam-animation-controller
      ref="animator"
      :orbit-controls="orbitControls"
      @anim-start="$emit('animStart')"
      @anim-done="$emit('animDone')"
    />
    <template v-if="trackGestures">
      <gesture-controller ref="controller" />
    </template>
  </Camera>
</template>

<script lang="ts">
import { FAR, FOV, NEAR } from "@/assets/three/camera/camera.constants";
import { SCENE_SCALE } from "@/assets/util/sim.constants";
import CelestialBody from "@/components/three/celestial/base/celestial-body.vue";
import CamAnimationController from "@/components/three/engine/camera/CamAnimationController.vue";
import GestureController from "@/components/three/engine/camera/GestureController.vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Vector3 } from "three/src/math/Vector3";
import { Camera } from "troisjs";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "CameraController",
  components: { GestureController, CamAnimationController, Camera },
  emits: ["animStart", "animDone", "pause", "play"],
  props: {
    orbitControls: Object as PropType<OrbitControls>,
    trackGestures: { type: Boolean, default: false },
    showTour: { type: Boolean, default: false },
  },
  data() {
    return {
      near: NEAR as number,
      far: FAR as number,
      fov: FOV as number,
      defaultPos: new Vector3(),
      models: [],
    };
  },
  methods: {
    getCamera(): PerspectiveCamera {
      return this.$refs.camera.camera;
    },
    openFactfile() {
      this.$refs.animator.openFactfile();
    },
    closeFactfile() {
      this.$refs.animator.closeFactfile();
    },
    focus(object: typeof CelestialBody) {
      this.$refs.animator.focus(object);
    },
    setupCamera(camPos: Vector3, models: Array<typeof CelestialBody>) {
      const camera: PerspectiveCamera = this.$refs.camera.camera;
      camera.position.set(camPos.x, camPos.y, camPos.z);
      camera.position.multiplyScalar(SCENE_SCALE)
      this.$refs.animator.camera = camera.clone();
      this.$refs.animator.defaultPos = camPos.clone();
      this.models = models;
      this.setupControls(camPos.length(), this.$refs.animator.camera);
    },
    startTour() {
      if (this.showTour)
        this.$refs.animator.universeTour(this.models);
    },
    setupControls(dist: number, camera: PerspectiveCamera) {
      const controls: OrbitControls = this.orbitControls;
      controls.object = camera;
      controls.enableDamping = true;
      controls.maxDistance = dist * SCENE_SCALE;
    },
    reset() {
      this.$refs.animator.reset();
    },
    animate(paused: boolean, speed: number) {
      this.orbitControls.update();
      this.$refs.animator.render(paused);
      const camera: PerspectiveCamera = this.$refs.camera.camera;
      const zoom = camera.zoom;
      camera.copy(this.$refs.animator.camera);
      camera.zoom = zoom;
      camera.updateProjectionMatrix();
      if (this.trackGestures)
        this.$refs.controller.detectVideo();
    },
  },
});
</script>

<style scoped></style>
