<template>
  <nav class="navbar centred noselect" role="navigation">
    <div class="nav-buttons centred">
      <ul class="stars">
        <li v-for="star in stars" v-bind="star" class="star centred">
          <nav-item
            :ref="(el) => (buttons[star.name] = el)"
            :icon="star.texture"
            :isStar="true"
            :name="star.name"
            @follow="followPlanet"
          />
        </li>
      </ul>
      <ul class="planets">
        <li v-for="planet in planets" v-bind="planet" class="planet centred">
          <nav-item
            :ref="(el) => (buttons[planet.name] = el)"
            :distance="planet.semiMajor"
            :icon="planet.texture"
            :isStar="false"
            :moons="planet.moons"
            :name="planet.name"
            @follow="followPlanet"
          />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
// TODO: Add asteroid belts to navbar
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
  // beforeUpdate() {
  //   this.buttons = {};
  // },
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

@media (max-width: 480px) {
  .navbar {
    position: relative;
    width: 100%;
    margin: 0;
    top: unset;
    left: unset;
    bottom: unset;
    height: unset;
  }

  .nav-buttons {
    width: 100%;
    margin-top: 0;
    margin-bottom: 0;
    padding: 16px;
  }

  .nav-buttons, ul {
    display: flex;
    flex-direction: row;
    overflow-y: visible;
  }

  .stars {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .planets {
    overflow-x: scroll;
    align-items: flex-start;
    justify-content: flex-start;
  }
}
</style>
