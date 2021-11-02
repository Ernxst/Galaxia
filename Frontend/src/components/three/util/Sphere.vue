<template>
  <TroisSphere
    :radius="scaledRadius"
    :width-segments="slices"
    :height-segments="slices"
    :scale="scale"
    :rotation="rotation"
    :cast-shadow="castShadow"
    :receive-shadow="receiveShadow"
  >
    <PhongMaterial :color="colour" :props="materialProperties" />
    <slot></slot>
  </TroisSphere>
</template>

<script lang="ts">
  // TODO: When creating atmosphere shell, make it a new component that extends this sphere component
  import { getTexture } from "@/assets/three/loaders";
  import { SPHERE_SLICES } from "@/assets/three/three.constants";
  import { Texture } from "three/src/textures/Texture";
  import { PhongMaterial, Sphere as TroisSphere } from "troisjs";
  import { defineComponent } from "vue";
  import BaseObject from "./BaseObject.vue";

  export const SphereProps = {
    radius: { type: Number, default: 1 },
    slices: { type: Number, default: SPHERE_SLICES },
    texture: { type: String, default: "" },
    bumpMap: { type: String },
    specularMap: { type: String },
    colour: { type: String, default: "#FFFFFF" },
    castShadow: { type: Boolean, default: false },
    receiveShadow: { type: Boolean, default: true },
    materialProps: Object,
  };

  export default defineComponent({
    name: "Sphere",
    components: { TroisSphere, PhongMaterial },
    extends: BaseObject,
    props: SphereProps,
    computed: {
      scaledRadius() {
        // return this.radius * RADIUS_SCALE;
        return this.radius;
      },
      materialProperties() {
        const props = { ...this.materialProps };

        if (this.texture)
          props.map = getTexture(this.texture).then((tex: Texture) => {
            return tex;
          });
        if (this.bumpMap)
          props.bumpMap = getTexture(this.bumpMap).then((tex: Texture) => {
            return tex;
          });
        if (this.specularMap)
          props.specularMap = getTexture(this.specularMap).then(
            (tex: Texture) => {
              return tex;
            }
          );

        return props;
      },
    },
  });
</script>

<style scoped></style>
