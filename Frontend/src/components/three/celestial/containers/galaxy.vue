<template>
  <Group ref="galaxy">
    <!-- <Starfield ref="starfield" /> -->
    <StarSystem
      ref="starSystem"
      :name="starSystem"
      @star-system-loaded="$emit('sceneLoaded', $event)"
    />
  </Group>
</template>

<script lang="ts">
import CelestialBody from "@/components/three/celestial/base/celestial-body.vue";
import { Group } from "troisjs";
import { defineComponent } from "vue";
import StarSystem from "./star-system.vue";
import Starfield from "./Starfield.vue";


export default defineComponent({
  name: "Galaxy",
  emits: ["sceneLoaded"],
  components: { Group, StarSystem, Starfield },
  props: { name: String, starSystem: String },
  methods: {
    evolve(speed: number) {
      // this.$refs.starfield.animate(0.00005 * speed);
      this.$refs.starSystem.evolve(speed);
    },
    largestObjectSize(): number {
      return this.$refs.starSystem.largestObjectSize();
    },
    furthestObjectDistance(): number {
      return this.$refs.starSystem.furthestObjectDistance();
    },
    getComponentByName(name: string, isStar: boolean, isMoon: boolean) : typeof CelestialBody {
      return this.$refs.starSystem.getComponentByName(name, isStar, isMoon);
    }
  },
});
</script>

<style scoped></style>
