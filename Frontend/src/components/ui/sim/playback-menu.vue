<template>
  <nav class="playback-container centred">
    <div class="row centred">
      <p class="sim-speed">Simulation Speed: <strong>{{ scaledSpeed }}×</strong></p>
    </div>
    <div class="row centred">
      <circle-button
        :class="speedDownClass"
        :radius="buttonRadius"
        @click="$emit('speedDown')"
      >
        <span class="icon centred material-icons">fast_rewind</span>
      </circle-button>
      <circle-button
        :radius="buttonRadius"
        class="playback-button"
        @click="$emit('togglePause', $event)"
      >
      <span class="icon centred material-icons">{{
          paused ? "play_arrow" : "pause"
        }}</span>
      </circle-button>
      <circle-button
        :class="speedUpClass"
        :radius="buttonRadius"
        @click="$emit('speedUp')"
      >
        <span class="icon centred material-icons">fast_forward</span>
      </circle-button>
    </div>
  </nav>
</template>

<script lang="ts">
import { BASE_SPEED, MAX_SPEED, MIN_SPEED } from "@/assets/util/sim.constants";
import CircleButton from "@/components/ui/widgets/buttons/circle-button.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "playback-menu",
  components: { CircleButton },
  emits: ["togglePause", "speedUp", "speedDown"],
  props: {
    paused: Boolean,
    speed: Number,
  },
  computed: {
    buttonRadius(): number {
      return 16;
    },
    speedDownClass(): string {
      return `playback-button ${this.speed === MIN_SPEED ? "disabled" : ""}`;
    },
    speedUpClass(): string {
      return `playback-button ${this.speed === MAX_SPEED ? "disabled" : ""}`;
    },
    scaledSpeed(): number {
      return Math.round(this.speed / BASE_SPEED);
    }
  },
});
</script>

<style>
.playback-container {
  position: fixed;
  top: 16px;
  left: 0;
  right: 0;
  flex-direction: column;
}

.playback-container .sim-speed {
  margin-top: 0;
  margin-bottom: 6px;
  font-size: 13px;
}

.playback-container .sim-speed strong {
  color: var(--main);
}

.playback-container .playback-button {
  margin-right: 6px;
}

.playback-container .playback-button:last-child {
  margin-right: 0;
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

@media (max-width: 480px) {
  .playback-container {
    bottom: 16px;
    top: unset;
    flex-direction: column-reverse;
  }

  .playback-container .sim-speed {
    margin-top: 6px;
    margin-bottom: 0;
  }
}
</style>
