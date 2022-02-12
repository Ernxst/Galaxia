<template>
  <group-celestial-builder v-model:bodies="validMoons"
                           :default-body="defaultBody"
                           :max-bodies="maxBodies"
                           :simulation-id="simulationId"
                           type="moon"
                           @back="$emit('back')"
                           @next="$emit('next')">
    <template v-slot="slotProps">
      <planet-selector v-slot="slotProps"
                       :parent-id="slotProps.data.parentId"
                       :planets="planets"
                       @update:parent-id="setParent($event, slotProps.index)" />
    </template>
  </group-celestial-builder>
</template>

<script lang="ts">
import GroupCelestialBuilder from "@/views/create/builders/group-builder/group-celestial-builder.vue";
import PlanetSelector from "@/views/create/builders/moon-builder/planet-selector.vue";
import { MoonData, PlanetData } from "@/views/create/util/types";
import { defaultMoon } from "@/views/create/util/util";
import { computed, defineComponent, PropType, toRefs } from "vue";


export default defineComponent({
  name: "moon-builder",
  components: { PlanetSelector, GroupCelestialBuilder },
  emits: ["update:moon", "back", "next"],
  props: {
    moons: Array as PropType<MoonData[]>,
    planets: Array as PropType<PlanetData[]>,
    simulationId: { type: Number, required: true, }
  },
  setup(props, { emit }) {
    const { moons } = toRefs(props);
    const validMoons = computed({
      get(): MoonData[] {
        return moons.value.filter(moon => props.planets.find(planet => planet.id === moon.parentId));
      },
      set(newMoons: MoonData[]) {
        moons.value = newMoons;
      }
    });

    if (props.planets.length === 0) {
      const message = "You currently have no planets in the simulation and, therefore, cannot add any moons. Would you like to go back to create some planets?";
      if (confirm(message)) emit("back");
      else emit("next");
    }

    function setParent(id: number, index: number) {
      validMoons.value[index].parentId = id;
      emit("update:moon", validMoons.value);
    }

    return { maxBodies: 4, defaultBody: defaultMoon, validMoons, setParent };
  }
});
</script>

<style scoped>

</style>
