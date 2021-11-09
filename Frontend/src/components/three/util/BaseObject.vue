<template></template>

<script lang="ts">
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "base-object",
  props: {
    name: { type: String, required: true },
    initialPosition: {
      type: Object as PropType<Vector3>,
      default: new Vector3(),
    },
    rotation: {
      type: Object as PropType<Vector3>,
      default: new Vector3(),
    },
    scale: {
      type: Object as PropType<Vector3>,
      default: new Vector3(1, 1, 1),
    },
    renderOrder: { type: Number, default: 0 },
  },
  data() {
    return {
      position: new Vector3(),
    };
  },
  created() {
    this.position = this.initialPosition;
  },
  methods: {
    mesh() {
      return this.$refs.body.o3d;
    },
    translate(delta: Vector3) {
      this.position.add(delta);
      this._moveMesh();
    },
    _moveMesh() {
      const mesh: Mesh = this.mesh();
      mesh.position.set(this.position.x, this.position.y, this.position.z);
    },
    moveTo(newPos: Vector3) {
      this.position = newPos;
      this._moveMesh();
    },
    rotate(rotation: Vector3) {
      this.rotation.add(rotation);
      const mesh: Mesh = this.mesh();
      mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    },
  },
  mounted() {
    if (this.renderOrder > 0) {
      const mesh: Mesh = this.mesh();
      mesh.renderOrder = this.renderOrder;
    }
  },
});
</script>

<style scoped></style>
