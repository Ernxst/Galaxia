<template></template>

<script lang="ts">
import { MeshMouseEvent } from "@/@types/three/mesh-mouse-event";
import { AU } from "@/assets/util/celestial.constants";
import { ATMOSPHERE_ROTATION_SPEED_SCALE, DISTANCE_SCALE, SPEED_SCALE } from "@/assets/util/sim.constants";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";
import { defineComponent } from "vue";
import BaseObject from "../../util/BaseObject.vue";


export default defineComponent({
  name: "celestial-body",
  extends: BaseObject,
  emits: ["click"],
  props: {
    mass: Number,
    meanVelocity: Number,
    dayLength: { type: Number, default: 0 },
    axialTilt: { type: Number, default: 0 },
    shortDescription: String,
  },
  data() {
    return {
      currentRotation: new Vector3(),
    };
  },
  computed: {
    scaledVelocity(): number {
      return (this.meanVelocity * DISTANCE_SCALE * SPEED_SCALE) / AU;
    },
    tidallyLocked() {
      return this.dayLength === 0;
    },
    rotationSpeed() {
      return this.tidallyLocked ? 0 : (2 * Math.PI) / this.dayLength;
    },
    axialTiltRads(): number {
      return (Math.PI * this.axialTilt) / 180;
    },
  },
  methods: {
    spinOnAxis(speed: number) {
      const radians = speed * this.rotationSpeed;
      this.currentRotation.set(0, radians, 0);
      this.rotate(this.currentRotation);
      if (this.hasAtmosphere) {
        this.currentRotation.set(0, radians * ATMOSPHERE_ROTATION_SPEED_SCALE, 0);
        this.$refs.atmosphere.rotate(this.currentRotation);
      }
      if (this.hasRing) this.$refs.ring.rotate(radians);
      const mesh: Mesh = this.mesh();
      mesh.rotation.x = this.axialTiltRads;
    },
    onClick(event: MeshMouseEvent) {
      event.component = this;
      this.$emit("click", event);
    }
  },
  mounted() {
    const mesh: Mesh = this.mesh();
    mesh.rotateZ(this.axialTiltRads);
  },
});
</script>

<style scoped></style>
