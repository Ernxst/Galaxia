<template></template>

<script lang="ts">
import { animateCamera, calcDuration } from "@/assets/gsap";
import { isAnimating } from "@/assets/gsap/camera.animate";
import { tourUniverse } from "@/assets/gsap/universe-tour.animate";
import { computeCentreAndSize } from "@/assets/three";
import { setZoom } from "@/assets/three/camera";
import { BASE_ZOOM, FAR } from "@/assets/three/camera/camera.constants";
import { SCENE_SCALE } from "@/assets/util/sim.constants";
import CelestialBody from "@/components/three/celestial/base/celestial-body.vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Quaternion } from "three/src/math/Quaternion";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";
import { defineComponent, PropType } from "vue";


interface MoveCameraParams {
  object: { position: Vector3, quaternion: Quaternion },
  offset: Vector3,
  onStart?: Function,
  onComplete: Function
}

export default defineComponent({
  name: "CamAnimationController",
  emits: ["animStart", "animDone", "adjustZoom"],
  props: {
    orbitControls: Object as PropType<OrbitControls>,
  },
  data() {
    return {
      target: null as typeof CelestialBody,
      centre: new Vector3(),
      factfileOpen: false,
    };
  },
  methods: {
    universeTour(models: Array<typeof CelestialBody>) {
      setTimeout(() => {
        this.$emit("animStart");
        this.orbitControls.minDistance = 0;
        tourUniverse(models, this.$parent.camera, this.orbitControls).then(() => {
          this.$emit("animDone");
          setTimeout(() => {
            this.reset();
          }, 1500);
        });
      }, 2000);
    },
    openFactfile() {
      const mesh: Mesh = this.target.mesh();
      const { centre, size } = computeCentreAndSize(mesh);
      centre.x -= size.length() / 4;
      this.moveCamera({
        object: { position: centre },
        offset: new Vector3(0, 0, size.length()),
        onComplete: () => {
          this.factfileOpen = true;
        },
      });
    },
    closeFactfile() {
      const mesh: Mesh = this.target.mesh();
      const { centre, size } = computeCentreAndSize(mesh);
      this.moveCamera({
        object: { position: centre },
        offset: new Vector3(0, 0, size.length()),
        onComplete: () => {
          this.factfileOpen = false;
        },
      });
    },
    moveCamera({ object, offset, onStart, onComplete }: MoveCameraParams) {
      const duration = calcDuration(
        this.orbitControls.target,
        object.position,
        this.$parent.camera.position,
        offset
      );
      animateCamera({
        camera: this.$parent.camera,
        controls: this.orbitControls,
        object,
        offset,
        duration,
        onStart: () => {
          this.$emit("animStart");
          this.orbitControls.minDistance = 0;
          onStart?.();
        },
        onComplete: () => {
          this.$emit("animDone");
          onComplete();
        },
      });
    },
    focus(body: typeof CelestialBody) {
      const mesh: Mesh = body.mesh();
      if (this.target !== null && mesh.position.equals(this.target.position)) return;
      const { centre, size } = computeCentreAndSize(mesh);
      this.moveCamera({
        object: { position: centre, quaternion: mesh.quaternion },
        offset: new Vector3(0, 0, size.length()),
        onComplete: () => {
          this.target = body;
        },
      });
    },
    reset() {
      const pos: Vector3 = this.$parent.$parent.defaultPos.clone().multiplyScalar(SCENE_SCALE);
      const currentPos: Vector3 = this.$parent.camera.position;
      if (pos.distanceTo(currentPos) < 1e-5 && this.target === null &&
        this.orbitControls.target.equals(this.centre)) {
        this.resetControls();
        return;
      }
      this.moveCamera({
        object: { position: this.centre, quaternion: new Quaternion() },
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
      this.orbitControls.maxDistance = this.$parent.$parent.defaultPos.x / 5.0 / SCENE_SCALE;
    },
    render(paused: boolean, speed: number) {
      if (isAnimating()) return;

      const camera: PerspectiveCamera = this.$parent.camera;
      const controls: OrbitControls = this.orbitControls;
      controls.enablePan = true;

      if (this.target !== null) {
        if (!paused) {
          controls.enablePan = false;
          setZoom(camera, BASE_ZOOM);
          const { centre, size } = computeCentreAndSize(this.target.mesh());
          controls.minDistance = size.length();
          if (this.factfileOpen) centre.setX(centre.x - controls.minDistance / 4);
          controls.target = centre;
          // TODO: Camera needs to follow object and still allow rotation
        }
      }
    },
  },
});
</script>

<style scoped></style>
