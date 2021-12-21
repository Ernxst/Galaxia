<template>
  <article class="carousel-item">
    <section class="content centred">
      <p class="caption">{{ caption }}</p>
      <h2 class="name">{{ name }}</h2>
      <p class="by">{{ preset ? 'preset simulation' : `by ${by}` }}</p>
      <div class="data">
        <p>Planets: <strong>{{ planets.length }}</strong></p>
        <p>Asteroid Belts: <strong>{{ asteroidBelts.length }}</strong></p>
      </div>
      <section class="description">
        <p v-for="paragraph in description.split(`\n`)">{{ paragraph }}</p>
      </section>
      <div class="slot-container">
        <slot></slot>
      </div>
    </section>
    <div class="container image">
      <slot name="media" />
    </div>
  </article>
</template>

<script lang="ts">
import { AsteroidBelt } from "@/@types/celestial/containers/asteroid-belt";
import { Planet } from "@/@types/celestial/planet";
import { RingedPlanet } from "@/@types/celestial/ringed-planet";
import { Star } from "@/@types/celestial/star";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "carousel-item",
  props: {
    id: Number,
    by: String,
    name: String,
    caption: String,
    description: String,
    preset: Boolean,
    star: Object as PropType<Star>,
    planets: Object as PropType<Array<Planet | RingedPlanet>>,
    asteroidBelts: Object as PropType<AsteroidBelt[]>
  }
});
</script>

<style scoped>
.carousel-item {
  border: 1px solid var(--main);
  backdrop-filter: blur(5px);
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: flex-start;
}

.carousel-item, .container, .content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.container {
  overflow: hidden;
}

.carousel-item::before, .data::before, .container::before {
  background: var(--main);
  opacity: .2;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.content {
  flex-direction: column;
  justify-content: flex-start;
}

.description, .by, .caption {
  padding: 0 24px;
}

.caption {
  font-size: 10px;
  color: rgba(255, 255, 255, .67);
  padding-top: 24px;
}

.name {
  margin-top: 0;
  font-size: 28px;
  width: 100%;
  background: var(--main);
  padding-left: 24px;
}

.by {
  font-size: 11px;
  color: var(--main);
  margin: 0;
  width: 100%;
}

.data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--main);
  border-bottom: 1px solid var(--main);
  position: relative;
  margin: 24px 0;
  width: 100%;
}

.data > p {
  margin: 0;
  padding: 8px 24px;
  white-space: nowrap;
}

.data > p:last-child {
  border-left: 1px solid var(--main);
  text-align: right;
  width: 100%;
}

.data > p, p > strong {
  font-size: 10px;
}

p > strong {
  color: var(--main);
}

.description {
  font-size: 12px;
  margin-bottom: 24px;
}

.slot-container {
  padding: 24px;
  width: 100%;
}

@media (max-width: 768px) {
  .carousel-item {
    grid-template-columns: unset;
    grid-auto-flow: row;
  }

  .container::before {
    content: unset;
  }

  .description, .by, .caption {
    padding: 0 12px;
  }

  .name {
    padding-left: 12px;
  }

  .data {
    grid-template-columns: unset;
    grid-template-rows: 1fr 1fr;
  }

  .data > P {
    padding: 6px 16px;
    white-space: unset;
  }

  .data > p:last-child {
    border: none;
    text-align: left;
  }

  .description {
    margin-bottom: 12px;
  }

  .slot-container {
    padding: 12px;
    width: 50%;
    margin: auto;
  }
}

@media (max-width: 480px) {
  .slot-container {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .carousel-item {
    grid-template-columns: 3fr 4fr;
  }

  .carousel-item, .content {
    overflow-y: hidden;
  }

  .description {
    overflow-y: auto;
    height: stretch;
    padding: 0 16px;
    margin: 0 8px;
  }
}
</style>
