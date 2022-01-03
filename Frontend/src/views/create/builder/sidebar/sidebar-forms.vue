<template>
  <div class="form-container">
    <keep-alive>
      <sim-form v-if="step === 0"
                v-model="simulation"
                @saved="simulationID = $event"
                @next="$emit('next')" />
    </keep-alive>
    <keep-alive>
      <celestial-builder v-if="step === 1"
                         v-model="star"
                         type="star"
                         :simulation-i-d="simulationID"
                         @back="$emit('back')"
                         @next="$emit('next')" />
    </keep-alive>
    <keep-alive>
      <group-builder v-if="step === 2"
                     v-model="planets"
                     type="planet"
                     :simulation-i-d="simulationID"
                     @back="$emit('back')"
                     @next="$emit('next')"
                     @preview="currentPreview = $event; previewing = true"
                     @remove="currentPreview = {...defaultStar}; previewing = false"
                     @close="previewing = false" />
    </keep-alive>
    <keep-alive>
      <moon-builder v-if="step === 3"
                    v-model="moons"
                    :planets="savedPlanets"
                    :simulation-i-d="simulationID"
                    @back="$emit('back')"
                    @next="$emit('next')"
                    @preview="currentPreview = $event; previewing = true"
                    @remove="currentPreview = {...defaultStar}; previewing = false"
                    @close="previewing = false" />
    </keep-alive>
    <keep-alive>
      <group-builder v-if="step === 4"
                     v-model="asteroidBelts"
                     type="asteroid belt"
                     :simulation-i-d="simulationID"
                     @back="$emit('back')"
                     @next="$emit('next')"
                     @preview="currentPreview = $event; previewing = true"
                     @remove="currentPreview = {...defaultStar}; previewing = false"
                     @close="previewing = false" />
    </keep-alive>
    <keep-alive>
      <flat-button v-if="step === 5"
                   bg="var(--green)"
                   text="Liftoff"
                   @click="$router.push({ name: `simulate`,
                   params: { username: $route.params.username, simulationID: simulationID } })" />
    </keep-alive>
    <teleport to=".preview-container.centred">
      <div class="previewer centred">
        <builder-preview v-model="currentPreview"
                         :type="currentType" />
      </div>
      <span class="no-preview centred abs"
            v-if="!previewing">{{ message }}</span>
    </teleport>
  </div>
</template>

<script lang="ts">
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import { useStore } from "@/store/store";
import CelestialBuilder from "@/views/create/builder/celestial-builder.vue";
import SimForm from "@/views/create/builder/forms/sim-form.vue";
import GroupBuilder from "@/views/create/builder/group-builder/group-builder.vue";
import MoonBuilder from "@/views/create/builder/moon-builder/moon-builder.vue";
import BuilderPreview from "@/views/create/builder/preview/builder-preview.vue";
import { AsteroidBeltData, MoonData, PlanetData, SimulationData, StarData } from "@/views/create/util/types";
import { defaultSimulation, defaultStar } from "@/views/create/util/util";
import { nextTick } from "@vue/runtime-core";
import { computed, defineComponent, onMounted, ref, toRefs, watch } from "vue";


export default defineComponent({
  name: "sidebar-forms",
  emits: ["submit", "update:modelValue", "back", "next", "to"],
  components: { FlatButton, MoonBuilder, BuilderPreview, GroupBuilder, CelestialBuilder, SimForm },
  props: {
    step: Number,
    max: Number,
  },
  setup(props, { emit }) {
    const simulationID = ref<number>(null);
    const simulation = ref<SimulationData>({ ...defaultSimulation });
    const star = ref<StarData>({ ...defaultStar });
    const planets = ref<PlanetData[]>([]);
    const moons = ref<MoonData[]>([]);
    const asteroidBelts = ref<AsteroidBeltData[]>([]);

    const { step } = toRefs(props);
    watch(step, (newVal: number) => (switchSlide(newVal)));
    const currentType = computed(() => {
      return ["star", "star", "planet", "moon", "asteroid belt", "star"][step.value];
    });
    const currentPreview = ref({ ...defaultStar });
    const previewing = ref<boolean>(false);
    const message = computed(() => {
      if (currentType.value !== 'star') {
        if (currentType.value === 'moon') return 'Use the builder menu to add and select a moon to preview';
        const array = currentType.value === 'planet' ? planets : asteroidBelts;
        const preposition = currentType.value === 'asteroid belt' ? 'an' : 'a';
        if (array.value.length > 0) return `Click ${preposition} ${currentType.value} button in the builder menu to preview`;
        return `Use the builder menu to add a new ${currentType.value} to the simulation`;
      }
      return "No preview available for this step";
    });

    const store = useStore();
    watch([simulation, star, planets, moons, asteroidBelts], updateStore, { deep: true });

    function updateStore() {
      const payload = {
        textData: simulation.value, star: star.value, planets: planets.value,
        moons: moons.value, asteroidBelts: asteroidBelts.value
      };
      store.commit("builder/setSimulation", payload);
    }

    onMounted(() => updateStore());

    const savedPlanets = ref<PlanetData[]>([]);

    async function switchSlide(newVal: number) {
      previewing.value = newVal === 1;
      currentPreview.value = defaultStar;
      if (newVal === 1) currentPreview.value = star.value;
      if (newVal === 3) {
        const simulation = await store.dispatch("starSystem/fetchSimulation", simulationID.value);
        savedPlanets.value = simulation.planets;
        moons.value = moons.value.filter(moon => savedPlanets.value.find(planet => planet.id === moon.parentId));
        await nextTick();

        if (savedPlanets.value.length === 0) {
          const message = "You currently have no planets in the simulation and therefore cannot add any moons. Would you like to go back to create some planets?";
          if (confirm(message)) emit("back");
          else emit("next");
        }
      }
    }

    function submit() {
      console.log({
        ...simulation.value,
        star: star.value,
        planets: planets.value,
        asteroidBelts: asteroidBelts.value
      });
      emit("submit", {
        ...simulation.value,
        star: star.value,
        planets: planets.value,
        asteroidBelts: asteroidBelts.value
      });
    }

    return {
      previewing, defaultStar, currentPreview, currentType, message,
      simulationID, simulation, star, planets, moons, asteroidBelts,
      savedPlanets, submit,
    };
  }
});
</script>

<style scoped>
.no-preview {
  height: 100%;
  text-align: center;
  z-index: 13;
  background: var(--page-bg);
}

.previewer, .no-preview {
  padding: 24px 16px;
  width: 100%;
  height: 100%;
}

@media (min-width: 768px) {
  .previewer, .no-preview {
    padding: 32px;
  }
}
</style>
