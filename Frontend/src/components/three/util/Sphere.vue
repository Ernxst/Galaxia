<template>
  <TroisSphere
    ref="body"
    :radius="radius"
    :width-segments="slices"
    :height-segments="slices"
    :scale="scale"
    :rotation="rotation"
    :cast-shadow="castShadow"
    :receive-shadow="receiveShadow"
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
  // TODO: When creating atmosphere shell, make it a new component that extends this sphere component
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
    bumpMap: { type: String },
    specularMap: { type: String },
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
    methods: {
      mesh() {
        return this.$refs.body.mesh;
      },
      async setTextures(material: MeshPhongMaterial) {
        if (this.texture) material.map = await getTexture(this.texture);
        if (this.bumpMap) material.bumpMap = await getTexture(this.bumpMap);
        if (this.specularMap)
          material.specularMap = await getTexture(this.specularMap);
        material.needsUpdate = true;
      },
    },
    mounted() {
      const material: MeshPhongMaterial = this.mesh().material;
      this.setTextures(material).then((_) => {
        this.$emit("sphereLoaded");
      });
    },
  });
</script>

<style scoped></style>
