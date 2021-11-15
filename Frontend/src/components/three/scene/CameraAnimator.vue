<template></template>

<script lang="ts">
import { computeCentreAndSize } from "@/assets/three";
import { setZoom } from "@/assets/three/camera";
import { BASE_ZOOM } from "@/assets/three/camera/camera.constants";
import { SCENE_SCALE } from "@/assets/util/sim.constants";
import CelestialBody from "@/components/three/celestial/base/celestial-body.vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";
import { defineComponent, PropType } from "vue";


interface MoveCameraParams {
  object: { position: Vector3 },
  offset: Vector3,
  onStart?: Function,
  onComplete: Function
}

export default defineComponent({
  name: "CameraAnimator",
  emits: ["animStart", "animDone", "adjustZoom"],
  props: {
    orbitControls: Object as PropType<OrbitControls>,
  },
  data() {
    return {
      target: null as typeof CelestialBody,
      centre: new Vector3()
    };
  },
  methods: {
    // TODO: Camera does not properly zoom into the moon, uranus and neptune
    moveCamera({ object, offset, onStart, onComplete }: MoveCameraParams) {
      this.$emit("animStart");
      this.orbitControls.minDistance = 0;
      onStart?.();

      this.orbitControls.target = object.position;
      const camera: PerspectiveCamera = this.$parent.camera;
      this.$emit("adjustZoom", BASE_ZOOM)
      const { x, y, z } = object.position.clone().add(offset);
      camera.position.set(x, y, z);
      camera.position.multiplyScalar(SCENE_SCALE);

      this.$emit("animDone");
      onComplete();
    },
    focus(body: typeof CelestialBody) {
      if (this.target !== null &&
        body.position.equals(this.target.position))
        return;
      const mesh: Mesh = body.mesh();
      const { centre, size } = computeCentreAndSize(mesh);
      this.moveCamera({
        object: mesh,
        offset: new Vector3(0, 0, 1.25 * size.length() / SCENE_SCALE),
        onComplete: () => {
          this.target = body;
        },
      });
    },
    reset() {
      const pos: Vector3 = this.$parent.$parent.defaultPos;
      const currentPos: Vector3 = this.$parent.camera.position;
      if (pos.distanceTo(currentPos) < 1e-5 && this.target === null &&
        this.orbitControls.target.equals(this.centre)) {
        this.resetControls();
        return;
      }
      this.moveCamera({
        object: { position: this.centre },
        offset: pos,
        onComplete: () => {
          this.resetControls();
        },
      });
    },
    resetControls() {
      this.target = null;
      this.orbitControls.enablePan = true;
      this.orbitControls.minDistance = 0;
    },
    render(paused: boolean, speed: number) {
      const cam: PerspectiveCamera = this.$parent.camera;
      const controls: OrbitControls = this.orbitControls;
      if (this.target !== null) {
        if (!paused) {
          controls.enablePan = false;
          const mesh: Mesh = this.target.mesh();
          const { centre, size } = computeCentreAndSize(mesh);
          controls.target = centre;
          controls.minDistance = size.length();
          setZoom(cam, BASE_ZOOM);
        }
      }
    },
  },
});
</script>

<style scoped></style>
