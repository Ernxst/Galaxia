<template>
  <Group ref="body" :position="initialPos">
    <template v-if="hasMoons">
      <SpotLight ref="planetlight" :cast-shadow="true" :decay="2" :distance="lightDistance" :intensity="0.1"
                 :position="{x:0, y:0, z:0}" :shadow-map-size="{width: lightDistance, height: lightDistance }"/>
    </template>
    <Sphere
      :name="`${name}-sphere`"
      :radius="scaledRadius"
      :texture="texture"
      :bump-map="bumpMap"
      :specular-map="specularMap"
      :material-props="{ transparent: true }"
      @sphere-loaded="assetsLoaded++"
      @click="onClick"
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
      :ref="addMoon"
      :name="moon.name"
      :mass="moon.mass"
      :radius="moon.radius"
      :inclination="moon.inclination"
      :semi-major="moon.semiMajor"
      :semi-minor="moon.semiMinor"
      :eccentricity="moon.eccentricity"
      :orbital-period="moon.orbitalPeriod"
      :mean-velocity="moon.meanVelocity"
      :star-radius="maxRadius"
      :day-length="moon.dayLength"
      :axial-tilt="moon.axialTilt"
      :render-order="moons.length - index"
      :texture="moon.texture"
      :bump-map="moon.bumpMap"
      :specular-map="moon.specularMap"
      @moon-loaded="assetsLoaded++"
      @click="$emit('click', $event)"
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
import { Moon as MoonInterface } from "@/@types/celestial/moon";
import { dispatchLoadedEvent } from "@/assets/three/loaders";
import { RADIUS_SCALE } from "@/assets/util/sim.constants";
import Atmosphere from "@/components/three/util/Atmosphere.vue";
import { SpotLight as ThreeSpotLight } from "three/src/lights/SpotLight";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";
import { Group, SpotLight } from "troisjs";
import { defineComponent, PropType } from "vue";
import Sphere, { SphereProps } from "../util/Sphere.vue";
import Trail from "../util/trail.vue";
import OrbittingBody from "./base/orbitting-body.vue";
import Moon from "./moon.vue";


export const PlanetProps = {
  ...SphereProps,
  atmosphere: Object as PropType<AtmosphereProps>,
  moons: { type: Array as PropType<MoonInterface[]>, default: [] },
};

export default defineComponent({
  name: "planet",
  emits: ["planetLoaded"],
  extends: OrbittingBody,
  components: { Atmosphere, Group, Sphere, Trail, Moon, SpotLight },
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
      dispatchLoadedEvent();
      this.$emit("planetLoaded");
    },
  },
  computed: {
    lightDistance(): number {
      return this.scaledRadius * 4.0;
    },
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
    rotate(rotation: Vector3) {
      this.rotation.add(rotation);
      const mesh: Mesh = this.mesh();
      mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
      if (this.hasMoons) this.rotateLight(rotation);
    },
    rotateLight(rotation: Vector3) {
      const doubled = rotation.clone().multiplyScalar(2.0);
      const planetLight: ThreeSpotLight = this.$refs.planetlight.light;
      planetLight.rotation.x -= doubled.x;
      planetLight.rotation.y -= doubled.y;
      planetLight.rotation.z -= doubled.z;
      const newPos = planetLight.position.clone().sub(doubled);
      planetLight.target.position.set(newPos.x, newPos.y, newPos.z);
      planetLight.target.updateMatrixWorld();
    },
    addMoon(el: typeof Moon) {
      this.moonComponents[el.name] = el;
      this.models.push(el);
    },
    getMoon(name: string) : typeof Moon | undefined {
      return this.moonComponents[name];
    },
  },
  mounted() {
    if (this.hasMoons) {
      const planetLight: ThreeSpotLight = this.$refs.planetlight.light;
      planetLight.target.position.set(-1, 0, 0);
      planetLight.target.updateMatrixWorld();
    }
  }
});
</script>

<style scoped></style>
