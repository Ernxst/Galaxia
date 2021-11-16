<template>
  <div class="simulation-ui">
    <playback-menu
      :speed="speed"
      :paused="paused"
      @toggle-pause="togglePause"
      @speed-down="decreaseSpeed"
      @speed-up="increaseSpeed"
    />
    <template v-if="starSystem !== null">
      <navbar
        ref="navbar"
        :stars="[starSystem.star]"
        :planets="starSystem.planets"
        @follow="$emit('followBody', $event)"
      />
    </template>
    <zoom-controller ref="zoomer" @adjust-zoom="$emit('zoomUpdate', $event)"/>
    <info-hub ref="hub" @reset="$emit('reset')"/>
  </div>
</template>

<script lang="ts">
// TODO: Create component tracking object positions and overlay
import { StarSystem } from "@/@types/celestial/containers/star-system";
import { BASE_ZOOM } from "@/assets/three/camera/camera.constants";
import { BASE_SPEED, MAX_SPEED, MIN_SPEED } from "@/assets/util/sim.constants";
import InfoHub from "@/components/ui/sim/info-hub.vue";
import Navbar from "@/components/ui/sim/navbar/Navbar.vue";
import PlaybackMenu from "@/components/ui/sim/playback-menu.vue";
import ZoomController from "@/components/ui/sim/zoom-controller.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "simulation-ui",
  components: { Navbar, InfoHub, ZoomController, PlaybackMenu },
  emits: ["zoomUpdate", "followBody", "reset"],
  data() {
    return {
      starSystem: null as StarSystem,
      speed: BASE_SPEED,
      paused: false,
      animating: false,
      lastPausedBy: undefined as "animation" | "keyboard" | "mouse" | undefined
    };
  },
  methods: {
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
      // Used so the app can pause again after animation ends if it was paused by the user
      if (!this.paused) {
        this.lastPausedBy = "animation";
        this.pause();
      }
    },
    stopAnimation() {
      this.setZoom(BASE_ZOOM);
      this.animating = false;
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
    setZoom(zoom: number) {
      this.$refs.zoomer.update(zoom);
    },
    zoomIn() {
      this.$refs.zoomer.zoomIn();
    },
    zoomOut() {
      this.$refs.zoomer.zoomOut();
    },
    disableZoom() {
      this.$refs.zoomer.disable();
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
      this.$refs.hub.setActiveBody(body, type);
    },
    reset() {
      this.$refs.navbar.toggle(undefined);
      this.$refs.zoomer.reset();
      this.$refs.hub.resetBody();
    },
  },
  mounted() {
    window.addEventListener("keydown", (e) => {
      if (this.animating) return;
      switch (e.key) {
        case "r":
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
        case "+":
          this.zoomIn();
          return;
        case "-":
          this.zoomOut();
          return;
      }
    });
  }
});
</script>

<style scoped>
.simulation-ui {
  animation-duration: 1.67s;
  animation-name: fadeIn;
  animation-fill-mode: forwards;
  opacity: 0;
  animation-delay: 1.33s;
}
</style>
