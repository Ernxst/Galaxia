<template>
  <Group ref="body" :position="initialPosition">
    <Asteroid
      v-for="index in asteroidsToDraw"
      key="index"
      :ref="(el) => asteroidModels.push(el)"
      :name="`asteroid-${index}`"
      :size="randomSize()"
      :detail="randomDetail()"
      :scale="randomScale()"
      :initial-position="randomPosition()"
      :axial-tilt="randomAxialTilt()"
      :day-length="randomDayLength()"
      :rotation="randomRotation()"
    />
    <Asteroid
      v-for="asteroid in asteroids"
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
    />
  </Group>
</template>

<script lang="ts">
  // TODO: Use 3D gLTF models as well as random geometries for asteroids
  import { Asteroid as AstroidInterface } from "@/@types/celestial/asteroid";
  import { randomNumber } from "@/assets/util/index";
  import { RADIUS_SCALE } from "@/assets/util/sim.constants";
  import { Vector3 } from "three/src/math/Vector3";
  import { Group } from "troisjs";
  import { defineComponent, PropType } from "vue";
  import Asteroid from "../asteroid.vue";
  import OrbittingBody from "../base/orbitting-body.vue";
  export default defineComponent({
    name: "asteroid-belt",
    extends: OrbittingBody,
    components: { Group, Asteroid },
    props: {
      numOfAsteroids: { type: Number, default: 1000 },
      asteroids: { type: Array as PropType<AstroidInterface[]>, default: [] },
      models: { type: Array as PropType<string[]>, default: [] },
      height: { type: Number, default: 10 },
      innerRadius: Number,
      outerRadius: Number,
      fill: { type: Boolean, default: true },
    },
    data() {
      return {
        asteroidModels: [],
      };
    },
    beforeUpdate() {
      this.asteroidModels = [];
    },
    computed: {
      asteroidsToDraw(): number {
        const num = this.numOfAsteroids - this.asteroids.length;
        return this.fill ? Math.max(num, 0) : 0;
      },
      scaledStarRadius(): number {
        return this.starRadius * RADIUS_SCALE;
      },
      initialPos(): Vector3 {
        return this.computeNewPos(this.angle);
      },
    },
    methods: {
      // TODO: Move methods to util class
      randomSize(): number {
        return randomNumber(0.03, 0.1);
      },
      randomDetail(): number {
        return Math.ceil(randomNumber(1, 12));
      },
      randomScale(): Vector3 {
        return new Vector3(
          1 + Math.random() * 0.4,
          1 + Math.random() * 0.8,
          1 + Math.random() * 0.4
        );
      },
      randomRotation(): Vector3 {
        return new Vector3();
      },
      randomPosition(): Vector3 {
        const x =
          randomNumber(this.innerRadius, this.outerRadius) +
          this.scaledStarRadius;
        const y = randomNumber(-this.height / 2, this.height / 2);
        const z =
          randomNumber(this.innerRadius, this.outerRadius) +
          this.scaledStarRadius;
        return new Vector3(x, y, z);
      },
      randomDayLength(): number {
        return randomNumber(0, 1_000_000);
      },
      randomAxialTilt(): number {
        return randomNumber(0, 90);
      },
      afterOrbit(dt: number) {
        for (const asteroid of this.asteroidModels) asteroid.rotate(dt);
      },
    },
  });
</script>

<style scoped></style>
