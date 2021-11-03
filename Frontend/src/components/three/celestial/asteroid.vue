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
    <LambertMaterial :props="materialProps"></LambertMaterial>
  </Mesh>
</template>

<script lang="ts">
  import { Color } from "three/src/math/Color";
  import { DodecahedronGeometry, Mesh, LambertMaterial } from "troisjs";
  import { defineComponent } from "vue";
  import CelestialBody from "./base/celestial-body.vue";
  export default defineComponent({
    name: "asteroid",
    extends: CelestialBody,
    components: { Mesh, DodecahedronGeometry, LambertMaterial },
    props: {
      size: { type: Number, default: 1 },
      detail: { type: Number, default: 0 },
      colour: { type: String, default: "#FFFFFF" },
    },
    computed: {
      materialProps() {
        return {
          color: new Color(this.colour),
        };
      },
    },
  });
</script>

<style scoped></style>
