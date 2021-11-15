<template>
  <!--  TODO: Move navbar here -->
  <div class="simulation-ui">
    <playback-menu
      :speed="speed"
      :paused="paused"
      @toggle-pause="togglePause"
      @speed-down="decreaseSpeed"
      @speed-up="increaseSpeed"
    />
    <zoom-controller ref="zoomer" @adjust-zoom="$emit('zoomUpdate', $event)"/>
  </div>
</template>

<script lang="ts">
// TODO: Create component tracking object positions and overlay
import { BASE_ZOOM } from "@/assets/three/camera/camera.constants";
import { BASE_SPEED, MAX_SPEED, MIN_SPEED } from "@/assets/util/sim.constants";
import PlaybackMenu from "@/components/ui/sim/playback-menu.vue";
import ZoomController from "@/components/ui/sim/zoom-controller.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "simulation-ui",
  components: { ZoomController, PlaybackMenu },
  emits: ["zoomUpdate", "followBody"],
  data() {
    return {
      speed: BASE_SPEED,
      paused: false,
      animating: false,
      lastPausedBy: undefined as "animation" | "keyboard" | "mouse" | undefined
    };
  },
  methods: {
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
    reset() {
      this.$refs.zoomer.reset();
    },
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
