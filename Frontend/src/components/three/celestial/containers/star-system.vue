<template>
  <Group ref="system">
    <Star ref="star" v-bind="systemData.star" @star-loaded="assetsLoaded++"/>
    <Planet
      v-for="(planet, index) in systemData.planets"
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
      :render-order="systemData.planets.length - index"
      :texture="planet.texture"
      :bump-map="planet.bumpMap"
      :specular-map="planet.specularMap"
      :atmosphere="planet.atmosphere"
      @planet-loaded="assetsLoaded++"
    />
    <AsteroidBelt
      v-for="belt in systemData.asteroidBelts"
      key="belt"
      :ref="(el) => asteroidBelts.push(el)"
      :name="belt.name"
      :asteroids="belt.asteroids"
      :num-of-asteroids="belt.numOfAsteroids"
      :depth="belt.depth"
      :inner-semi-major="belt.innerSemiMajor"
      :inner-eccentricity="belt.innerEccentricity"
      :outer-semi-major="belt.outerSemiMajor"
      :outer-eccentricity="belt.outerEccentricity"
      :mass="belt.mass"
      :axial-tilt="belt.inclination"
      :day-length="belt.dayLength"
      :fill="belt.fill"
      :min-size="belt.minSize"
      :max-size="belt.maxSize"
      :mean-velocity="0"
      :star-radius="systemData.star.radius"
      @asteroid-belt-loaded="assetsLoaded++"
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
  emits: ["starSystemLoaded"],
  props: { name: String },
  watch: {
    loaded() {
      this.$emit("starSystemLoaded");
    },
  },
  computed: {
    systemData(): StarSystemInterface {
      return this.$store.getters["starSystem/starSystem"](this.name);
    },
    modelsToLoad(): number {
      return (
        this.systemData.planets.length +
        1 +
        this.systemData.asteroidBelts.length
      );
    },
    loaded(): boolean {
      return this.assetsLoaded === this.modelsToLoad;
    },
  },
  data() {
    return {
      planets: [],
      asteroidBelts: [],
      assetsLoaded: 0,
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
      for (const belt of this.asteroidBelts) belt.animate(dt);
    },
  },
});
</script>

<style scoped></style>
