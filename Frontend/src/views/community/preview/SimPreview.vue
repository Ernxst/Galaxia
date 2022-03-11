<template>
  <page :header="simName"
        top
        fill
        column
        overflow-y
        pad>
    <template v-if="simLoaded">
      <section class="carousel-container centred">
        <carousel :simulations="[simulation]"
                  @remix="uncache = false"
                  @click="$router.push({ name: 'simulate',
                   params: { username, simulationID: id, }
                  });" />
      </section>
      <section class="social">
        <SimSocial :id="parseInt(id)"
                   :username="username" />
      </section>
    </template>
    <loading-popup text="Fetching Simulation"
                   :visible="loading" />
  </page>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import Page from "@/components/ui/layout/page.vue";
import Carousel from "@/components/ui/widgets/carousel/carousel.vue";
import { useStore } from "@/store/store";
import SimSocial from "@/views/community/preview/SimSocial.vue";
import LoadingPopup from "@/views/sign-in/loading-popup.vue";
import { computed, defineComponent, onBeforeUnmount, ref, toRefs } from "vue";


export default defineComponent({
  name: "SimPreview",
  components: { SimSocial, LoadingPopup, Carousel, Page },
  props: {
    id: { type: String, required: true },
    username: { type: String, required: true, },
  },
  setup(props) {
    const store = useStore();
    const simulation = ref<StarSystem>(store.getters["starSystem/cachedSimulation"]);
    const loading = ref<boolean>(false);
    const { id } = toRefs(props);
    const simLoaded = computed(() => simulation.value && simulation.value.id === parseInt(id.value));
    const simName = computed(() => simLoaded.value ? simulation.value?.name : "Loading");

    if (!simLoaded.value) {
      try {
        setTimeout(() => {
          loading.value = !simLoaded.value;
        }, 650);
        store.dispatch("starSystem/fetchSimulation", id.value).then((r: StarSystem) => {
          simulation.value = r;
          store.commit("starSystem/cacheSimulation", r);
          loading.value = false;
        });
      } catch (e) {
        alert(e);
      }
    }

    const uncache = ref(false);
    onBeforeUnmount(() => uncache.value ? store.commit("starSystem/cacheSimulation", null) : null);

    return { simulation, loading, simName, simLoaded, uncache };
  }
});
</script>

<style scoped>
.carousel-container {
  height: stretch;
  padding: 4px;
}

.social {
  margin-top: 36px;
}

@media (min-width: 768px) {
  .carousel-container, .social {
    width: 85%;
  }
}
</style>
