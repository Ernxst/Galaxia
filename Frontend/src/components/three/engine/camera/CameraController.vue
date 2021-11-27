<template>
  <Camera ref="camera"
          :aspect="aspect"
          :far="far"
          :fov="fov"
          :near="near">
    <cam-animation-controller
      ref="animator"
      :orbit-controls="orbitControls"
      @anim-start="startAnimation"
      @anim-done="stopAnimation"
      @adjust-zoom="adjustZoom"
    />
    <template v-if="trackGestures">
      <gesture-controller ref="controller" />
    </template>
  </Camera>
</template>

<script lang="ts">
import { setZoom, zoomIn, zoomOut } from "@/assets/three/camera";
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
  emits: ["animStart", "animDone", "adjustZoom", "pause", "play"],
  props: {
    aspect: { type: Number, default: 1 },
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
    startAnimation() {
      this.$emit("animStart");
    },
    stopAnimation() {
      this.$emit("animDone");
    },
    adjustZoom(event) {
      this.$emit("adjustZoom", event);
    },
    pause() {
      this.$emit("pause");
    },
    play() {
      this.$emit('play');
    },
    moveTo(pos: Vector3) {
      this.$refs.camera.camera.position.set(pos.x, pos.y, pos.z);
    },
    focus(object: typeof CelestialBody) {
      this.$refs.animator.focus(object);
    },
    setZoom(zoom: number) {
      setZoom(this.$refs.camera.camera, zoom);
    },
    zoomIn() {
      zoomIn(this.$refs.camera.camera, 1);
    },
    zoomOut() {
      zoomOut(this.$refs.camera.camera, 1);
    },
    setupCamera(camPos: Vector3, models: Array<typeof CelestialBody>) {
      this.defaultPos = camPos;
      const camera: PerspectiveCamera = this.$refs.camera.camera;
      camera.position.set(camPos.x, camPos.y, camPos.z);
      camera.position.multiplyScalar(SCENE_SCALE);
      camera.rotation.order = "YXZ";
      this.setupControls(camPos.x);
      if (this.showTour)
        this.$refs.animator.universeTour(models);
    },
    setupControls(camX: number) {
      this.orbitControls.enableDamping = true;
      this.orbitControls.enablePan = true;
      this.orbitControls.enableRotate = true;
      this.orbitControls.enableZoom = true;
      this.orbitControls.maxDistance = camX / 5.0;
    },
    reset() {
      this.$refs.animator.reset();
    },
    animate(paused: boolean, speed: number) {
      this.orbitControls.update();
      this.$refs.animator.render(paused, speed);
      if (this.trackGestures)
        this.$refs.controller.detectVideo();
    },
  },
});
</script>

<style scoped></style>
