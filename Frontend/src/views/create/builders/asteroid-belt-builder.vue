<template>
  <group-celestial-builder v-model:bodies="asteroidBelts"
                           :default-body="defaultBody"
                           :max-bodies="maxBodies"
                           :simulation-id="simulationId"
                           type="asteroid belt"
                           @back="$emit('back')"
                           @next="$emit('next')" />
</template>

<script lang="ts">
import GroupCelestialBuilder from "@/views/create/builders/group-builder/group-celestial-builder.vue";
import { AsteroidBeltData } from "@/views/create/util/types";
import { defaultAsteroidBelt } from "@/views/create/util/util";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "asteroid-belt-builder",
  components: { GroupCelestialBuilder },
  emits: ["update:asteroid", "back", "next"],
  props: {
    asteroidBelts: Array as PropType<AsteroidBeltData[]>,
    simulationId: { type: Number, required: true, }
  },
  setup() {
    return { maxBodies: 3, defaultBody: defaultAsteroidBelt };
  }
});
</script>

<style scoped>

</style>
