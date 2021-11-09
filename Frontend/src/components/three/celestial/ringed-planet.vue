<template>
  <Group ref="body" :position="initialPos">
    <template v-if="hasMoons">
      <SpotLight ref="planetlight" :cast-shadow="true" :decay="2" :distance="lightDistance" :intensity="0.05"
                 :position="{x:0, y:0, z:0}" :shadow-map-size="{width: lightDistance, height: lightDistance }"/>
    </template>
    <Sphere
      :name="`${name}-sphere`"
      :radius="scaledRadius"
      :texture="texture"
      :bump-map="bumpMap"
      :specular-map="specularMap"
      :material-props="{ transparent: true }"
      :cast-shadow="true"
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
    <ring ref="ring" :name="`${name}-ring`"
          :inner-radius="ring.innerRadius"
          :outer-radius="ring.outerRadius"
          :texture="ring.texture"
          :circular="ring.circular"
          :tilt="ring.tilt"
          @ring-loaded="assetsLoaded++"/>
  </Group>
  <Trail
    :semi-major="scaledX"
    :semi-minor="scaledZ"
    :inclination="inclinationRad"
  />
</template>

<script lang="ts">
import RingProps from "@/@types/celestial/ring-props";
import Moon from "@/components/three/celestial/moon.vue";
import Atmosphere from "@/components/three/util/Atmosphere.vue";
import Ring from "@/components/three/util/ring.vue";
import Sphere from "@/components/three/util/Sphere.vue";
import Trail from "@/components/three/util/trail.vue";
import { Group, SpotLight } from "troisjs";
import { defineComponent, PropType } from "vue";
import Planet, { PlanetProps } from "./planet.vue";


export default defineComponent({
  name: "ringed-planet",
  components: { Ring, Atmosphere, Group, Sphere, Trail, Moon, SpotLight },
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
