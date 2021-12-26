<template>
  <TroisSphere
    ref="body"
    :cast-shadow="castShadow"
    :height-segments="slices"
    :radius="radius"
    :receive-shadow="receiveShadow"
    :rotation="rotation"
    :scale="scale"
    :width-segments="slices"
  >
    <PhongMaterial
      :props="{
        ...materialProps,
        name: `${name}-material`,
        shininess: 0,
        bumpScale: bumpScale,
      }"
    />
    <slot></slot>
  </TroisSphere>
</template>

<script lang="ts">
import { getTexture } from "@/assets/three/loaders";
import { SPHERE_SLICES } from "@/assets/three/three.constants";
import { BUMP_SCALE } from "@/assets/util/sim.constants";
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial";
import { PhongMaterial, Sphere as TroisSphere } from "troisjs";
import { defineComponent } from "vue";
import BaseObject from "./BaseObject.vue";


export const SphereProps = {
  radius: { type: Number, default: 1 },
  slices: { type: Number, default: SPHERE_SLICES },
  texture: { type: String, default: "" },
  bumpMap: { type: String, default: "" },
  specularMap: { type: String, default: "" },
  castShadow: { type: Boolean, default: false },
  receiveShadow: { type: Boolean, default: true },
  materialProps: Object,
};

export default defineComponent({
  name: "Sphere",
  components: { TroisSphere, PhongMaterial },
  extends: BaseObject,
  props: SphereProps,
  emits: ["sphereLoaded"],
  data() {
    return {
      bumpScale: BUMP_SCALE,
    };
  },
  watch: {
    texture() {
      this.setTextures(this.material());
    },
    bumpMap() {
      this.setTextures(this.material());
    },
    specularMap() {
      this.setTextures(this.material());
    }
  },
  methods: {
    material(): MeshPhongMaterial {
      return this.mesh().material;
    },
    async setTextures(material: MeshPhongMaterial) {
      if (this.texture) material.map = await getTexture(this.texture);
      else (material.map) = null;
      if (this.bumpMap) material.bumpMap = await getTexture(this.bumpMap);
      else (material.bumpMap = null);
      if (this.specularMap) material.specularMap = await getTexture(this.specularMap);
      else (material.specularMap) = null;
      material.needsUpdate = true;
    },
  },
  mounted() {
    this.setTextures(this.material()).then((_) => (this.$emit("sphereLoaded")));
  },
});
</script>

<style scoped></style>
