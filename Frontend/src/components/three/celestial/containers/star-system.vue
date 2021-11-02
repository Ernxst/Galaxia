<template>
  <Group ref="system">
    <Star ref="star" v-bind="systemData.star" />
    <Planet
      v-for="planet in systemData.planets"
      key="planet"
      :ref="(el) => planets.push(el)"
      :name="planet.name"
      :mass="planet.mass"
      :radius="planet.radius"
      :inclination="planet.inclination"
      :semi-major="planet.semiMajor"
      :semi-minor="planet.semiMinor"
      :eccentricity="planet.eccentricity"
      :orbital-period="planet.orbitalPeriod"
      :mean-velocity="planet.meanVelocity"
      :star-radius="systemData.star.radius"
      :day-length="planet.dayLength"
      :axial-tilt="planet.axialTilt"
      :moons="planet.moons"
    />
  </Group>
</template>

<script lang="ts">
  import { StarSystem as StarSystemInterface } from "@/@types/celestial/containers/star-system";
  import { TIME_STEP } from "@/assets/util/sim.constants";
  import { Group } from "troisjs";
  import { defineComponent } from "vue";
  import Planet from "../planet.vue";
  import Star from "../star.vue";

  export default defineComponent({
    name: "star-system",
    components: { Group, Planet, Star },
    props: { name: String },
    computed: {
      systemData(): StarSystemInterface {
        return this.$store.getters["starSystem/starSystem"](this.name);
      },
    },
    data() {
      return {
        planets: [],
      };
    },
    beforeUpdate() {
      this.planets = [];
    },
    methods: {
      evolve(speed: number) {
        const dt = speed * TIME_STEP;
        for (const planet of this.planets) planet.orbit(dt);
      },
    },
  });
</script>

<style scoped></style>
