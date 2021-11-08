<template>
  <Group ref="body">
    <trois-ring
      ref="upper"
      :receive-shadow="true"
      :cast-shadow="false"
      :innerRadius="scaledInnerRadius"
      :outerRadius="scaledOuterRadius"
      :theta-segments="slices"
    >
      <PhongMaterial :props="{transparent: true}"/>
    </trois-ring>
    <trois-ring
      ref="lower"
      :receive-shadow="true"
      :cast-shadow="false"
      :innerRadius="scaledInnerRadius"
      :outerRadius="scaledOuterRadius"
      :theta-segments="slices"
    >
      <BasicMaterial :props="{transparent: true}"/>
    </trois-ring>
  </Group>
</template>

<script lang="ts">
// TODO: Ring rotation
import { getTexture } from "@/assets/three/loaders";
import { SPHERE_SLICES } from "@/assets/three/three.constants";
import { RADIUS_SCALE } from "@/assets/util/sim.constants";
import { RingGeometry } from "three/src/geometries/RingGeometry";
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial";
import { Matrix4 } from "three/src/math/Matrix4";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";
import { BasicMaterial, Group, PhongMaterial, Ring as TroisRing } from "troisjs";
import { defineComponent } from "vue";
import BaseObject from "./BaseObject.vue";


export default defineComponent({
  name: "Ring",
  extends: BaseObject,
  emits: ["ringLoaded"],
  components: { Group, TroisRing, PhongMaterial, BasicMaterial },
  props: {
    tilt: Number,
    texture: { type: String, default: "" },
    innerRadius: { type: Number, default: 1 },
    outerRadius: { type: Number, default: 2 },
    circular: Boolean,
    slices: { type: Number, default: SPHERE_SLICES },
  },
  data() {
    return {
      axis: new Vector3(0, 1, 0)
    };
  },
  computed: {
    scaledInnerRadius() {
      return this.innerRadius * RADIUS_SCALE;
    },
    scaledOuterRadius() {
      return this.outerRadius * RADIUS_SCALE;
    },
    axialTiltRads(): number {
      return (Math.PI * this.tilt) / 180;
    },
  },
  methods: {
    mesh(): Mesh {
      return this.$refs.body.o3d;
    },
    applyUVtoDotTex(geometry: RingGeometry) {
      const pos = geometry.attributes.position;
      const vector = new Vector3();
      const avg = (this.scaledInnerRadius + this.scaledOuterRadius) / 2;
      for (let i = 0; i < pos.count; i++) {
        vector.fromBufferAttribute(pos, i);
        geometry.attributes.uv.setXY(i, vector.length() < avg ? 0 : 1, 1);
      }
    },
    async setTextures(material: MeshPhongMaterial) {
      if (this.texture) material.map = await getTexture(this.texture);
      material.needsUpdate = true;
    },
    rotate(angle: number) {
      this.mesh().position.applyAxisAngle(this.axis, angle);
    }
  },
  mounted() {
    const lower: Mesh = this.$refs.lower.mesh;
    const upper: Mesh = this.$refs.upper.mesh;
    lower.applyMatrix4(new Matrix4().makeScale(1, 1, -1)); // Flip lower upside down
    if (!this.circular) {
      this.applyUVtoDotTex(upper.geometry);
      this.applyUVtoDotTex(lower.geometry);
    }

    const mesh = this.mesh();
    mesh.rotateX(-Math.PI / 2 + this.axialTiltRads);
    mesh.receiveShadow = true;

    const lowerPromise = this.setTextures(lower.material);
    const upperPromise = this.setTextures(upper.material);

    Promise.all([lowerPromise, upperPromise]).then((_) => {
      this.$emit("ringLoaded");
    });
  },
});
</script>

<style scoped></style>
