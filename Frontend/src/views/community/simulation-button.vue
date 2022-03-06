<template>
  <a class="sim-container"
     @click="$emit('click')">
    <div class="main">
      <ImgCollage :images="textures"
                  :name="name" />
      <div class="content">
        <h2 class="name">{{ name }}</h2>
        <p class="creator">By <strong>{{ by }}</strong></p>
        <p class="planets">Planets: <strong>{{ planets.length }}</strong></p>
        <p class="belts">Asteroid Belts: <strong>{{ asteroidBelts.length }}</strong></p>
      </div>
    </div>
  </a>
</template>

<script lang="ts">
import { AsteroidBelt } from "@/@types/celestial/containers/asteroid-belt";
import { Planet } from "@/@types/celestial/planet";
import { RingedPlanet } from "@/@types/celestial/ringed-planet";
import { Star } from "@/@types/celestial/star";
import ImgCollage from "@/views/community/img-collage.vue";
import { computed, defineComponent, PropType, toRefs } from "vue";


export default defineComponent({
  name: "simulation-button",
  emits: ["click"],
  components: { ImgCollage },
  props: {
    id: Number,
    by: String,
    name: String,
    caption: String,
    description: String,
    star: {
      type: Object as PropType<Star>,
      required: true,
    },
    planets: {
      type: Object as PropType<Array<Planet | RingedPlanet>>,
      required: true,
    },
    asteroidBelts: Object as PropType<AsteroidBelt[]>,
  },
  setup(props) {
    const { star, planets } = toRefs(props);

    // Get all textures to make a collage
    const textures = computed(() => {
      const textures = [star.value.texture];
      planets.value.forEach(({ moons, texture }) => {
        textures.push(texture);
        if (moons) moons.forEach(({ texture }) => textures.push(texture));
      });
      return textures;
    });

    return { textures };
  }
});
</script>

<style scoped>
.sim-container {
  display: grid;
  border: 1px solid var(--main);
  padding: 4px;
  cursor: pointer;
  transition: .2s ease-in-out;
  transition-property: filter, transform;
  height: 100%;
}

.sim-container:hover {
  filter: brightness(0.67);
  transform: translateY(-16px);
}

.main {
  background: var(--main);
  padding: 16px;
  display: grid;
  grid-gap: 16px;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 12px;
}

.content * {
  margin: 0;
}

.name {
  font-size: 18px;
  white-space: pre-wrap;
  width: 100%;
  background: var(--page-bg);
  padding: 4px 12px;
  border: 1px solid var(--orange);
  border-left: 8px solid var(--orange);
}

.creator {
  font-size: 14px;
}

.name, .creator {
  grid-column: span 2;
}

.planets, .belts {
  font-size: 10px;
}

.belts {
  text-align: right;
}
</style>
