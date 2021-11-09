<template>
  <InstancedMesh ref="body" :count="numOfAsteroids">
    <DodecahedronGeometry />
    <LambertMaterial />
  </InstancedMesh>
</template>

<script lang="ts">
  import { Asteroid as AsteroidInterface } from "@/@types/celestial/asteroid";
  import { generateAsteroids } from "@/assets/util";
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
  import { dispatchLoadedEvent } from "@/assets/three/loaders";
  import { Vector3 } from "three/src/math/Vector3";

  export default defineComponent({
    name: "asteroid-belt",
    extends: CelestialBody,
    emits: ["asteroidBeltLoaded"],
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
      const mesh: ThreeInstancedMesh = this.mesh();
      const dummy = new Object3D();

      for (let [index, asteroid] of this.allAsteroids.entries()) {
        const rotation = asteroid.rotation || new Vector3();
        rotation.add(new Vector3(asteroid.axialTilt, 0, 0));
        dummy.rotation.set(rotation.x, rotation.y, rotation.z);

        const position = asteroid.initialPosition || new Vector3();
        dummy.position.set(position.x, position.y, position.z);

        const scale = asteroid.scale.multiplyScalar(asteroid.size);
        dummy.scale.set(scale.x, scale.y, scale.z);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
      dispatchLoadedEvent();
      this.$emit("asteroidBeltLoaded");
    },
  });
</script>

<style scoped></style>
