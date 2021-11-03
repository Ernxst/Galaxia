<template>
  <Group ref="body" :position="initialPos">
    <Sphere :name="`${name}-sphere`" :radius="scaledRadius"></Sphere>
    <slot></slot>
  </Group>
  <Trail
    :semi-major="scaledX"
    :semi-minor="scaledZ"
    :inclination="inclinationRad"
    :mean-velocity="meanVelocity"
  />
</template>

<script lang="ts">
  import { RADIUS_SCALE } from "@/assets/util/sim.constants";
  import { Vector3 } from "three/src/math/Vector3";
  import { Group } from "troisjs";
  import { defineComponent } from "vue";
  import Sphere, { SphereProps } from "../util/Sphere.vue";
  import Trail from "../util/trail.vue";
  import OrbittingBody from "./base/orbitting-body.vue";

  export default defineComponent({
    name: "moon",
    extends: OrbittingBody,
    components: { Group, Sphere, Trail },
    props: { ...SphereProps },
    computed: {
      scaledRadius(): number {
        return this.radius * RADIUS_SCALE;
      },
      initialPos(): Vector3 {
        return this.computeNewPos(this.angle);
      },
    },
  });
</script>

<style scoped></style>
