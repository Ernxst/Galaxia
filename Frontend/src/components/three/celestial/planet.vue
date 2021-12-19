<template>
  <Group ref="body"
         :position="initialPos">
    <Sphere
      :bump-map="bumpMap"
      :material-props="{ transparent: true }"
      :name="`${name}-sphere`"
      :radius="scaledRadius"
      :specular-map="specularMap"
      :texture="texture"
      @click="onClick"
      @sphere-loaded="assetsLoaded++"
    />
    <Atmosphere
      v-if="hasAtmosphere"
      ref="atmosphere"
      :name="`${name}-atmosphere`"
      :opacity="atmosphere.opacity"
      :parent-radius="scaledRadius"
      :scale="atmosphere.scale"
      :texture="atmosphere.texture"
      @atmosphere-loaded="assetsLoaded++"
    />
    <slot></slot>
    <Moon
      v-for="(moon, index) in moons"
      :ref="addMoon"
      v-bind="moon"
      :axial-tilt="moon.axialTilt"
      :bump-map="moon.bumpMap"
      :day-length="moon.dayLength"
      :eccentricity="moon.eccentricity"
      :inclination="moon.inclination"
      :mass="moon.mass"
      :mean-velocity="moon.meanVelocity"
      :name="moon.name"
      :orbital-period="moon.orbitalPeriod"
      :radius="moon.radius"
      :render-order="moons.length - index"
      :semi-major="moon.semiMajor"
      :semi-minor="moon.semiMinor"
      :specular-map="moon.specularMap"
      :star-radius="maxRadius"
      :texture="moon.texture"
      @click="$emit('click', $event)"
      @moon-loaded="assetsLoaded++"
    />
  </Group>
  <Trail
    :inclination="inclinationRad"
    :semi-major="scaledX"
    :semi-minor="scaledZ"
  />
</template>

<script lang="ts">
import AtmosphereProps from "@/@types/celestial/atmosphere-props";
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


export const PlanetProps = {
  ...SphereProps,
  atmosphere: Object as PropType<AtmosphereProps>,
  moons: { type: Array as PropType<MoonInterface[]>, default: [] },
  atmosphereTexture: { type: String, default: "" },
};

export default defineComponent({
  name: "planet",
  emits: ["planetLoaded"],
  extends: OrbittingBody,
  components: { Atmosphere, Group, Sphere, Trail, Moon },
  props: PlanetProps,
  data() {
    return {
      moonComponents: {} as { [key: string]: typeof Moon },
      models: [] as typeof Moon[],
      assetsLoaded: 0,
    };
  },
  beforeUpdate() {
    this.moonComponents = {};
    this.models = [];
  },
  watch: {
    loaded() {
      dispatchLoadedEvent(this.name);
      this.$emit("planetLoaded");
    },
  },
  computed: {
    hasMoons(): boolean {
      return this.moons && this.moons.length > 0;
    },
    hasAtmosphere(): boolean {
      return this.atmosphere !== undefined;
    },
    maxRadius(): number {
      if (this.hasAtmosphere)
        return this.radius * this.atmosphere.scale;
      return this.radius;
    },
    scaledRadius(): number {
      return this.radius * RADIUS_SCALE;
    },
    initialPos(): Vector3 {
      this.computeNewPos(this.angle);
      return this.newPos;
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
      for (const moon of this.models) moon.orbit(dt);
    },
    addMoon(el: typeof Moon) {
      this.moonComponents[el.name] = el;
      this.models.push(el);
    },
    getMoon(name: string): typeof Moon | undefined {
      return this.moonComponents[name];
    },
  },
});
</script>

<style scoped></style>
