<template>
  <article class="carousel centred noselect">
    <div class="carousel-main">
      <carousel-button @click="index -= 1"
                       v-if="items > 1"
                       left />
      <carousel-item v-bind="currentSimulation">
        <flat-button @click="$emit('click', currentSimulation.id)"
                     text="Select" />
        <template v-slot:media>
          <RendererController :scene-component="sceneComponent"
                              :scene-props="sceneProps"
                              :teleport="false"
                              ref="renderer" />
        </template>
      </carousel-item>
      <carousel-button @click="index += 1"
                       v-if="items > 1"
                       right />
    </div>
    <section class="indicator-container centred"
             v-if="items > 1">
      <carousel-indicators :current-index="index"
                           :items="items"
                           @go="index = $event" />
    </section>
  </article>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import RendererController from "@/components/three/engine/RendererController.vue";
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import CarouselButton from "@/components/ui/widgets/carousel/carousel-button.vue";
import CarouselIndicators from "@/components/ui/widgets/carousel/carousel-indicators.vue";
import CarouselItem from "@/components/ui/widgets/carousel/carousel-item.vue";
import CarouselScene from "@/components/ui/widgets/carousel/carousel-scene.vue";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "carousel",
  components: { FlatButton, RendererController, CarouselButton, CarouselIndicators, CarouselItem },
  emits: ["click"],
  props: {
    simulations: {
      type: Object as PropType<StarSystem[]>,
      required: true,
    }
  },
  data() {
    return {
      index: 0,
    };
  },
  watch: {
    index(newVal: number) {
      if (newVal === this.items) this.index = 0;
      else if (newVal < 0) this.index = this.items - 1;
    }
  },
  computed: {
    currentSimulation(): StarSystem {
      return this.simulations[this.index];
    },
    items(): number {
      return this.simulations.length;
    },
    sceneProps() {
      return { simulation: this.currentSimulation };
    },
    sceneComponent() {
      return CarouselScene;
    },
  },
  methods: {
    go(event: KeyboardEvent) {
      const key = event.key;
      if (key === "ArrowLeft") this.index -= 1;
      else if (key === "ArrowRight") this.index += 1;
      else if (/^-?\d+$/.test(key)) {
        const num = Number(key);
        if (num > 0 && num <= this.items) this.index = num - 1;
      }
    }
  },
  mounted() {
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      this.go(e);
    });
  }
});
</script>

<style scoped>
.carousel {
  flex-direction: column;
  justify-content: flex-start;
}

.carousel-main {
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 28px;
  flex: 1;
}

.indicator-container {
  margin-top: 24px;
  padding: 0 24px;
  width: 100%;
}

@media (min-width: 768px) {
  .carousel {
    height: 100%;
  }

  .carousel-main {
    grid-gap: 48px;
    grid-auto-flow: column;
    height: stretch;
    overflow: hidden;
  }

  .indicator-container {
    margin-top: 32px;
  }
}
</style>
