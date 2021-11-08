<template>
  <Camera ref="camera" :aspect="aspect" :near="near" :far="far" :fov="fov"/>
</template>

<script lang="ts">
import { zoomIn, zoomOut } from "@/assets/three/camera";
import { FAR, FOV, NEAR } from "@/assets/three/camera/camera.constants";
import { SCENE_SCALE } from "@/assets/util/sim.constants";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Vector3 } from "three/src/math/Vector3";
import { Camera } from "troisjs";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "AppCamera",
  components: { Camera },
  props: {
    aspect: { type: Number, default: 1 },
    orbitControls: Object as PropType<OrbitControls>,
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
    moveTo(pos: Vector3) {
      this.$refs.camera.camera.position.set(pos.x, pos.y, pos.z);
    },
    zoomIn() {
      zoomIn(this.$refs.camera.camera, 1);
    },
    zoomOut() {
      zoomOut(this.$refs.camera.camera, 1);
    },
    setupCamera(camPos: Vector3) {
      this.defaultPos = camPos;
      const camera: PerspectiveCamera = this.$refs.camera.camera;
      camera.position.set(camPos.x, camPos.y, camPos.z);
      camera.position.multiplyScalar(SCENE_SCALE);
      camera.rotation.order = "YXZ";
      this.orbitControls.maxDistance = camPos.x / 5.0;
    },
    // TODO: Animate reset
    reset() {
      const camera: PerspectiveCamera = this.$refs.camera.camera;
      const { x, y, z } = this.defaultPos;
      camera.position.set(x, y, z);
      camera.position.multiplyScalar(SCENE_SCALE);
      camera.rotation.order = "YXZ";
      this.orbitControls.maxDistance = x / 5.0;
    },
    update(aspect: number) {
      // TODO: Fix camera looking at when resizing window to be larger
      const camera: PerspectiveCamera = this.$refs.camera.camera;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      camera.lookAt(this.orbitControls.target);
    },
    animate(paused: boolean, speed: number) {
      this.orbitControls.update();
    },
  },
});
</script>

<style scoped></style>
