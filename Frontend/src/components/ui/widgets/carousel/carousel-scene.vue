<template>
  <Group ref="group">
    <star ref="star"
          v-bind="simulation.star"
          @star-loaded="assetsLoaded++" />
  </Group>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import { computeCentreAndSize } from "@/assets/three";
import Star from "@/components/three/celestial/star.vue";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";
import { Group } from "troisjs";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "carousel-scene",
  components: { Group, Star },
  emits: ["dataLoaded", "focus", "loaded"],
  props: {
    simulation: {
      type: Object as PropType<StarSystem>,
      required: true,
    }
  },
  data() {
    return {
      assetsToLoad: 1,
      assetsLoaded: 0,
    };
  },
  watch: {
    assetsLoaded(newVal: number, oldVal: number) {
      if (newVal === this.assetsToLoad) {
        const { centre, size } = computeCentreAndSize(this.$refs.star.mesh());
        const z = size.length();
        this.$emit("loaded", { camPos: new Vector3(z / 10, z / 1.33, z / 10), models: [] });
      }
    },
  },
  methods: {
    animate(speed: number) {
      const mesh: Mesh = this.$refs.group.o3d;
      const rotation = 7e-3 * speed;
      mesh.rotation.y += rotation;
    },
  },
  mounted() {
    this.$emit("dataLoaded", 1);
    const mesh: Mesh = this.$refs.group.o3d;
    mesh.rotation.x = -Math.PI / 8;
  }
});
</script>

<style scoped>
</style>
