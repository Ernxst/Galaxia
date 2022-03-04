<template>
  <page :header="simulation.name"
        top
        fill
        column
        overflow-y
        pad>
    <section class="carousel-container centred">
      <carousel :simulations="[simulation]"
                @click="select($event)" />
    </section>
    <section class="social">
      <!--      TODO: Add likes, comments etc. -->
    </section>
    <loading-popup text="Fetching Simulation"
                   :visible="loading" />
  </page>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import Page from "@/components/ui/layout/page.vue";
import Carousel from "@/components/ui/widgets/carousel/carousel.vue";
import { useStore } from "@/store/store";
import LoadingPopup from "@/views/sign-in/loading-popup.vue";
import { defineComponent, onBeforeUnmount, ref, toRefs } from "vue";
import { useRouter } from "vue-router";


export default defineComponent({
  name: "SimPreview",
  components: { LoadingPopup, Carousel, Page },
  props: {
    id: Number,
    username: { type: String, required: true, },
  },
  setup(props) {
    const { username, id } = toRefs(props);
    const router = useRouter();

    const store = useStore();
    const simulation = ref<StarSystem>();
    simulation.value = store.getters["starSystem/cachedSimulation"];
    const loading = ref<boolean>(false);

    if (!simulation.value) {
      try {
        setTimeout(() => {
          loading.value = !simulation.value;
        }, 350);
        store.dispatch("starSystem/fetchSimulation", id.value).then((r: StarSystem) => {
          simulation.value = r;
          loading.value = false;
        });
      } catch (e) {
        alert(e);
      }
    }

    function select(simulationID: number) {
      store.commit("starSystem/cacheSimulation", null);
      router.push({
        name: "simulate",
        params: {
          username: username.value,
          simulationID,
        }
      });
    }

    onBeforeUnmount(() => store.commit("starSystem/cacheSimulation", null));

    return { simulation, loading, select };
  }
});
</script>

<style scoped>
.carousel-container {
  height: stretch;
  padding: 4px;
}

@media (min-width: 768px) {
  .carousel-container, .social {
    width: 85%;
  }
}
</style>
