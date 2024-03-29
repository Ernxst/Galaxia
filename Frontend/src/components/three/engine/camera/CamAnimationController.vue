<template>
  <div class="skip-container centred"
       v-if="touring">
    <flat-button text="Skip Tour"
                 @click="stopUniverseTour" />
  </div>
</template>

<script lang="ts">
import { animateCamera, calcDuration } from "@/assets/gsap";
import { isAnimating } from "@/assets/gsap/camera.animate";
import { interruptUniverseTour, tourUniverse } from "@/assets/gsap/universe-tour.animate";
import { computeCentreAndSize, getOffset } from "@/assets/three";
import { SCENE_SCALE } from "@/assets/util/sim.constants";
import CelestialBody from "@/components/three/celestial/base/celestial-body.vue";
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Quaternion } from "three/src/math/Quaternion";
import { Vector3 } from "three/src/math/Vector3";
import { defineComponent, PropType } from "vue";


interface MoveCameraParams {
  object: { position: Vector3, quaternion: Quaternion },
  offset: Vector3,
  onComplete: Function,
  timeline: boolean,
}

// TODO: Camera has stopped moving with followed object
export default defineComponent({
  name: "CamAnimationController",
  components: { FlatButton },
  emits: ["animStart", "animDone"],
  props: {
    orbitControls: Object as PropType<OrbitControls>,
    enablePan: { type: Boolean, default: true },
  },
  data() {
    return {
      camera: null as unknown as PerspectiveCamera,
      target: null as unknown as typeof CelestialBody,
      centre: new Vector3(),
      factfileOpen: false,
      defaultPos: new Vector3(),
      touring: false,
      interrupted: false
    };
  },
  methods: {
    stopUniverseTour() {
      this.interrupted = true;
      interruptUniverseTour();
    },
    universeTour(models: Array<typeof CelestialBody>) {
      this.$emit("animStart");
      setTimeout(() => {
        this.touring = true;
        this.orbitControls.minDistance = 0;
        tourUniverse(models, this.camera, this.orbitControls).then(() => {
          this.touring = false;
          const delay = this.interrupted ? 250 : 1500;

          setTimeout(() => {
            this.$emit("animDone");
            this.reset();
          }, delay);
        });
      }, 1750);
    },
    openFactfile() {
      const { centre, offset, quaternion, size } = getOffset(this.target.mesh());
      centre.x -= centre.z > 0 ? size / -4 : size / 4;
      this.moveCamera({
        object: { position: centre, quaternion: quaternion },
        offset: offset,
        onComplete: () => (this.factfileOpen = true),
        timeline: false,
      });
    },
    closeFactfile() {
      const { centre, offset, quaternion } = getOffset(this.target.mesh());
      this.moveCamera({
        object: { position: centre, quaternion: quaternion },
        offset: offset,
        onComplete: () => (this.factfileOpen = false),
        timeline: false,
      });
    },
    moveCamera({ object, offset, onComplete, timeline }: MoveCameraParams) {
      const duration = calcDuration(this.orbitControls.target, object.position,
        this.camera.position, offset);
      animateCamera({
        camera: this.camera,
        controls: this.orbitControls,
        object,
        offset,
        duration: timeline ? duration * 2 : duration,
        onStart: () => {
          this.$emit("animStart");
          this.orbitControls.minDistance = 0;
        },
        onComplete: () => {
          onComplete();
          this.$emit("animDone");
        },
      }, timeline);
    },
    focus(body: typeof CelestialBody) {
      if (this.factfileOpen) {
        this.target = body;
        this.openFactfile();
        return;
      }
      const { centre, offset, quaternion } = getOffset(body.mesh());
      this.moveCamera({
        object: { position: centre, quaternion: quaternion },
        offset: offset,
        onComplete: () => (this.target = body),
        timeline: this.shouldReturnToOrigin(centre),
      });
    },
    shouldReturnToOrigin(target: Vector3): boolean {
      if (target.equals(this.centre)) return false;
      if (this.target) {
        const { centre, size } = computeCentreAndSize(this.target.mesh());
        return centre.distanceTo(target) > 2.5;
      }
      return true;
    },
    reset() {
      this.moveCamera({
        object: { position: this.centre, quaternion: new Quaternion() },
        offset: this.defaultPos.clone().multiplyScalar(SCENE_SCALE),
        onComplete: () => this.resetControls(),
        timeline: false,
      });
    },
    resetControls() {
      this.factfileOpen = false;
      this.target = null;
      this.orbitControls.enablePan = this.enablePan;
      this.orbitControls.minDistance = 0;
      this.orbitControls.maxDistance = this.defaultPos.length() * SCENE_SCALE;
    },
    render(paused: boolean) {
      if (isAnimating()) return;
      const controls: OrbitControls = this.orbitControls;
      controls.enablePan = this.enablePan;

      if (this.target) {
        controls.enablePan = false;
        if (!paused) {
          const { centre, size } = computeCentreAndSize(this.target.mesh());
          controls.minDistance = size.length();
          if (this.factfileOpen) centre.x -= controls.minDistance / 4;
          controls.target.set(centre.x, centre.y, centre.z);
        }
      }
    },
  },
});
</script>

<style scoped>
.skip-container {
  position: absolute;
  bottom: 25vh;
}

@media (min-width: 640px) {
  .skip-container {
    top: 16px;
    right: 16px;
    bottom: unset;
    left: unset;
  }
}
</style>
