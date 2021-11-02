<template>
  <Group ref="body" :position="initialPos">
    <Sphere :name="`${name}-sphere`" :radius="scaledRadius"></Sphere>
    <slot></slot>
    <Moon
      v-for="moon in moons"
      v-bind="moon"
      :ref="(el) => moonComponents.push(el)"
      :name="moon.name"
      :mass="moon.mass"
      :radius="moon.radius"
      :inclination="moon.inclination"
      :semi-major="moon.semiMajor"
      :semi-minor="moon.semiMinor"
      :eccentricity="moon.eccentricity"
      :orbital-period="moon.orbitalPeriod"
      :mean-velocity="moon.meanVelocity"
      :star-radius="radius"
      :day-length="moon.dayLength"
      :axial-tilt="moon.axialTilt"
    />
  </Group>
  <Trail
    :semi-major="scaledX"
    :semi-minor="scaledZ"
    :inclination="inclinationRad"
    :mean-velocity="meanVelocity"
  />
</template>

<script lang="ts">
  // TODO: Planetshine (Google) & Planetlight
  import { Moon as MoonInterface } from "@/@types/celestial/moon";
  import { RADIUS_SCALE } from "@/assets/util/sim.constants";
  import { Vector3 } from "three/src/math/Vector3";
  import { Group } from "troisjs";
  import { defineComponent, PropType } from "vue";
  import Sphere, { SphereProps } from "../util/Sphere.vue";
  import Trail from "../util/trail.vue";
  import OrbittingBody from "./base/orbitting-body.vue";
  import Moon from "./moon.vue";

  export default defineComponent({
    name: "planet",
    extends: OrbittingBody,
    components: { Group, Sphere, Trail, Moon },
    props: {
      ...SphereProps,
      moons: { type: Array as PropType<MoonInterface[]>, default: [] },
    },
    data() {
      return {
        moonComponents: [] as typeof Moon[],
      };
    },
    beforeUpdate() {
      this.moonComponents = [];
    },
    computed: {
      scaledRadius(): number {
        return this.radius * RADIUS_SCALE;
      },
      initialPos(): Vector3 {
        return new Vector3(0, 0, this.semiMajor);
      },
    },
    methods: {
      afterOrbit(dt: number) {
        for (const moon of this.moonComponents) moon.orbit(dt);
      },
    },
  });
</script>

<style scoped></style>
