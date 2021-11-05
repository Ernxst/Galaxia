<template>
  <Camera ref="camera" :aspect="aspect" :near="near" :far="far" :fov="fov" />
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
      setDefaultCamPos() {
        // TODO: set default values based on scene
        const camera: PerspectiveCamera = this.$refs.camera.camera;
        camera.position.set(1400, 1400, 1400);
        camera.rotation.order = "YXZ";
        camera.position.multiplyScalar(SCENE_SCALE);
        this.orbitControls.maxDistance = 350;
      },
      reset() {
        this.setDefaultCamPos(); // TODO: Animate reset
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
