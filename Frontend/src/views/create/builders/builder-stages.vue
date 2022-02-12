<template>
  <div class="form-container">
    <data-builder v-if="step === 0"
                  v-model:simulation="simData"
                  v-model:simulation-id="simulationID"
                  @next="$emit('next')" />
    <star-builder v-if="step === 1"
                  v-model:star="simData.star"
                  :editing="editing"
                  :simulation-id="simulationID"
                  @back="$emit('back')"
                  @next="$emit('next')" />
    <planet-builder v-if="step === 2"
                    v-model:planets="simData.planets"
                    :simulation-id="simulationID"
                    @back="$emit('back')"
                    @next="$emit('next')" />
    <moon-builder v-if="step === 3"
                  :moons="moons"
                  :planets="simData.planets"
                  :simulation-id="simulationID"
                  @back="$emit('back')"
                  @next="$emit('next')" />
    <asteroid-belt-builder v-if="step === 4"
                           v-model:asteroid-belts="simData.asteroidBelts"
                           :simulation-id="simulationID"
                           @back="$emit('back')"
                           @next="$emit('next')" />
    <div v-if="step === 5"
         class="buttons">
      <flat-button bg="var(--red)"
                   text="Back"
                   @click="$emit('back')" />
      <flat-button bg="var(--green)"
                   text="Liftoff"
                   @click="$router.push({ name: `simulate`, params: { username, simulationID } })" />
    </div>

  </div>
</template>

<script lang="ts">
import { Planet } from "@/@types/celestial/planet";
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import { useStore } from "@/store/store";
import AsteroidBeltBuilder from "@/views/create/builders/asteroid-belt-builder.vue";
import DataBuilder from "@/views/create/builders/data-builder.vue";
import MoonBuilder from "@/views/create/builders/moon-builder/moon-builder.vue";
import PlanetBuilder from "@/views/create/builders/planet-builder.vue";
import StarBuilder from "@/views/create/builders/star-builder.vue";
import { MoonData, Simulation } from "@/views/create/util/types";
import { defineComponent, PropType, ref, toRefs, watch } from "vue";


export default defineComponent({
  name: "builder-stages",
  components: { MoonBuilder, FlatButton, AsteroidBeltBuilder, PlanetBuilder, StarBuilder, DataBuilder },
  emits: ["back", "next", "to", "complete"],
  props: {
    username: String,
    editing: Boolean,
    step: Number,
    simulation: {
      type: Object as PropType<Simulation>,
      required: true
    }
  },
  setup(props) {
    const { simulation, editing } = toRefs(props);
    const simulationID = ref<number | null>(editing.value ? simulation.value.id : null);
    const store = useStore();

    const getMoons = (planets: Planet[]): MoonData[] => [].concat.apply([], planets.map(planet => planet.moons));
    const moons = ref<MoonData[]>(editing.value ? getMoons(simulation.value.planets) : []);
    store.commit("simulation/setMoons", moons.value);
    watch(moons, (newVal: MoonData[]) => store.commit("simulation/setMoons", newVal), { deep: true });

    const simData = ref<Simulation>(simulation.value);
    store.commit("simulation/setSimulation", simData.value);
    watch(simData, (newVal: Simulation) => store.commit("simulation/setSimulation", newVal), { deep: true });

    return { simulationID, simData, moons, };
  }
});
</script>

<style scoped>
.buttons {
  display: grid;
  grid-gap: 16px;
}
</style>
