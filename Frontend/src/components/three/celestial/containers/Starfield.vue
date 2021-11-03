<template>
  <Group ref="starfield">
    <Points ref="dim-stars">
      <BufferGeometry ref="dim-geo" />
      <PointsMaterial ref="dim-mat" :props="materialProps(0.2)" />
    </Points>
    <Points ref="medium-stars">
      <BufferGeometry ref="med-geo" />
      <PointsMaterial ref="med-mat" :props="materialProps(0.6)" />
    </Points>
    <Points ref="bright-stars">
      <BufferGeometry ref="bright-geo" />
      <PointsMaterial ref="bright-mat" :props="materialProps(1)" />
    </Points>
  </Group>
</template>

<script lang="ts">
  // TODO: Ensure stars are not generated within a star system
  // TODO: Use single buffer geometry for all
  import { getTexture } from "@/assets/three/loaders";
  import {
    NUM_OF_BRIGHT_STARS,
    NUM_OF_DIM_STARS,
    NUM_OF_MEDIUM_STARS,
    STARFIELD_DIAMETER,
    STARFIELD_RADIUS,
  } from "@/assets/util/sim.constants";
  import { AdditiveBlending } from "three/src/constants";
  import { Float32BufferAttribute } from "three/src/core/BufferAttribute";
  import { BufferGeometry as ThreeBufferGeometry } from "three/src/core/BufferGeometry";
  import { Points as ThreePoints } from "three/src/objects/Points";
  import { BufferGeometry, Group, Points, PointsMaterial } from "troisjs";
  import { defineComponent } from "vue";
  export default defineComponent({
    name: "Starfield",
    components: { Group, Points, BufferGeometry, PointsMaterial },
    methods: {
      geoVertices(numOfPoints: number): number[] {
        const vertices = [];
        for (let i = 0; i < numOfPoints; i++) {
          const x = STARFIELD_DIAMETER * Math.random() - STARFIELD_RADIUS;
          const y = STARFIELD_DIAMETER * Math.random() - STARFIELD_RADIUS;
          const z = STARFIELD_DIAMETER * Math.random() - STARFIELD_RADIUS;
          vertices.push(x, y, z);
        }
        return vertices;
      },
      async materialProps(opacity: number) {
        const map = await getTexture(
          "https://images.unsplash.com/photo-1602614023179-25a315daf1a6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2940&q=80"
        );
        return {
          size: 5,
          sizeAttenuation: true,
          depthWrite: false,
          transparent: true,
          blending: AdditiveBlending,
          map,
          opacity,
        };
      },
      generatePoints(component: typeof BufferGeometry, numOfPoints: number) {
        const geometry: ThreeBufferGeometry = component.geometry;
        const vertices: number[] = this.geoVertices(numOfPoints);
        geometry.setAttribute(
          "position",
          new Float32BufferAttribute(vertices, 3)
        );
        geometry.setDrawRange(0, numOfPoints);
      },
      animate(force: number) {
        const dimStars: ThreePoints = this.$refs["dim-stars"].mesh;
        const mediumStars: ThreePoints = this.$refs["medium-stars"].mesh;
        const brightStars: ThreePoints = this.$refs["bright-stars"].mesh;
        dimStars.rotation.y += force;
        mediumStars.rotation.y += force;
        brightStars.rotation.y += force;
      },
    },
    mounted() {
      this.generatePoints(this.$refs["dim-geo"], NUM_OF_DIM_STARS);
      this.generatePoints(this.$refs["med-geo"], NUM_OF_MEDIUM_STARS);
      this.generatePoints(this.$refs["bright-geo"], NUM_OF_BRIGHT_STARS);
    },
  });
</script>

<style scoped></style>
