<template>
  <Group ref="galaxy">
    <!-- <Starfield ref="starfield" /> -->
    <StarSystem
      ref="starSystem"
      :system-data="starSystem"
      @star-system-loaded="$emit('sceneLoaded', $event)"
      @focus-on-body="focusOnBody"
    />
  </Group>
</template>

<script lang="ts">
// TODO: Add sim background image
import { StarSystem as StarSystemInterface } from "@/@types/celestial/containers/star-system";
import { MeshMouseEvent } from "@/@types/three/mesh-mouse-event";
import CelestialBody from "@/components/three/celestial/base/celestial-body.vue";
import { Group } from "troisjs";
import { defineComponent, PropType } from "vue";
import StarSystem from "./star-system.vue";
import Starfield from "./Starfield.vue";


export default defineComponent({
  name: "Galaxy",
  emits: ["sceneLoaded", "focusOnBody"],
  components: { Group, StarSystem, Starfield },
  props: { starSystem: Object as PropType<StarSystemInterface> },
  methods: {
    focusOnBody(event: MeshMouseEvent) {
      this.$emit("focusOnBody", event);
    },
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
    getComponentByName(name: string, isStar: boolean, isMoon: boolean): typeof CelestialBody {
      return this.$refs.starSystem.getComponentByName(name, isStar, isMoon);
    }
  },
});
</script>

<style scoped></style>
