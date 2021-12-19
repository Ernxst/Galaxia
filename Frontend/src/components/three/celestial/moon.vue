<template>
  <Group ref="body"
         :position="initialPos">
    <Sphere
      :material-props="{ transparent: true }"
      :name="`${name}-sphere`"
      :radius="scaledRadius"
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
  </Group>
  <Trail
    :inclination="inclinationRad"
    :semi-major="scaledX"
    :semi-minor="scaledZ"
  />
</template>

<script lang="ts">
import AtmosphereProps from "@/@types/celestial/atmosphere-props";
import { dispatchLoadedEvent } from "@/assets/three/loaders";
import { RADIUS_SCALE } from "@/assets/util/sim.constants";
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
    atmosphereTexture: { type: String, default: "" },
  },
  data() {
    return {
      assetsLoaded: 0,
    };
  },
  watch: {
    loaded() {
      dispatchLoadedEvent(this.name);
      this.$emit("moonLoaded");
    },
  },
  computed: {
    offset(): number {
      return this.starRadius * RADIUS_SCALE + this.scaledRadius * 2.0;
    },
    hasAtmosphere(): boolean {
      return this.atmosphere !== undefined;
    },
    scaledRadius(): number {
      return this.radius * RADIUS_SCALE;
    },
    initialPos(): Vector3 {
      this.computeNewPos(this.angle);
      return this.newPos;
    },
    modelsToLoad(): number {
      return this.hasAtmosphere ? 2 : 1;
    },
    loaded(): boolean {
      return this.assetsLoaded === this.modelsToLoad;
    },
    isMoon(): boolean {
      return true;
    }
  },
});
</script>

<style scoped></style>
