<template>
  <Group>
    <InstancedMesh ref="dim-stars"
                   :count="numOfDimStars">
      <SphereGeometry :height-segments="slices"
                      :width-segments="slices" />
      <BasicMaterial :props="{ opacity: 0.2 }" />
    </InstancedMesh>
    <InstancedMesh ref="medium-stars"
                   :count="numOfMediumStars">
      <SphereGeometry :height-segments="slices"
                      :width-segments="slices" />
      <BasicMaterial :props="{ opacity: 0.6 }" />
    </InstancedMesh>
    <InstancedMesh ref="bright-stars"
                   :count="numOfBrightStars">
      <SphereGeometry :height-segments="slices"
                      :width-segments="slices" />
      <BasicMaterial :props="{ opacity: 1 }" />
    </InstancedMesh>
  </Group>
</template>

<script lang="ts">
// TODO: Ensure stars are not generated within a star system
import { BLOOM_LAYER, SPHERE_SLICES } from "@/assets/three/three.constants";
import { STARFIELD_DIAMETER, STARFIELD_RADIUS, } from "@/assets/util/sim.constants";
import { Object3D } from "three/src/core/Object3D";
import { InstancedMesh as ThreeInstancedMesh } from "three/src/objects/InstancedMesh";
import { BasicMaterial, Group, InstancedMesh, SphereGeometry } from "troisjs";
import { defineComponent } from "vue";


export default defineComponent({
  name: "Starfield",
  components: { Group, InstancedMesh, BasicMaterial, SphereGeometry },
  data() {
    return {
      numOfDimStars: 1_000,
      numOfMediumStars: 1_000,
      numOfBrightStars: 1_000,
      slices: SPHERE_SLICES,
    };
  },
  methods: {
    drawStars(mesh: ThreeInstancedMesh, numOfPoints: number) {
      const dummy = new Object3D();
      for (let index = 0; index < numOfPoints; index++) {
        const x = STARFIELD_DIAMETER * Math.random() - STARFIELD_RADIUS;
        const y = STARFIELD_DIAMETER * Math.random() - STARFIELD_RADIUS;
        const z = STARFIELD_DIAMETER * Math.random() - STARFIELD_RADIUS;
        dummy.position.set(x, y, z);
        const scale = Math.random();
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      }
      mesh.layers.enable(BLOOM_LAYER);
      mesh.instanceMatrix.needsUpdate = true;
    },
    animate(force: number) {
      const dimStars: ThreeInstancedMesh = this.$refs["dim-stars"].mesh;
      const mediumStars: ThreeInstancedMesh = this.$refs["medium-stars"].mesh;
      const brightStars: ThreeInstancedMesh = this.$refs["bright-stars"].mesh;
      dimStars.rotation.y += force;
      mediumStars.rotation.y += force;
      brightStars.rotation.y += force;
    },
  },
  mounted() {
    this.drawStars(this.$refs["dim-stars"].mesh, this.numOfDimStars);
    this.drawStars(this.$refs["medium-stars"].mesh, this.numOfMediumStars);
    this.drawStars(this.$refs["bright-stars"].mesh, this.numOfBrightStars);
  },
});
</script>

<style scoped></style>
