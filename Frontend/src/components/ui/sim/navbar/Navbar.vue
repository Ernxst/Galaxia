<template>
  <nav class="navbar centred noselect"
       role="navigation"
       :data-disabled="disabled">
    <div class="nav-buttons centred">
      <ul class="stars">
        <li v-for="(star, index) in stars"
            :key="index"
            :data-name="star.name"
            class="star centred">
          <nav-item
            :ref="(el) => (buttons[star.name] = el)"
            :icon="star.texture"
            :isStar="true"
            :name="star.name"
            @follow="$emit('follow', $event)"
          />
        </li>
      </ul>
      <ul class="planets">
        <li v-for="(planet, index) in planets"
            :key="index"
            :data-name="planet.name"
            class="planet centred">
          <nav-item
            :ref="(el) => (buttons[planet.name] = el)"
            :distance="planet.semiMajor"
            :icon="planet.texture"
            :isStar="false"
            :moons="planet.moons"
            :name="planet.name"
            @follow="$emit('follow', $event)"
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
      disabled: false,
    };
  },
  methods: {
    disable() {
      this.disabled = true;
    },
    enable() {
      this.disabled = false;
    },
    toggle(objectName: string) {
      for (const [name, button] of Object.entries(this.buttons)) {
        if (name === objectName) button.activate();
        else if (button.hasMoon(objectName)) button.activateMoon(objectName);
        else button.deactivate();
      }
    },
  },
});
</script>

<style scoped>
.navbar {
  position: absolute;
  height: 100%;
  top: 0;
  left: 16px;
  margin-top: auto;
  margin-bottom: auto;
  z-index: 2;
}

.navbar[data-disabled=true] .nav-buttons {
  pointer-events: none;
  filter: brightness(0.4);
}

.nav-buttons {
  overflow-y: auto;
  overflow-x: hidden;
  justify-content: flex-start;
  max-height: calc(100vh - 72px);
  position: relative;
  backdrop-filter: blur(10px);
  border-radius: 4px;
}

.nav-buttons, ul {
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
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
    backdrop-filter: none;
    max-height: unset;
  }

  .nav-buttons, ul {
    display: flex;
    flex-direction: row;
    overflow: unset;
  }

  .stars {
    display: flex;
    align-items: center;
    justify-content: center;
    width: min-content;
  }

  .planets {
    align-items: flex-start;
    justify-content: flex-start;
    overflow-x: auto;
  }
}

@media (max-height: 480px) and (min-width: 480px) and (orientation: landscape) {
  .navbar {
    left: 0;
  }

  .nav-buttons {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  ul {
    overflow: visible;
  }
}
</style>
