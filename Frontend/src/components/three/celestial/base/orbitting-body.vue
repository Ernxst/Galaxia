<template></template>

<script lang="ts">
  import {
    ANGLE_INCREMENT,
    DISTANCE_SCALE,
    RADIUS_SCALE,
  } from "@/assets/util/sim.constants";
  import { Vector3 } from "three/src/math/Vector3";
  import { defineComponent } from "vue";
  import CelestialBody from "./celestial-body.vue";
  export default defineComponent({
    name: "orbitting-body",
    extends: CelestialBody,
    props: {
      inclination: { type: Number, default: 0 },
      orbitalPeriod: { type: Number },
      eccentricity: { type: Number, default: 0 },
      semiMajor: { type: Number },
      semiMinor: { type: Number },
      starRadius: { type: Number, default: 0 },
    },
    data() {
      return {
        angle: 0 as number,
      };
    },
    computed: {
      offset(): number {
        return this.starRadius * RADIUS_SCALE;
      },
      scaledX(): number {
        return this.semiMajor * DISTANCE_SCALE + this.offset;
      },
      scaledZ(): number {
        return this.semiMinor * DISTANCE_SCALE + this.offset;
      },
      inclinationRad(): number {
        return (Math.PI * this.inclination) / 180;
      },
      scaledInclination(): number {
        return Math.sin(this.inclinationRad) * this.scaledX;
      },
    },
    methods: {
      orbit(dt: number) {
        this.angle += dt * this.scaledVelocity;
        const newPos: Vector3 = this.computeNewPos(this.angle);
        this.moveTo(newPos);
        this.spinOnAxis(dt);
        this.afterOrbit(dt);
      },
      computeNewPos(angle: number): Vector3 {
        const cosAngle = Math.cos(angle);
        const x = this.scaledX * cosAngle;
        const y = this.scaledInclination * cosAngle;
        const z = this.scaledZ * Math.sin(angle);
        return new Vector3(x, y, z);
      },
      afterOrbit(dt: number) {},
    },
  });
</script>

<style scoped></style>
