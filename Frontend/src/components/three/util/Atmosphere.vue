<template>
  <TroisSphere
    ref="body"
    :cast-shadow="false"
    :height-segments="slices"
    :radius="scale * parentRadius"
    :receive-shadow="false"
    :rotation="rotation"
    :width-segments="slices"
  >
    <PhongMaterial
      :props="{
        ...materialProps,
        name: `${name}-atmosphere-material`,
        shininess: 0,
        transparent: true,
      }"
    />
    <slot></slot>
  </TroisSphere>
</template>

<script lang="ts">
import { getTexture } from "@/assets/three/loaders";
import { ATMOSPHERE_OPACITY, ATMOSPHERE_SCALE } from "@/assets/util/sim.constants";
import Sphere from "@/components/three/util/Sphere.vue";
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial";
import { PhongMaterial, Sphere as TroisSphere } from "troisjs";
import { defineComponent } from "vue";


export default defineComponent({
  name: "Atmosphere",
  components: { TroisSphere, PhongMaterial },
  extends: Sphere,
  props: {
    parentRadius: Number,
    opacity: { type: Number, default: ATMOSPHERE_OPACITY },
    scale: { type: Number, default: ATMOSPHERE_SCALE }
  },
  emits: ["atmosphereLoaded"],
  methods: {
    async setTextures(material: MeshPhongMaterial) {
      if (this.texture) material.map = await getTexture(this.texture.url);
      material.userData.isAtmosphere = true;
      material.needsUpdate = true;
    },
  },
  mounted() {
    const material: MeshPhongMaterial = this.mesh().material;
    this.setTextures(material).then((_) => {
      this.$emit("atmosphereLoaded");
    });
  },
});
</script>

<style scoped></style>
