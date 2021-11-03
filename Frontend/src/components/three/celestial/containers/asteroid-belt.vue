<template>
  <Mesh ref="body">
    <LambertMaterial />
    <!-- <Asteroid
      v-for="asteroid in allAsteroids"
      key="asteroid"
      :ref="(el) => asteroidModels.push(el)"
      :name="asteroid.name"
      :size="asteroid.size"
      :detail="asteroid.detail"
      :scale="asteroid.scale"
      :initial-position="asteroid.initialPosition"
      :axial-tilt="asteroid.axialTilt"
      :day-length="asteroid.dayLength"
      :rotation="asteroid.rotation"
    /> -->
  </Mesh>
</template>

<script lang="ts">
  // TODO: Axial tilt of mesh
  import { Asteroid as AsteroidInterface } from "@/@types/celestial/asteroid";
  import { createAsteroidGeometries } from "@/assets/three/models/index";
  import { generateAsteroids } from "@/assets/util/index";
  import { DISTANCE_SCALE, RADIUS_SCALE } from "@/assets/util/sim.constants";
  import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
  import { LambertMaterial, Mesh } from "troisjs";
  import { defineComponent, PropType } from "vue";
  import Asteroid from "../asteroid.vue";
  import CelestialBody from "../base/celestial-body.vue";
  export default defineComponent({
    name: "asteroid-belt",
    extends: CelestialBody,
    components: { Mesh, Asteroid, LambertMaterial },
    props: {
      numOfAsteroids: { type: Number, default: 1000 },
      asteroids: { type: Array as PropType<AsteroidInterface[]>, default: [] },
      depth: { type: Number, default: 3000 },
      innerRadius: Number,
      outerRadius: Number,
      starRadius: { type: Number, default: 1 },
      fill: { type: Boolean, default: true },
      minSize: { type: Number, default: 60 },
      maxSize: { type: Number, default: 1000 },
    },
    data() {
      return {
        asteroidModels: [],
      };
    },
    beforeUpdate() {
      this.asteroidModels.length = 0;
    },
    computed: {
      allAsteroids(): AsteroidInterface[] {
        const asteroids = generateAsteroids(
          this.asteroidsToDraw,
          this.innerRadius * DISTANCE_SCALE + this.scaledStarRadius,
          this.outerRadius * DISTANCE_SCALE + this.scaledStarRadius,
          (this.depth * RADIUS_SCALE) / 2,
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
      const geometries = createAsteroidGeometries(this.allAsteroids);
      const mesh = this.$refs.body.o3d;
      mesh.geometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
    },
  });
</script>

<style scoped></style>
