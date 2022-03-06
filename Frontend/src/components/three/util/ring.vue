<template>
  <Group ref="body">
    <trois-ring
      ref="upper"
      :cast-shadow="false"
      :innerRadius="scaledInnerRadius"
      :outerRadius="scaledOuterRadius"
      :receive-shadow="true"
      :theta-segments="slices"
    >
      <LambertMaterial />
    </trois-ring>
    <trois-ring
      ref="lower"
      :cast-shadow="false"
      :innerRadius="scaledInnerRadius"
      :outerRadius="scaledOuterRadius"
      :receive-shadow="true"
      :theta-segments="slices"
    >
      <LambertMaterial />
    </trois-ring>
  </Group>
</template>

<script lang="ts">
// TODO: Cannot see underside of ring - works if using MeshBasicMaterial and DoubleSide tex (no shadows)
import { TextureMap } from "@/@types/app/texture-maps";
import { getTexture } from "@/assets/three/loaders";
import { SPHERE_SLICES } from "@/assets/three/three.constants";
import { RADIUS_SCALE } from "@/assets/util/sim.constants";
import { RingGeometry } from "three/src/geometries/RingGeometry";
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial";
import { Matrix4 } from "three/src/math/Matrix4";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";
import { BasicMaterial, Group, LambertMaterial, Ring as TroisRing } from "troisjs";
import { defineComponent, PropType } from "vue";
import BaseObject from "./BaseObject.vue";


export default defineComponent({
  name: "Ring",
  extends: BaseObject,
  emits: ["ringLoaded"],
  components: { Group, TroisRing, LambertMaterial, BasicMaterial },
  props: {
    tilt: Number,
    texture: { type: Object as PropType<TextureMap>, default: "" },
    innerRadius: { type: Number, default: 1 },
    outerRadius: { type: Number, default: 2 },
    circular: Boolean,
    slices: { type: Number, default: SPHERE_SLICES },
  },
  data() {
    return {
      angle: 0,
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
    applyUVtoDotTex(geometry: RingGeometry) {
      const pos = geometry.attributes.position;
      const vector = new Vector3();
      const avg = (this.scaledInnerRadius + this.scaledOuterRadius) / 2;
      for (let i = 0; i < pos.count; i++) {
        vector.fromBufferAttribute(pos, i);
        geometry.attributes.uv.setXY(i, vector.length() < avg ? 0 : 1, 1);
      }
    },
    async setTextures(material: MeshLambertMaterial) {
      if (this.texture) material.map = await getTexture(this.texture.url);
      material.transparent = true;
      material.needsUpdate = true;
    },
    rotate(angle: number) {
      this.angle += angle;
      this.mesh().rotateZ(this.angle);
    }
  },
  mounted() {
    const lower: Mesh = this.$refs.lower.mesh;
    const upper: Mesh = this.$refs.upper.mesh;
    lower.applyMatrix4(new Matrix4().makeScale(1, 1, -1)); // Flip lower upside down
    lower.position.y += 1.5;

    if (!this.circular) {
      this.applyUVtoDotTex(upper.geometry);
      this.applyUVtoDotTex(lower.geometry);
    }

    const mesh = this.mesh();
    mesh.rotateX(Math.PI / 2);
    mesh.rotateZ(this.axialTiltRads);

    const lowerPromise = this.setTextures(lower.material);
    const upperPromise = this.setTextures(upper.material);

    Promise.all([lowerPromise, upperPromise]).then((_) => {
      this.$emit("ringLoaded");
    });
  },
});
</script>

<style scoped></style>
