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
    <Sphere
      ref="sphere"
      :name="`${name}-sphere`"
      :radius="scaledRadius"
      :texture="texture"
      :bump-map="bumpMap"
      :specular-map="specularMap"
      @sphere-loaded="setupSphere"
      @click="onClick"
    />
    <Atmosphere
      ref="atmosphere"
      v-if="hasAtmosphere"
      :name="`${name}-atmosphere`"
      :parent-radius="scaledRadius"
      :scale="atmosphere.scale"
      :texture="atmosphere.texture"
      :opacity="atmosphere.opacity"
      @atmosphere-loaded="assetsLoaded++"
    />
  </Group>
</template>

<script lang="ts">
import AtmosphereProps from "@/@types/celestial/atmosphere-props";
import { NEAR } from "@/assets/three/camera/camera.constants";
import { dispatchLoadedEvent } from "@/assets/three/loaders";
import { BLOOM_LAYER } from "@/assets/three/three.constants";
import { LIGHTING_SCALE, NORMAL_BIAS, RADIUS_SCALE, SHADOW_BIAS, SHADOW_MAP_SIZE } from "@/assets/util/sim.constants";
import Atmosphere from "@/components/three/util/Atmosphere.vue";
import { Object3D } from "three/src/core/Object3D";
import { PointLight as ThreePointLight } from "three/src/lights/PointLight";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Color } from "three/src/math/Color";
import { Vector2 } from "three/src/math/Vector2";
import { Mesh } from "three/src/objects/Mesh";
import { Group, PointLight } from "troisjs";
import { defineComponent, PropType } from "vue";
import Sphere, { SphereProps } from "../util/Sphere.vue";
import OrbittingBody from "./base/orbitting-body.vue";


export default defineComponent({
  name: "star",
  extends: OrbittingBody,
  emits: ["starLoaded"],
  components: { Atmosphere, Group, Sphere, PointLight },
  props: {
    ...SphereProps,
    starLightColour: { type: String, default: "#FFFFFF" },
    luminosity: { type: Number, default: 3e27 },
    atmosphere: Object as PropType<AtmosphereProps>,
  },
  data() {
    return {
      assetsLoaded: 0,
    };
  },
  watch: {
    loaded() {
      this.setupSphere();
    },
  },
  computed: {
    hasAtmosphere(): boolean {
      return this.atmosphere !== undefined;
    },
    scaledRadius(): number {
      return this.radius * RADIUS_SCALE;
    },
    intensity(): number {
      return this.luminosity * LIGHTING_SCALE;
    },
    modelsToLoad(): number {
      return this.hasAtmosphere ? 2 : 1;
    },
    loaded(): boolean {
      return this.assetsLoaded === this.modelsToLoad;
    },
    isStar(): boolean {
      return true;
    }
  },
  methods: {
    setupSphere() {
      const sphere: Mesh = this.$refs.sphere.mesh();
      const oldMat = sphere.material;
      sphere.material = new MeshBasicMaterial();
      sphere.material.name = oldMat.name;
      sphere.material.map = oldMat.map;
      sphere.material.bumpMap = oldMat.bumpMap;
      sphere.material.specularMap = oldMat.specularMap;
      sphere.material.color = new Color(0xff6600);
      sphere.material.needsUpdate = true;
      dispatchLoadedEvent();
      this.$emit("starLoaded");
    },
  },
  mounted() {
    const mesh: Mesh = this.mesh();
    mesh.layers.enable(BLOOM_LAYER);
    mesh.traverse((object: Object3D) => {
      object.layers.enable(BLOOM_LAYER);
    });

    const light: ThreePointLight = this.$refs.light.light;
    light.shadow.bias = SHADOW_BIAS;
    light.shadow.normalBias = NORMAL_BIAS;
    light.shadow.camera.near = NEAR;
    light.shadow.mapSize = new Vector2(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
  },
});
</script>

<style scoped></style>
