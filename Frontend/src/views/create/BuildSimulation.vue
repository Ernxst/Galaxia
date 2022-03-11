<template>
  <page :bg="false"
        :footer="false"
        column
        overflow-y
        top>
    <template v-if="!loading">
      <v-builder :editing="false"
                 :simulation="simulation"
                 :username="username">
        <template v-slot:footer>
          <app-footer />
        </template>
      </v-builder>
    </template>
    <loading-popup :visible="loading"
                   text="Fetching simulation" />
  </page>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import AppFooter from "@/components/ui/layout/app-footer.vue";
import Page from "@/components/ui/layout/page.vue";
import { useStore } from "@/store/store";
import { Simulation } from "@/views/create/util/types";
import { defaultSimulation, defaultStar, scaleDown } from "@/views/create/util/util";
import VBuilder from "@/views/create/v-builder.vue";
import LoadingPopup from "@/views/sign-in/loading-popup.vue";
import { cloneDeep } from "lodash-es";
import { defineComponent, ref } from "vue";


export default defineComponent({
  name: "Build",
  components: { LoadingPopup, VBuilder, AppFooter, Page },
  props: {
    username: String,
    remix: { type: String, default: "false" },
    id: { type: String, default: "" },
  },
  setup(props) {
    const formatSim = (simulation: StarSystem) => {
      const sim = { ...simulation, id: null, name: `${simulation.name} (Remix)` };
      sim.star = scaleDown({ ...sim.star, id: undefined }, "star");

      sim.planets = sim.planets.map((planet) => {
        const data = { ...planet, id: undefined };
        if (data.moons) data.moons = data.moons.map(moon => scaleDown({ ...moon, id: undefined }, "moon"));
        return data;
      });

      sim.asteroidBelts = sim.asteroidBelts.map((belt) => scaleDown({ ...belt, id: undefined }, "asteroid belt"));
      return sim;
    };


    const getSimulation = async () => {
      if (Boolean(props.remix)) {
        const store = useStore();
        let cachedSim = store.getters["starSystem/cachedSimulation"];
        if (!cachedSim) {
          loading.value = true;
          cachedSim = await store.dispatch("starSystem/fetchSimulation", parseInt(props.id));
          loading.value = false;
        }

        const simulation = cloneDeep<StarSystem>(cachedSim);
        return <Simulation>formatSim(simulation);
      }
      return defaultSim;
    };

    const loading = ref(false);
    const defaultSim: Simulation = {
      ...defaultSimulation,
      star: defaultStar,
      planets: [],
      asteroidBelts: [],
    };
    const simulation = ref<Simulation>(defaultSim);
    getSimulation()
      .then(r => simulation.value = r)
      .catch(e => alert(e));

    return { simulation, loading };
  }
});
</script>

<style scoped>
</style>
