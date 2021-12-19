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
      :parent-radius="scaledRadius"
      :texture="atmosphereTexture"
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
    atmosphereTexture: String,
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
      return this.atmosphereTexture !== null;
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
