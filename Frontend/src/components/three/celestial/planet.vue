<template>
  <Group ref="body" :position="initialPos">
    <Sphere
      :name="`${name}-sphere`"
      :radius="scaledRadius"
      :texture="texture"
      :bump-map="bumpMap"
      :specular-map="specularMap"
      :material-props="{ transparent: true }"
      @sphere-loaded="assetsLoaded++"
    />
    <Atmosphere
      ref="atmosphere"
      v-if="hasAtmosphere"
      :name="`${name}-atmosphere`"
      :parent-radius="scaledRadius"
      :scale="atmosphere.scale"
      :texture="atmosphere.texture"
      :opacity="atmosphere.opacity"
      @atmosphere-loaded="assetsLoaded++"
    />
    <slot></slot>
    <Moon
      v-for="(moon, index) in moons"
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
      :render-order="moons.length - index"
      :texture="moon.texture"
      :bump-map="moon.bumpMap"
      :specular-map="moon.specularMap"
      @moon-loaded="assetsLoaded++"
    />
  </Group>
  <Trail
    :semi-major="scaledX"
    :semi-minor="scaledZ"
    :inclination="inclinationRad"
  />
</template>

<script lang="ts">
import AtmosphereProps from "@/@types/celestial/atmosphere-props";

// TODO: Planetshine (Google) & Planetlight
import { Moon as MoonInterface } from "@/@types/celestial/moon";
import { dispatchLoadedEvent } from "@/assets/three/loaders";
import { RADIUS_SCALE } from "@/assets/util/sim.constants";
import Atmosphere from "@/components/three/util/Atmosphere.vue";
import { Vector3 } from "three/src/math/Vector3";
import { Group } from "troisjs";
import { defineComponent, PropType } from "vue";
import Sphere, { SphereProps } from "../util/Sphere.vue";
import Trail from "../util/trail.vue";
import OrbittingBody from "./base/orbitting-body.vue";
import Moon from "./moon.vue";


export default defineComponent({
  name: "planet",
  emits: ["planetLoaded"],
  extends: OrbittingBody,
  components: { Atmosphere, Group, Sphere, Trail, Moon },
  props: {
    ...SphereProps,
    atmosphere: Object as PropType<AtmosphereProps>,
    moons: { type: Array as PropType<MoonInterface[]>, default: [] },
  },
  data() {
    return {
      moonComponents: [] as typeof Moon[],
      assetsLoaded: 0,
    };
  },
  beforeUpdate() {
    this.moonComponents = [];
  },
  watch: {
    loaded() {
      dispatchLoadedEvent();
      this.$emit("planetLoaded");
    },
  },
  computed: {
    hasAtmosphere(): boolean {
      return this.atmosphere !== undefined;
    },
    scaledRadius(): number {
      return this.radius * RADIUS_SCALE;
    },
    initialPos(): Vector3 {
      return this.computeNewPos(this.angle);
    },
    modelsToLoad(): number {
      const num = this.moons.length + 1;
      return this.hasAtmosphere ? num + 1 : num;
    },
    loaded(): boolean {
      return this.assetsLoaded === this.modelsToLoad;
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
