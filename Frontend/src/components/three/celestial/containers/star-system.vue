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
    <AsteroidBelt
      v-for="belt in systemData.asteroidBelts"
      key="belt"
      :ref="(el) => asteroidBelts.push(el)"
      :name="belt.name"
      :asteroids="belt.asteroids"
      :num-of-asteroids="belt.numOfAsteroids"
      :models="belt.models"
      :height="belt.height"
      :inner-radius="belt.innerRadius"
      :outer-radius="belt.outerRadius"
      :semi-major="belt.semiMajor"
      :semi-minor="belt.semiMinor"
      :eccentricity="belt.eccentricity"
      :axial-tilt="belt.axialTilt"
      :mass="belt.mass"
      :mean-velocity="0"
      :orbital-period="belt.orbitalPeriod"
      :inclination="belt.inclination"
      :day-length="belt.dayLength"
      :fill="belt.fill"
      :star-radius="systemData.star.radius"
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
  import AsteroidBelt from "./asteroid-belt.vue";

  export default defineComponent({
    name: "star-system",
    components: { Group, Planet, Star, AsteroidBelt },
    props: { name: String },
    computed: {
      systemData(): StarSystemInterface {
        return this.$store.getters["starSystem/starSystem"](this.name);
      },
    },
    data() {
      return {
        planets: [],
        asteroidBelts: [],
      };
    },
    beforeUpdate() {
      this.planets = [];
      this.asteroidBelts = [];
    },
    methods: {
      evolve(speed: number) {
        const dt = speed * TIME_STEP;
        for (const planet of this.planets) planet.orbit(dt);
        for (const belt of this.asteroidBelts) belt.spinOnAxis(dt);
      },
    },
  });
</script>

<style scoped></style>
