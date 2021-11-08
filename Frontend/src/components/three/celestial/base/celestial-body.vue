<template></template>

<script lang="ts">
  import { AU } from "@/assets/util/celestial.constants";
  import { DISTANCE_SCALE, SPEED_SCALE } from "@/assets/util/sim.constants";
  import { Vector3 } from "three/src/math/Vector3";
  import { Mesh } from "three/src/objects/Mesh";
  import { defineComponent } from "vue";
  import BaseObject from "../../util/BaseObject.vue";
  export default defineComponent({
    name: "celestial-body",
    extends: BaseObject,
    props: {
      mass: Number,
      meanVelocity: Number,
      dayLength: { type: Number, default: 0 },
      axialTilt: { type: Number, default: 0 },
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
        const rotation = new Vector3(0, radians, 0);
        this.rotate(rotation);
        const mesh: Mesh = this.$refs.body.o3d;
        mesh.rotation.x = this.axialTiltRads;
      },
    },
    mounted() {
      const mesh: Mesh = this.$refs.body.o3d;
      mesh.rotateX(this.axialTiltRads);
    },
  });
</script>

<style scoped></style>
