<template>
  <page header="Edit Simulations"
        column
        fill
        top
        overflow-y
        pad>
    <p>Choose one of your simulations below to edit. You can also delete any unwanted simulations using the red buttons on
      each.</p>
    <section class="content centred">
      <ul class="simulations">
        <li v-for="simulation in simulations"
            :key="simulation.id">
          <SimulationButton v-bind="simulation"
                            @click="go(simulation.id)" />
          <span class="close-icon material-icons centred"
                @click="deleteSimulation(simulation.id, simulation.name)">close</span>
        </li>
      </ul>
    </section>

    <LoadingPopup text="Fetching Content"
                  :visible="visible" />
  </page>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import Page from "@/components/ui/layout/page.vue";
import { useStore } from "@/store/store";
import SimulationButton from "@/views/community/simulation-button.vue";
import LoadingPopup from "@/views/sign-in/loading-popup.vue";
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";


export default defineComponent({
  name: "MySimulations",
  components: { LoadingPopup, SimulationButton, Page },
  params: {
    username: { type: String, required: true }
  },
  setup() {
    const simulations = ref<StarSystem[]>([]);
    const store = useStore();
    const visible = ref<boolean>(false);
    const loading = ref<boolean>(true);
    const router = useRouter();
    const route = useRoute();

    setTimeout(() => {
      visible.value = loading.value;
    }, 350);
    store.dispatch("starSystem/fetchSimulationsByUser", route.params.username).then((r: StarSystem[]) => {
      loading.value = false;
      visible.value = false;
      simulations.value = r;
    }).catch(e => alert(e));

    const deleteSimulation = async (id: number, name: string) => {
      if (!confirm(`Are you sure you would like to delete the simulation "${name}"? This action cannot be undone.`)) return;

      try {

      } catch (e) {

      }
    };

    const go = async (id: number) => {
      await router.push({
        name: "edit-sim",
        params: {
          username: route.params.username,
          id: id,
        }
      });
    };

    return { simulations, visible, deleteSimulation, go };
  }
});
</script>

<style scoped>
p {
  margin-bottom: 24px;
  text-align: center;
}

@media (min-width: 768px) {
  p {
    margin-bottom: 48px;
  }

  ul {
    width: 67%;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 24px;
  }
}

ul {
  display: flex;
  gap: 36px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

ul li {
  flex: 1;
  position: relative;
}

.close-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--red);
  border-radius: 0;
}

@media (min-width: 506px) {
  ul li {
    max-width: calc(50% - 18px);
  }
}
</style>
