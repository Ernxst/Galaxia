<template>
  <Points ref="trail">
    <BufferGeometry ref="geometry" />
    <PointsMaterial :props="materialProps" />
  </Points>
</template>

<script lang="ts">
  import { MAX_TRAIL_POINTS } from "@/assets/util/sim.constants";
  import { BufferGeometry as ThreeBufferGeometry } from "three/src/core/BufferGeometry";
  import { EllipseCurve } from "three/src/extras/curves/EllipseCurve";
  import { Mesh } from "three/src/objects/Mesh";
  import { BufferGeometry, Points, PointsMaterial } from "troisjs";
  import { defineComponent } from "vue";
  export default defineComponent({
    name: "Trail",
    components: { Points, BufferGeometry, PointsMaterial },
    props: {
      meanVelocity: Number,
      semiMajor: Number,
      semiMinor: Number,
      inclination: Number,
    },
    computed: {
      materialProps() {
        return {
          size: 0.05,
          depthTest: true,
          sizeAttenuation: false,
          color: "#FFFFFF",
        };
      },
    },
    mounted() {
      const curve = new EllipseCurve(
        0,
        0,
        this.semiMajor,
        this.semiMinor,
        0,
        2 * Math.PI,
        false,
        0
      );
      const geometry: ThreeBufferGeometry = this.$refs.geometry.geometry;
      geometry.setFromPoints(curve.getPoints(MAX_TRAIL_POINTS));
      geometry.setDrawRange(0, MAX_TRAIL_POINTS);
      const trail: Mesh = this.$refs.trail.mesh;
      trail.frustumCulled = false;
      trail.rotateX(Math.PI / 2);
      trail.rotateY(this.inclination);
    },
  });
</script>

<style scoped></style>
