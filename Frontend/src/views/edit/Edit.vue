<template>
  <page :bg="false"
        :footer="false"
        column
        overflow-y
        top>
    <template v-if="simulation">
      <v-builder :editing="true"
                 :simulation="simulation"
                 :username="username">
        <template v-slot:footer>
          <app-footer />
        </template>
      </v-builder>
    </template>
    <p class="label abs centred"
       v-else>Please wait ...</p>
  </page>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import AppFooter from "@/components/ui/layout/app-footer.vue";
import Page from "@/components/ui/layout/page.vue";
import { useStore } from "@/store/store";
import { scaleDown } from "@/views/create/util/util";
import VBuilder from "@/views/create/v-builder.vue";
import { defineComponent, ref, toRefs } from "vue";


export default defineComponent({
  name: "Edit",
  components: { VBuilder, AppFooter, Page },
  props: {
    username: { type: String, required: true },
    id: { type: Number, required: true }
  },
  setup(props) {
    const { id } = toRefs(props);
    const store = useStore();
    const simulation = ref<StarSystem | null>(null);

    const scaleSim = (simulation: StarSystem) => {
      const sim = { ...simulation };
      sim.star = scaleDown(sim.star, "star");

      sim.planets = sim.planets.map((planet) => {
        const data = { ...planet };
        if (data.moons) data.moons = data.moons.map(moon => scaleDown(moon, "moon"));
        return data;
      });

      sim.asteroidBelts = sim.asteroidBelts.map((belt) => scaleDown(belt, "asteroid belt"));
      return sim;
    };

    store.dispatch("starSystem/fetchSimulation", id.value)
      .then((r: StarSystem) => simulation.value = scaleSim(r))
      .catch((e) => alert(e));

    return { simulation };
  }
});
</script>

<style scoped>
.label {
  width: 100%;
  height: 100%;
}
</style>
