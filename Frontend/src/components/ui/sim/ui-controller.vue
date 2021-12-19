<template>
  <template v-if="starSystem !== null">
    <sim-intro ref="intro"
               @intro-started="animDelay = $event + 2"
               :username="starSystem.by"
               :simulation-name="starSystem.name"
               :preset="starSystem.preset" />
  </template>
  <div class="simulation-ui"
       :style="{ 'animation-delay': `${animDelay}s` }">
    <playback-menu :paused="paused"
                   :speed="speed"
                   v-bind:data-disabled="animating"
                   @toggle-pause="togglePause"
                   @speed-down="decreaseSpeed"
                   @speed-up="increaseSpeed" />
    <span :open="menuOpen"
          class="toggler close-icon material-icons centred"
          @click="menuOpen = !menuOpen">{{ menuOpen ? "close" : "menu" }}</span>
    <section :open="menuOpen"
             class="mobile-menu glass centred">
      <template v-if="starSystem !== null">
        <h2>Track Object</h2>
        <p>Select a celestial body below to follow.</p>
        <navbar ref="navbar"
                :planets="starSystem.planets"
                :stars="[starSystem.star]"
                @follow="$emit('followBody', $event)" />
      </template>
      <info-hub ref="hub"
                @reset="$emit('reset')"
                @open-factfile="$emit('openFactfile')"
                @close-factfile="$emit('closeFactfile')" />
    </section>
  </div>
</template>

<script lang="ts">
// TODO: Create component tracking object positions and overlay
import { StarSystem } from "@/@types/celestial/containers/star-system";
import { BASE_SPEED, MAX_SPEED, MIN_SPEED } from "@/assets/util/sim.constants";
import InfoHub from "@/components/ui/sim/info-hub.vue";
import Navbar from "@/components/ui/sim/navbar/Navbar.vue";
import PlaybackMenu from "@/components/ui/sim/playback-menu.vue";
import SimIntro from "@/components/ui/sim/sim-intro.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "UiController",
  components: { SimIntro, Navbar, InfoHub, PlaybackMenu },
  emits: ["followBody", "reset", "openFactfile", "closeFactfile", "introComplete"],
  data() {
    return {
      starSystem: null as StarSystem,
      speed: BASE_SPEED,
      paused: false,
      animating: false,
      lastPausedBy: undefined as "animation" | "keyboard" | "mouse" | undefined,
      menuOpen: false,
      animDelay: 10,
      activeBody: "",
    };
  },
  methods: {
    startIntro() {
      this.startAnimation();
      this.$refs.intro.start().then(() => {
        this.stopAnimation();
        this.$emit("introComplete");
      });
    },
    setStarSystem(system: StarSystem) {
      this.starSystem = system;
    },
    togglePause(event: Event) {
      // Wait for animation to finish and unpause naturally
      if (this.paused && this.lastPausedBy === "animation") return;

      if (event instanceof KeyboardEvent) this.lastPausedBy = "keyboard";
      else if (event instanceof MouseEvent) this.lastPausedBy = "mouse";
      this.paused = !this.paused;
    },
    startAnimation() {
      this.animating = true;
      this.$refs.navbar.disable();
      // Used so the app can pause again after animation ends if it was paused by the user
      if (!this.paused) {
        this.lastPausedBy = "animation";
        this.pause();
      }
    },
    stopAnimation() {
      this.animating = false;
      this.$refs.navbar.enable();
      if (this.paused && this.lastPausedBy === "animation") this.unpause();
    },
    pause() {
      this.paused = true;
    },
    unpause() {
      this.paused = false;
    },
    increaseSpeed() {
      if (this.speed < MAX_SPEED) this.speed += 1;
    },
    decreaseSpeed() {
      if (this.speed > MIN_SPEED) this.speed -= 1;
    },
    shouldFollow(name: string) : boolean {
      return name !== this.activeBody;
    },
    followBody(name: string, isStar: boolean, isMoon: boolean) {
      let body;
      let type;
      if (isStar) {
        body = this.starSystem.star;
        type = "Star";
      } else if (!isMoon) {
        body = this.starSystem.planets.find((component) => component.name === name);
        type = "Planet";
      } else {
        for (const planet of this.starSystem.planets) {
          if (planet.moons !== undefined) {
            const moon = planet.moons.find(moon => moon.name === name);
            if (moon) {
              body = moon;
              type = "Moon";
              break;
            }
          }
        }
      }
      this.activeBody = name;
      this.$refs.navbar.toggle(name);
      this.$refs.hub.setActiveBody(body, type);
    },
    reset() {
      this.$refs.navbar.toggle(undefined);
      this.$refs.hub.reset();
      this.activeBody = "";
    },
  },
  mounted() {
    window.addEventListener("keydown", (e) => {
      if (this.animating) return;
      switch (e.key) {
        case "r":
          if (this.animating) return;
          this.reset();
          this.$emit("reset");
          return;
        case "p":
          this.togglePause(e);
          return;
        case "<":
          this.decreaseSpeed();
          return;
        case ">":
          this.increaseSpeed();
          return;
      }
    });
  }
});
</script>

<style scoped>
.simulation-ui {
  --animation-delay: 6.33s;
  animation-duration: 1.67s;
  animation-name: fadeIn;
  animation-fill-mode: forwards;
  opacity: 0;
  animation-delay: var(--animation-delay);
}

.toggler {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 5;
  border-radius: 0;
  background: var(--green);
}

.mobile-menu {
  border-radius: 0;
}

h2, p {
  display: none;
}

@media (min-width: 480px) {
  .mobile-menu {
    background: none;
    border: none;
    backdrop-filter: none;
    background-clip: unset;
  }

  .toggler {
    display: none;
  }
}

@media (max-width: 480px) {
  .mobile-menu {
    max-height: 75vh;
    overflow-y: auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    transition-property: transform, padding-top;
    transition-duration: .67s;
    transition-timing-function: ease;
  }

  .mobile-menu[open=true] {
    transform: translateY(0);
    padding-top: 48px;
  }

  .mobile-menu[open=false] {
    transform: translateY(-100%);
    padding-top: 0;
  }

  h2, p {
    display: inline-block;
    margin: 4px auto 0;
  }

  p {
    font-size: 11px;
    padding-left: var(--page-padding);
    padding-right: var(--page-padding);
    text-align: center;
  }

  .toggler[open=true] {
    background: var(--red);
  }
}
</style>
