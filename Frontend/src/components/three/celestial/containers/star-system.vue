<template>
  <Group ref="system">
    <Star ref="star"
          v-bind="systemData.star"
          @click="$emit('focusOnBody', $event)"
          @star-loaded="assetsLoaded++" />
    <component
      :is="planetComponent(planet)"
      v-for="(planet, index) in systemData.planets"
      :ref="addPlanet"
      key="planet"
      v-bind="planet"
      :render-order="systemData.planets.length - index"
      :star-radius="systemData.star.radius"
      @click="$emit('focusOnBody', $event)"
      @planet-loaded="assetsLoaded++"
    />
    <AsteroidBelt
      v-for="belt in systemData.asteroidBelts"
      :ref="(el) => asteroidBelts.push(el)"
      key="belt"
      :asteroids="belt.asteroids"
      :axial-tilt="belt.inclination"
      :day-length="belt.dayLength"
      :depth="belt.depth"
      :fill="belt.fill"
      :inner-eccentricity="belt.innerEccentricity"
      :inner-semi-major="belt.innerSemiMajor"
      :mass="belt.mass"
      :max-size="belt.maxSize"
      :mean-velocity="0"
      :min-size="belt.minSize"
      :name="belt.name"
      :num-of-asteroids="belt.numOfAsteroids"
      :outer-eccentricity="belt.outerEccentricity"
      :outer-semi-major="belt.outerSemiMajor"
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
import CelestialBody from "@/components/three/celestial/base/celestial-body.vue";
import { Vector3 } from "three/src/math/Vector3";
import { Group } from "troisjs";
import { defineComponent, PropType } from "vue";
import Planet from "../planet.vue";
import RingedPlanet from "../ringed-planet.vue";
import Star from "../star.vue";
import AsteroidBelt from "./asteroid-belt.vue";


export default defineComponent({
  name: "star-system",
  components: { Group, Star, AsteroidBelt },
  emits: ["starSystemLoaded", "focusOnBody"],
  props: { systemData: Object as PropType<StarSystemInterface> },
  watch: {
    loaded() {
      const sceneData = {
        largestObjectSize: this.largestObjectSize(),
        furthestObjectDistance: this.furthestObjectDistance(),
        models: this.models(),
      };
      this.$emit("starSystemLoaded", sceneData);
    },
  },
  computed: {
    modelsToLoad(): number {
      return this.systemData.planets.length + 1 + this.systemData.asteroidBelts.length;
    },
    loaded(): boolean {
      return this.assetsLoaded === this.modelsToLoad;
    },
  },
  data() {
    return {
      planets: [],
      planetComponents: {} as { [key: string]: typeof Planet | typeof RingedPlanet },
      asteroidBelts: [],
      assetsLoaded: 0,
    };
  },
  beforeUpdate() {
    this.planets = [];
    this.asteroidBelts = [];
  },
  methods: {
    addPlanet(el: typeof Planet | typeof RingedPlanet) {
      this.planetComponents[el.name] = el;
      this.planets.push(el);
    },
    planetComponent(props: PlanetInterface | RingedPlanetInterface):
      typeof Planet | typeof RingedPlanet {
      return props.ring === undefined ? Planet : RingedPlanet;
    },
    evolve(speed: number) {
      const dt = speed * TIME_STEP;
      for (const planet of this.planets) planet.orbit(dt);
      for (const belt of this.asteroidBelts) belt.animate(dt);
    },
    largestObjectSize(): number {
      return this.$refs.star.scaledRadius * 2.0;
    },
    furthestObjectDistance(): number {
      const starPos: Vector3 = this.$refs.star.position;
      const furthestObject = this.planets.reduce(
        (prevPlanet, currentPlanet) => {
          const prevPos: Vector3 = prevPlanet.initialPos;
          const currPos: Vector3 = currentPlanet.initialPos;
          const min = prevPos.distanceTo(starPos) > currPos.distanceTo(starPos);
          return min ? prevPlanet : currentPlanet;
        }
      );
      return furthestObject.initialPos.length();
    },
    getComponentByName(name: string, isStar: boolean, isMoon: boolean): typeof CelestialBody {
      if (isStar) return this.$refs.star;
      if (!isMoon) return this.planetComponents[name];
      for (const planet of this.planets) {
        if (planet.hasMoons) {
          const moon = planet.getMoon(name);
          if (moon) return moon;
        }
      }
      return null;
    },
    models() {
      let models = [this.$refs.star];
      for (const planet of this.planets) {
        models.push(planet);
        models = models.concat(planet.models);
      }
      return models;
    }
  },
});
</script>

<style scoped></style>
