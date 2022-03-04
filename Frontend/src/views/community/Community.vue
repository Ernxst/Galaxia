<template>
  <page header="Community"
        column
        fill
        top
        overflow-y
        pad>
    <p>View community-shared simulations to see variety of Galaxia, or find inspiration for your next creation.</p>
    <section class="content centred">
      <ul class="simulations">
        <li v-for="simulation in simulations"
            :key="simulation.id">
          <SimulationButton v-bind="simulation" />
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


export default defineComponent({
  name: "Community",
  components: { LoadingPopup, SimulationButton, Page },
  setup() {
    const simulations = ref<StarSystem[]>([]);
    const store = useStore();
    const visible = ref<boolean>(false);
    const loading = ref<boolean>(true);

    setTimeout(() => {
      visible.value = loading.value;
    }, 350);
    store.dispatch("starSystem/fetchUserSimulations").then((r: StarSystem[]) => {
      loading.value = false;
      visible.value = false;
      simulations.value = r;
    }).catch(e => alert(e));

    return { simulations, visible };
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
}

@media (min-width: 506px) {
  ul li {
    max-width: calc(50% - 18px);
  }
}
</style>
