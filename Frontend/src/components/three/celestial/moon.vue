<template>
  <Group ref="body" :position="initialPos">
    <Sphere
      :name="`${name}-sphere`"
      :radius="scaledRadius"
      :texture="texture"
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
  </Group>
  <Trail
    :semi-major="scaledX"
    :semi-minor="scaledZ"
    :inclination="inclinationRad"
  />
</template>

<script lang="ts">
import AtmosphereProps from "@/@types/celestial/atmosphere-props";
import { dispatchLoadedEvent } from "@/assets/three/loaders";
import { ATMOSPHERE_SCALE, RADIUS_SCALE } from "@/assets/util/sim.constants";
import Atmosphere from "@/components/three/util/Atmosphere.vue";
import { Vector3 } from "three/src/math/Vector3";
import { Group } from "troisjs";
import { defineComponent, PropType } from "vue";
import Sphere, { SphereProps } from "../util/Sphere.vue";
import Trail from "../util/trail.vue";
import OrbittingBody from "./base/orbitting-body.vue";


export default defineComponent({
  name: "moon",
  extends: OrbittingBody,
  emits: ["moonLoaded"],
  components: { Atmosphere, Group, Sphere, Trail },
  props: {
    ...SphereProps,
    atmosphere: Object as PropType<AtmosphereProps>,
  },
  data() {
    return {
      assetsLoaded: 0,
    };
  },
  watch: {
    loaded() {
      dispatchLoadedEvent();
      this.$emit("moonLoaded");
    },
  },
  computed: {
    // TODO: Atmosphere scale should be derived from parent (or set to 1 if no atmosphere)
    offset(): number {
      return this.starRadius * RADIUS_SCALE * ATMOSPHERE_SCALE + this.scaledRadius;
    },
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
      return this.hasAtmosphere ? 2 : 1;
    },
    loaded(): boolean {
      return this.assetsLoaded === this.modelsToLoad;
    },
  },
});
</script>

<style scoped></style>
