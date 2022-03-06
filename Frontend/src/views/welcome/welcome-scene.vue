<template>
  <Group ref="group">
    <star ref="star"
          v-bind="starData"
          @star-loaded="assetsLoaded++" />
    <InstancedMesh ref="inner"
                   :count="innerPoints">
      <SphereGeometry />
      <BasicMaterial />
    </InstancedMesh>
    <InstancedMesh ref="middle"
                   :count="middlePoints">
      <SphereGeometry />
      <BasicMaterial />
    </InstancedMesh>
    <InstancedMesh ref="outer"
                   :count="outerPoints">
      <SphereGeometry />
      <BasicMaterial />
    </InstancedMesh>
    <InstancedMesh ref="furthest"
                   :count="furthestPoints">
      <SphereGeometry />
      <BasicMaterial />
    </InstancedMesh>
    <InstancedMesh ref="asteroids"
                   :count="numOfAsteroids">
      <SphereGeometry />
      <BasicMaterial :props="{color: `#F39041`}" />
    </InstancedMesh>
  </Group>
</template>

<script lang="ts">
import { Star as StarInterface } from "@/@types/celestial/star";
import { computeCentreAndSize } from "@/assets/three";
import { BLOOM_LAYER } from "@/assets/three/three.constants";
import { SOLAR_MASS } from "@/assets/util/celestial.constants";
import { RADIUS_SCALE } from "@/assets/util/sim.constants";
import Star from "@/components/three/celestial/star.vue";
import * as MathUtils from "three/src/math/MathUtils";
import { Object3D } from "three/src/core/Object3D";
import { Vector3 } from "three/src/math/Vector3";
import { InstancedMesh as ThreeInstancedMesh } from "three/src/objects/InstancedMesh";
import { Mesh } from "three/src/objects/Mesh";
import { BasicMaterial, Group, InstancedMesh, Points, PointsMaterial, SphereGeometry } from "troisjs";
import { defineComponent } from "vue";
import randFloat = MathUtils.randFloat;


export default defineComponent({
  name: "welcome-scene",
  components: { Star, Group, InstancedMesh, SphereGeometry, BasicMaterial, Points, PointsMaterial },
  emits: ["dataLoaded", "focus", "loaded"],
  computed: {
    starData(): StarInterface {
      return {
        name: "Sun",
        radius: 696_340,
        caption: "",
        shortDescription: "",
        description: "",
        mass: SOLAR_MASS,
        meanVelocity: 220,
        axialTilt: 7.25,
        dayLength: 0,
        luminosity: 3e27,
        texture: {
          url: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/sun%2Fsun.webp?alt=media&token=addfe03f-ecd7-4d25-b30f-2b0dceefd61c",
        },
        atmosphereTexture: null,
      };
    },
  },
  data() {
    return {
      assetsToLoad: 6,
      assetsLoaded: 0,
      innerPoints: 145,
      middlePoints: 160,
      outerPoints: 200,
      furthestPoints: 215,
      numOfAsteroids: 2250,
    };
  },
  watch: {
    assetsLoaded(newVal: number, oldVal: number) {
      if (newVal === this.assetsToLoad) {
        const { centre, size } = computeCentreAndSize(this.$refs.star.mesh());
        const z = size.length();
        this.$emit("loaded", { camPos: new Vector3(z / 1.33, z * 2, z / 1.33), models: [] });
      }
    }
  },
  methods: {
    makeTrail(mesh: ThreeInstancedMesh, numOfPoints: number, radius: number) {
      const dummy = new Object3D();
      const increment = (2 * Math.PI) / numOfPoints;
      let angle = 0;

      for (let i = 0; i < numOfPoints; i++) {
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        angle += increment;
        dummy.position.set(x, 0, z);
        dummy.scale.setScalar(0.75);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
      mesh.layers.enable(BLOOM_LAYER);
      this.assetsLoaded++;
    },
    setupAsteroids(mesh: ThreeInstancedMesh, points: number, inner: number, outer: number) {
      const dummy = new Object3D();

      for (let i = 0; i < this.numOfAsteroids; i++) {
        const radius = randFloat(inner, outer);
        const angle = Math.random() * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        dummy.position.set(x, 0, z);
        dummy.scale.setScalar(0.5);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
      mesh.layers.enable(BLOOM_LAYER);
      this.assetsLoaded++;
    },
    animate(speed: number) {
      const mesh: Mesh = this.$refs.group.o3d;
      const rotation = 7e-4 * speed;
      mesh.rotation.y += rotation;
      const asteroids = this.$refs.asteroids.mesh;
      asteroids.rotation.y += rotation;
    },
  }, mounted() {
    this.$emit("dataLoaded", 1);
    const mesh: Mesh = this.$refs.group.o3d;
    mesh.rotation.x = -Math.PI / 8;
    const starRadius = this.starData.radius * RADIUS_SCALE;
    this.makeTrail(this.$refs.inner.mesh, this.innerPoints, starRadius * 1.75);
    this.makeTrail(this.$refs.middle.mesh, this.middlePoints, starRadius * 2.5);
    this.makeTrail(this.$refs.outer.mesh, this.outerPoints, starRadius * 3.5);
    this.makeTrail(this.$refs.furthest.mesh, this.furthestPoints, starRadius * 4.7);
    this.setupAsteroids(this.$refs.asteroids.mesh, this.numOfAsteroids, starRadius * 5, starRadius * 6);
  }
});
</script>

<style scoped>

</style>
