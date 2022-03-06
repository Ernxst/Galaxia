<template>
  <PointLight
    ref="light"
    :cast-shadow="true"
    :color="starLightColour"
    :decay="2"
    :distance="0"
    :intensity="intensity"
    :position="initialPosition"
  />
  <Group ref="body"
         :position="initialPosition">
    <Sphere
      ref="sphere"
      :bump-map="bumpMap"
      :name="`${name}-sphere`"
      :radius="scaledRadius"
      :specular-map="specularMap"
      :texture="texture"
      :receive-shadow="receiveShadow"
      @click="onClick"
      @sphere-loaded="setupSphere"
    />
    <Atmosphere
      v-if="hasAtmosphere"
      ref="atmosphere"
      :name="`${name}-atmosphere`"
      :parent-radius="scaledRadius"
      :texture="atmosphereTexture"
      @atmosphere-loaded="assetsLoaded++"
    />
  </Group>
</template>

<script lang="ts">
import { TextureMap } from "@/@types/app/texture-maps";
import { NEAR } from "@/assets/three/camera/camera.constants";
import { dispatchLoadedEvent } from "@/assets/three/loaders";
import { BLOOM_LAYER } from "@/assets/three/three.constants";
import { LIGHTING_SCALE, NORMAL_BIAS, RADIUS_SCALE, SHADOW_BIAS, SHADOW_MAP_SIZE } from "@/assets/util/sim.constants";
import Atmosphere from "@/components/three/util/Atmosphere.vue";
import { Color } from "three/src/math/Color";
import { Object3D } from "three/src/core/Object3D";
import { PointLight as ThreePointLight } from "three/src/lights/PointLight";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
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
    atmosphereTexture: Object as PropType<TextureMap>,
    receiveShadow: { type: Boolean, default: false },
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
      return this.atmosphereTexture !== null && this.atmosphereTexture !== undefined;
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
      sphere.material.color = new Color(0xdcdcdc);
      sphere.material.needsUpdate = true;
      dispatchLoadedEvent(this.name);
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
