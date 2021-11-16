<template>
  <nav class="navbar centred noselect" role="navigation">
    <div class="nav-buttons centred">
      <ul class="stars">
        <li class="star centred" v-for="star in stars" v-bind="star">
          <nav-item
            :name="star.name"
            :isStar="true"
            :icon="star.texture"
            :ref="(el) => (buttons[star.name] = el)"
            @follow="followPlanet"
          />
        </li>
      </ul>
      <ul class="planets">
        <li class="planet centred" v-for="planet in planets" v-bind="planet">
          <nav-item
            :name="planet.name"
            :isStar="false"
            :icon="planet.texture"
            :moons="planet.moons"
            :distance="planet.semiMajor"
            :ref="(el) => (buttons[planet.name] = el)"
            @follow="followPlanet"
          />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
// TODO: Add asteroid belts to navbar
// TODO: Disable navbar while factfile open
import { Planet } from "@/@types/celestial/planet";
import { RingedPlanet } from "@/@types/celestial/ringed-planet";
import { Star } from "@/@types/celestial/star";
import { defineComponent, PropType } from "vue";
import NavItem from "./nav-item.vue";


export default defineComponent({
  name: "Navbar",
  components: { NavItem },
  emits: ["follow"],
  props: {
    stars: Object as PropType<Star[]>,
    planets: Object as PropType<Planet[] | RingedPlanet[]>,
  },
  data() {
    return {
      buttons: {} as { [key: string]: typeof NavItem },
    };
  },
  beforeUpdate() {
    this.buttons = {};
  },
  methods: {
    followPlanet(event) {
      this.toggle(event.name);
      this.$emit("follow", event);
    },
    toggle(objectName: string) {
      for (const [name, button] of Object.entries(this.buttons)) {
        if (name === objectName) button.activate();
        else button.deactivate();
      }
    },
  },
});
</script>

<style scoped>
.navbar {
  flex-direction: column;
  position: absolute;
  height: 100%;
  top: 0;
  left: 16px;
  margin-top: auto;
  margin-bottom: auto;
  z-index: 2;
  overflow-x: visible;
}

.nav-buttons {
  overflow-y: auto;
  overflow-x: visible;
  justify-content: flex-start;
  margin-top: 36px;
  margin-bottom: 36px;
}

.nav-buttons,
ul {
  flex-direction: column;
  align-items: flex-start;
  overflow-x: visible;
}

li {
  justify-content: flex-start;
}
</style>
