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
      :parent-radius="scaledRadius"
      :texture="atmosphereTexture"
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
    <ring ref="ring"
          v-if="hasRing"
          :circular="ring.circular"
          :inner-radius="ring.innerRadius"
          :name="`${name}-ring`"
          :outer-radius="ring.outerRadius"
          :texture="ring.texture"
          :tilt="ring.tilt"
          @ring-loaded="assetsLoaded++" />
  </Group>
  <Trail
    :inclination="inclinationRad"
    :semi-major="scaledX"
    :semi-minor="scaledZ"
    v-if="showTrail"
  />
</template>

<script lang="ts">
import { TextureMap } from "@/@types/app/texture-maps";
import { Moon as MoonInterface } from "@/@types/celestial/moon";
import RingProps from "@/@types/celestial/ring-props";
import { dispatchLoadedEvent } from "@/assets/three/loaders";
import { ATMOSPHERE_SCALE, RADIUS_SCALE } from "@/assets/util/sim.constants";
import Atmosphere from "@/components/three/util/Atmosphere.vue";
import Ring from "@/components/three/util/ring.vue";
import { Vector3 } from "three/src/math/Vector3";
import { Group } from "troisjs";
import { defineComponent, PropType } from "vue";
import Sphere, { SphereProps } from "../util/Sphere.vue";
import Trail from "../util/trail.vue";
import OrbittingBody from "./base/orbitting-body.vue";
import Moon from "./moon.vue";


export const PlanetProps = {
  ...SphereProps,
  moons: { type: Array as PropType<MoonInterface[]>, default: [] },
  atmosphereTexture: Object as PropType<TextureMap>,
  showTrail: { type: Boolean, default: true },
  ring: Object as PropType<RingProps>,
};

export default defineComponent({
  name: "planet",
  emits: ["planetLoaded"],
  extends: OrbittingBody,
  components: { Ring, Atmosphere, Group, Sphere, Trail, Moon },
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
    hasRing(): boolean {
      return this.ring !== undefined && this.ring.texture !== null;
    },
    hasAtmosphere(): boolean {
      return this.atmosphereTexture !== null && this.atmosphereTexture !== undefined;
    },
    maxRadius(): number {
      if (this.hasAtmosphere)
        return this.radius * ATMOSPHERE_SCALE;
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
      let num = this.moons.length + 1;
      if (this.hasRing) num += 1;
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
