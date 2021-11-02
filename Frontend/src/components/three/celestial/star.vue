<template>
  <PointLight
    ref="light"
    :color="starLightColour"
    :intensity="intensity"
    :position="initialPosition"
    :distance="0"
    :cast-shadow="true"
    :decay="2"
  />
  <Group ref="body" :position="initialPosition">
    <Sphere :name="`${name}-sphere`" :radius="scaledRadius" colour="#FFFF00">
    </Sphere>
  </Group>
</template>

<script lang="ts">
  // TODO: Lighting
  import { RADIUS_SCALE } from "@/assets/util/sim.constants";
  import { Group, PointLight } from "troisjs";
  import { defineComponent } from "vue";
  import Sphere, { SphereProps } from "../util/Sphere.vue";
  import OrbittingBody from "./base/orbitting-body.vue";
  export default defineComponent({
    name: "star",
    extends: OrbittingBody,
    components: { Group, Sphere, PointLight },
    props: {
      ...SphereProps,
      starLightColour: { type: String, default: "#FFFFFF" },
      luminosity: { type: Number, default: 1 },
    },
    computed: {
      scaledRadius(): number {
        return this.radius * RADIUS_SCALE;
      },
      intensity(): number {
        return this.luminosity * 300; // Converted to Candela (cd)
      },
    },
  });
</script>

<style scoped></style>
