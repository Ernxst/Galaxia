<template>
  <nav class="playback-container centred">
    <circle-button
      :class="speedDownClass"
      @click="$emit('speedDown', $event)"
      :radius="buttonRadius"
    >
      <span class="icon centred material-icons">fast_rewind</span>
    </circle-button>
    <circle-button
      class="playback-button"
      @click="$emit('togglePause', $event)"
      :radius="buttonRadius"
    >
      <span class="icon centred material-icons">{{
          paused ? "play_arrow" : "pause"
        }}</span>
    </circle-button>
    <circle-button
      :class="speedUpClass"
      @click="$emit('speedUp', $event)"
      :radius="buttonRadius"
    >
      <span class="icon centred material-icons">fast_forward</span>
    </circle-button>
  </nav>
</template>

<script lang="ts">
import { MAX_SPEED, MIN_SPEED } from "@/assets/util/sim.constants";
import CircleButton from "@/components/ui/widgets/buttons/circle-button.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "playback-menu",
  components: { CircleButton },
  props: {
    paused: Boolean,
    speed: Number,
  },
  computed: {
    buttonRadius() {
      return 16;
    },
    speedDownClass() {
      return `playback-button ${this.speed === MIN_SPEED ? "disabled" : ""}`;
    },
    speedUpClass() {
      return `playback-button ${this.speed === MAX_SPEED ? "disabled" : ""}`;
    },
  },
});
</script>

<style>
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.playback-container {
  position: fixed;
  top: 16px;
  z-index: 2;
  animation-duration: 1.67s;
  animation-name: fadeIn;
}

.playback-container .playback-button {
  margin-right: 6px;
}

.playback-container .playback-button .icon {
  color: var(--text-colour);
  transition: 0.4s ease-in-out all;
  font-weight: 100;
  font-size: 16px;
  z-index: 3;
}

.playback-container .circle-button:hover .icon {
  color: var(--page-bg);
}

.playback-container .playback-button.disabled {
  pointer-events: none;
}

.playback-container .playback-button.disabled .circle-button {
  background: rgba(255, 255, 255, 0.75);
}
</style>
