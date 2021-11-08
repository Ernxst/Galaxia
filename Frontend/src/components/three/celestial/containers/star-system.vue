<template>
  <Group ref="system">
    <Star ref="star" v-bind="systemData.star" @star-loaded="assetsLoaded++"/>
    <component
      :is="planetComponent(planet)"
      v-for="(planet, index) in systemData.planets"
      key="planet"
      :ref="(el) => planets.push(el)"
      v-bind="planet"
      :star-radius="systemData.star.radius"
      :render-order="systemData.planets.length - index"
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
import { Planet as PlanetInterface } from "@/@types/celestial/planet";
import { RingedPlanet as RingedPlanetInterface } from "@/@types/celestial/ringed-planet";
import { TIME_STEP } from "@/assets/util/sim.constants";
import { Group } from "troisjs";
import { defineComponent } from "vue";
import Planet from "../planet.vue";
import RingedPlanet from "../ringed-planet.vue";
import Star from "../star.vue";
import AsteroidBelt from "./asteroid-belt.vue";


export default defineComponent({
  name: "star-system",
  components: { Group, Star, AsteroidBelt },
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
    planetComponent(props: PlanetInterface | RingedPlanetInterface):
      typeof Planet | typeof RingedPlanet {
      return props.ring === undefined ? Planet : RingedPlanet;
    },
    evolve(speed: number) {
      const dt = speed * TIME_STEP;
      for (const planet of this.planets) planet.orbit(dt);
      for (const belt of this.asteroidBelts) belt.animate(dt);
    },
  },
});
</script>

<style scoped></style>
