<template>
  <Group ref="body"
         :position="initialPos">
    <Sphere
      :bump-map="bumpMap"
      :cast-shadow="true"
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
      :ref="(el) => moonComponents.push(el)"
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
      :star-radius="radius"
      :texture="moon.texture"
      @click="$emit('click', $event)"
      @moon-loaded="assetsLoaded++"
    />
    <ring ref="ring"
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
  />
</template>

<script lang="ts">
import RingProps from "@/@types/celestial/ring-props";
import Moon from "@/components/three/celestial/moon.vue";
import Atmosphere from "@/components/three/util/Atmosphere.vue";
import Ring from "@/components/three/util/ring.vue";
import Sphere from "@/components/three/util/Sphere.vue";
import Trail from "@/components/three/util/trail.vue";
import { Group } from "troisjs";
import { defineComponent, PropType } from "vue";
import Planet, { PlanetProps } from "./planet.vue";


export default defineComponent({
  name: "ringed-planet",
  components: { Ring, Atmosphere, Group, Sphere, Trail, Moon },
  extends: Planet,
  props: {
    ...PlanetProps,
    ring: Object as PropType<RingProps>,
  },
  computed: {
    modelsToLoad(): number {
      const num = this.moons.length + 2;
      return this.hasAtmosphere ? num + 1 : num;
    },
    hasRing(): boolean {
      return true;
    }
  }
});
</script>

<style scoped>
</style>
