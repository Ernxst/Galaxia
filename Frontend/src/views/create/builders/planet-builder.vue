<template>
  <group-celestial-builder v-model:bodies="planets"
                           :default-body="defaultBody"
                           :max-bodies="maxBodies"
                           :simulation-id="simulationId"
                           type="planet"
                           @back="$emit('back')"
                           @next="$emit('next')" />
</template>

<script lang="ts">
import GroupCelestialBuilder from "@/views/create/builders/group-builder/group-celestial-builder.vue";
import { PlanetData } from "@/views/create/util/types";
import { defaultPlanet } from "@/views/create/util/util";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "planet-builder",
  components: { GroupCelestialBuilder },
  emits: ["update:planet", "back", "next"],
  props: {
    planets: Array as PropType<PlanetData[]>,
    simulationId: { type: Number, required: true, }
  },
  setup() {
    return { maxBodies: 9, defaultBody: defaultPlanet };
  }
});
</script>

<style scoped>

</style>
