<template>
  <InstancedMesh ref="body" :count="numOfAsteroids">
    <DodecahedronGeometry />
    <LambertMaterial />
  </InstancedMesh>
</template>

<script lang="ts">
  import { Asteroid as AsteroidInterface } from "@/@types/celestial/asteroid";
  import { generateAsteroids } from "@/assets/util/index";
  import { DISTANCE_SCALE, RADIUS_SCALE } from "@/assets/util/sim.constants";
  import { Object3D } from "three/src/core/Object3D";
  import { InstancedMesh as ThreeInstancedMesh } from "three/src/objects/InstancedMesh";
  import {
    DodecahedronGeometry,
    InstancedMesh,
    LambertMaterial,
  } from "troisjs";
  import { defineComponent, PropType } from "vue";
  import CelestialBody from "../base/celestial-body.vue";
  export default defineComponent({
    name: "asteroid-belt",
    extends: CelestialBody,
    components: { InstancedMesh, LambertMaterial, DodecahedronGeometry },
    props: {
      numOfAsteroids: { type: Number, default: 1000 },
      asteroids: { type: Array as PropType<AsteroidInterface[]>, default: [] },
      depth: { type: Number, default: 3000 },
      innerSemiMajor: Number,
      innerEccentricity: Number,
      outerSemiMajor: Number,
      outerEccentricity: Number,
      starRadius: { type: Number, default: 1 },
      fill: { type: Boolean, default: true },
      minSize: { type: Number, default: 60 },
      maxSize: { type: Number, default: 1000 },
    },
    computed: {
      allAsteroids(): AsteroidInterface[] {
        const asteroids = generateAsteroids(
          this.asteroidsToDraw,
          this.innerSemiMajor * DISTANCE_SCALE + this.scaledStarRadius,
          this.innerEccentricity,
          this.outerSemiMajor * DISTANCE_SCALE + this.scaledStarRadius,
          this.outerEccentricity,
          (this.depth * DISTANCE_SCALE) / 2,
          this.minSize * RADIUS_SCALE,
          this.maxSize * RADIUS_SCALE
        );
        return [...this.asteroids, ...asteroids];
      },
      asteroidsToDraw(): number {
        const num = this.numOfAsteroids - this.asteroids.length;
        return this.fill ? Math.max(num, 0) : 0;
      },
      scaledStarRadius(): number {
        return this.starRadius * RADIUS_SCALE;
      },
    },
    methods: {
      animate(dt: number) {
        this.spinOnAxis(dt);
      },
    },
    mounted() {
      const mesh: ThreeInstancedMesh = this.$refs.body.o3d;
      const dummy = new Object3D();

      for (let [index, asteroid] of this.allAsteroids.entries()) {
        const rotation = asteroid.rotation;
        if (rotation) dummy.rotation.set(rotation.x, rotation.y, rotation.z);
        const position = asteroid.initialPosition;
        if (position) dummy.position.set(position.x, position.y, position.z);

        const scale = asteroid.scale.multiplyScalar(asteroid.size);
        dummy.scale.set(scale.x, scale.y, scale.z);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
    },
  });
</script>

<style scoped></style>
