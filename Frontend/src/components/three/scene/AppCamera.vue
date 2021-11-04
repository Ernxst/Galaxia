<template>
  <Camera ref="camera" :aspect="aspect" :near="near" :far="far" :fov="fov" />
</template>

<script lang="ts">
  import { zoomIn, zoomOut } from "@/assets/three/camera";
  import { FAR, FOV, NEAR } from "@/assets/three/camera/camera.constants";
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
        const camera: PerspectiveCamera = this.$refs.camera.camera;
        camera.position.set(700, 0, 700);
        camera.rotation.order = "YXZ";
        camera.lookAt(0, 0, 0);
        this.orbitControls.target.set(0, 0, 0);
      },
      reset() {
        this.setDefaultCamPos(); // TODO: Animate reset
      },
      animate(paused: boolean, speed: number) {
        this.orbitControls.update();
      },
    },
  });
</script>

<style scoped></style>
