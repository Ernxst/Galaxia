<template>
  <page header="Select"
        top
        column
        overflow-y
        pad>
      <p>Select a preset simulation to explore below.</p>
      <template v-if="!loading">
        <section class="carousel-container">
          <carousel :simulations="Object.values(simulations)"
                    @click="select($event)" />
        </section>
      </template>
      <loading-popup text="fetching simulations"
                     :visible="loading" />
  </page>
</template>

<script lang="ts">
import { isObjectEmpty } from "@/assets/util/app.util";
import Page from "@/components/ui/layout/page.vue";
import Carousel from "@/components/ui/widgets/carousel/carousel.vue";
import { StarSystems } from "@/services/simulation.service";
import { useStore } from "@/store/store";
import LoadingPopup from "@/views/sign-in/loading-popup.vue";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";


export default defineComponent({
  name: "SelectPreset",
  components: { Carousel, LoadingPopup, Page },
  props: {
    username: { type: String }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const simulations = ref<StarSystems>({});

    onMounted(async () => {
      try {
        // TODO: Uncomment once preset simulations are properly seeded
        // const preset = store.getters["starSystem/presetSimulations"];
        // simulations.value = preset;
        // if (isObjectEmpty(preset))
          simulations.value = await store.dispatch("starSystem/fetchPresetSimulations");
      } catch (e) {
        alert(e);
      }
    });
    const loading = computed(() => (isObjectEmpty(simulations.value)));

    function select(simulationID: number) {
      router.push({
        name: "simulate",
        params: {
          username: props.username,
          simulationID,
        }
      });
    }

    return { loading, simulations, select };
  }
});
</script>

<style scoped>
p {
  margin-bottom: 28px;
  text-align: center;
  font-size: 3vw;
}

.carousel-container {
  height: stretch;
  overflow-y: auto;
  padding: 4px;
}

@media (min-width: 768px) {
  p {
    margin-top: 0;
    font-size: 1em;
  }

  .carousel-container {
    overflow-y: hidden;
    width: 85%;
  }
}
</style>
