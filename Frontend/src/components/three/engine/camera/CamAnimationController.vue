<template></template>

<script lang="ts">
import { animateCamera, calcDuration } from "@/assets/gsap";
import { isAnimating } from "@/assets/gsap/camera.animate";
import { tourUniverse } from "@/assets/gsap/universe-tour.animate";
import { computeCentreAndSize } from "@/assets/three";
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
  onComplete: Function
}

export default defineComponent({
  name: "CamAnimationController",
  emits: ["animStart", "animDone"],
  props: {
    orbitControls: Object as PropType<OrbitControls>,
  },
  data() {
    return {
      camera: null as typeof PerspectiveCamera,
      target: null as typeof CelestialBody,
      centre: new Vector3(),
      factfileOpen: false,
      defaultPos: new Vector3(),
    };
  },
  methods: {
    universeTour(models: Array<typeof CelestialBody>) {
      setTimeout(() => {
        this.$emit("animStart");
        this.orbitControls.minDistance = 0;
        tourUniverse(models, this.camera, this.orbitControls).then(() => {
          setTimeout(() => {
            this.$emit("animDone");
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
        object: { position: centre, quaternion: mesh.quaternion },
        offset: new Vector3(0, 0, size.length()),
        onComplete: () => (this.factfileOpen = true)
      });
    },
    closeFactfile() {
      const mesh: Mesh = this.target.mesh();
      const { centre, size } = computeCentreAndSize(mesh);
      this.moveCamera({
        object: { position: centre, quaternion: mesh.quaternion },
        offset: new Vector3(0, 0, size.length()),
        onComplete: () => (this.factfileOpen = false)
      });
    },
    moveCamera({ object, offset, onComplete }: MoveCameraParams) {
      animateCamera({
        camera: this.camera,
        controls: this.orbitControls,
        object,
        offset,
        duration: calcDuration(this.orbitControls.target, object.position,
          this.camera.position, offset),
        onStart: () => {
          this.$emit("animStart");
          this.orbitControls.minDistance = 0;
        },
        onComplete: () => {
          onComplete();
          this.$emit("animDone");
        },
      });
    },
    focus(body: typeof CelestialBody) {
      const mesh: Mesh = body.mesh();
      const { centre, size } = computeCentreAndSize(mesh);
      this.moveCamera({
        object: { position: centre, quaternion: mesh.quaternion },
        offset: new Vector3(0, 0, size.length()),
        onComplete: () => (this.target = body)
      });
    },
    reset() {
      this.moveCamera({
        object: { position: this.centre },
        offset: this.defaultPos.clone().multiplyScalar(SCENE_SCALE),
        onComplete: () => this.resetControls()
      });
    },
    resetControls() {
      this.target = null;
      this.orbitControls.enablePan = true;
      this.orbitControls.minDistance = 0;
      this.orbitControls.maxDistance = this.defaultPos.length();
    },
    render(paused: boolean) {
      if (isAnimating()) return;
      const controls: OrbitControls = this.orbitControls;
      controls.enablePan = true;

      if (this.target !== null) {
        if (!paused) {
          const { centre, size } = computeCentreAndSize(this.target.mesh());
          controls.minDistance = size.length();
          if (this.factfileOpen) centre.x -= controls.minDistance / 4;
          controls.target.set(centre.x, centre.y, centre.z);
          controls.enablePan = false;
        }
      }
    },
  },
});
</script>

<style scoped></style>
