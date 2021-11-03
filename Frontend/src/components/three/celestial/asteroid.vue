<template>
  <Mesh
    ref="body"
    :cast-shadow="true"
    :receive-shadow="true"
    :scale="scale"
    :position="initialPosition"
    :rotation="rotation"
  >
    <DodecahedronGeometry ref="geometry" :radius="size" :detail="detail" />
    <StandardMaterial :props="materialProps"></StandardMaterial>
  </Mesh>
</template>

<script lang="ts">
  import { Color } from "three/src/math/Color";
  import { DodecahedronGeometry, Mesh, StandardMaterial } from "troisjs";
  import { defineComponent } from "vue";
  import CelestialBody from "./base/celestial-body.vue";
  export default defineComponent({
    name: "asteroid",
    extends: CelestialBody,
    components: { Mesh, DodecahedronGeometry, StandardMaterial },
    props: {
      size: { type: Number, default: 1 },
      detail: { type: Number, default: 0 },
    },
    computed: {
      materialProps() {
        const colour = new Color("#FFFFFF");
        return {
          color: colour,
          roughness: 0.8,
          metalness: 1,
        };
      },
    },
  });
</script>

<style scoped></style>
