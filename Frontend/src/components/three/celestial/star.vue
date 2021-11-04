<template>
  <PointLight
    ref="light"
    :color="starLightColour"
    :intensity="intensity"
    :position="initialPosition"
    :distance="0"
    :cast-shadow="true"
    :decay="2"
  />
  <Group ref="body" :position="initialPosition">
    <Sphere ref="sphere" :name="`${name}-sphere`" :radius="scaledRadius">
    </Sphere>
  </Group>
</template>

<script lang="ts">
  import { BLOOM_LAYER } from "@/assets/three/three.constants";
  import { LIGHTING_SCALE, RADIUS_SCALE } from "@/assets/util/sim.constants";
  import { Object3D } from "three/src/core/Object3D";
  import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
  import { Color } from "three/src/math/Color";
  import { Mesh } from "three/src/objects/Mesh";
  import { Group, PointLight } from "troisjs";
  import { defineComponent } from "vue";
  import Sphere, { SphereProps } from "../util/Sphere.vue";
  import OrbittingBody from "./base/orbitting-body.vue";
  export default defineComponent({
    name: "star",
    extends: OrbittingBody,
    components: { Group, Sphere, PointLight },
    props: {
      ...SphereProps,
      starLightColour: { type: String, default: "#FFFFFF" },
      luminosity: { type: Number, default: 3e27 },
    },
    computed: {
      scaledRadius(): number {
        return this.radius * RADIUS_SCALE;
      },
      intensity(): number {
        return this.luminosity * LIGHTING_SCALE;
      },
    },
    mounted() {
      const mesh: Mesh = this.$refs.body.o3d;
      mesh.layers.enable(BLOOM_LAYER);
      mesh.traverse((object: Object3D) => {
        object.layers.enable(BLOOM_LAYER);
      });

      const sphere: Mesh = this.$refs.sphere.mesh();
      const oldMat = sphere.material;
      sphere.material = new MeshBasicMaterial();
      sphere.material.map = oldMat.map;
      sphere.material.bumpMap = oldMat.bumpMap;
      sphere.material.specularMap = oldMat.specularMap;
      sphere.material.color = new Color(0xff6600);
    },
  });
</script>

<style scoped></style>
