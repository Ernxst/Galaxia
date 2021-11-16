<template>
  <Group ref="group"></Group>
</template>

<script lang="ts">
// TODO: If wanting to toggle trails on or off, emit window event from engine controller and add listener here to toggle a boolean
import { GeometryManager } from "@/assets/three";
import { MAX_TRAIL_POINTS } from "@/assets/util/sim.constants";
import { EllipseCurve } from "three/src/extras/curves/EllipseCurve";
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial";
import { LineLoop } from "three/src/objects/LineLoop";
import { Mesh } from "three/src/objects/Mesh";
import { Group } from "troisjs";
import { defineComponent } from "vue";


export default defineComponent({
  name: "Trail",
  components: { Group },
  props: {
    semiMajor: Number,
    semiMinor: Number,
    inclination: Number,
  },
  mounted() {
    const curve = new EllipseCurve(
      0,
      0,
      this.semiMajor,
      this.semiMinor,
      0,
      2 * Math.PI,
      false,
      0
    );
    curve.arcLengthDivisions = MAX_TRAIL_POINTS;

    const geometry = GeometryManager.bufferGeometry();
    geometry.setFromPoints(curve.getPoints(MAX_TRAIL_POINTS));
    geometry.setDrawRange(0, MAX_TRAIL_POINTS);

    const material = new LineBasicMaterial();
    const trail = new LineLoop(geometry, material);
    trail.rotateX(Math.PI / 2);
    trail.rotateY(this.inclination);
    trail.renderOrder = 1;

    const group: Mesh = this.$refs.group.o3d;
    group.add(trail);
  },
});
</script>

<style scoped></style>
