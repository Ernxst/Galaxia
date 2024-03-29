<template>
  <nav class="playback-container sim-ui-section centred"
       :data-disabled="false">
    <section class="row">
      <p class="sim-speed">Simulation Speed: <strong>×{{ scaledSpeed }}</strong>
        <br>
        <span><strong>1</strong> Frame = <strong>{{ timeStep }}</strong> Earth Days</span>
      </p>
    </section>
    <section class="button-row row centred">
      <slider :min="minSpeed"
              :max="maxSpeed"
              :step="1"
              v-model="speed"
              id="speed-slider" />
      <circle-button
        :radius="buttonRadius"
        class="playback-button"
        @click="$emit('togglePause', $event)"
      >
      <span class="icon centred material-icons">{{
          paused ? "play_arrow" : "pause"
        }}</span>
      </circle-button>
    </section>
  </nav>
</template>

<script lang="ts">
import { BASE_SPEED, MAX_SPEED, MIN_SPEED, TIME_STEP } from "@/assets/util/sim.constants";
import CircleButton from "@/components/ui/widgets/buttons/circle-button.vue";
import Slider from "@/components/ui/widgets/slider.vue";
import { computed, defineComponent, ref, toRefs, watch } from "vue";


export default defineComponent({
  name: "playback-menu",
  components: { Slider, CircleButton },
  emits: ["togglePause", "speedUp", "speedDown", "update:modelValue"],
  props: {
    paused: Boolean,
    modelValue: Number
  },
  setup(props, { emit }) {
    const { modelValue, paused } = toRefs(props);
    const buttonRadius = computed(() => window.innerWidth < 480 ? 18 : 16);
    const speed = ref<number>(BASE_SPEED);
    const scaledSpeed = computed(() => Math.round(modelValue.value / BASE_SPEED));
    watch(speed, (newVal) => emit("update:modelValue", newVal));
    return {
      minSpeed: MIN_SPEED,
      maxSpeed: MAX_SPEED,
      timeStep: TIME_STEP,
      buttonRadius,
      speed,
      scaledSpeed,
      paused,
    };
  }
});
</script>

<style>
.playback-container {
  position: fixed;
  top: 16px;
  left: 0;
  right: 0;
  width: fit-content;
  margin: auto;
  flex-direction: column;
  z-index: 4;
  padding: 16px;
  backdrop-filter: blur(10px);
  border-radius: 4px;
}

.playback-container[data-disabled=true] {
  filter: brightness(0.33);
  pointer-events: none;
}

.playback-container .sim-speed {
  margin-top: 0;
  margin-bottom: 6px;
  font-size: 13px;
  text-align: center;
}

.playback-container .sim-speed span {
  font-size: 10px;
}

.playback-container .sim-speed strong {
  color: var(--main);
}

.playback-container .sim-speed, .playback-container .sim-speed strong {
  text-shadow: 0 0 8px var(--page-bg);
}

.playback-container .playback-button {
  margin-left: 12px;
}

.playback-container .playback-button .icon {
  color: var(--text-colour);
  transition: 0.4s ease-in-out all;
  font-size: 16px;
  mix-blend-mode: multiply;
}

.playback-container .circle-button:hover .icon {
  color: var(--page-bg);
}

@media (max-width: 480px) {
  .playback-container {
    bottom: 16px;
    top: unset;
    flex-direction: column-reverse;
    backdrop-filter: none;
  }

  .playback-container .sim-speed {
    margin-top: 6px;
    margin-bottom: 0;
    letter-spacing: 1px;
  }
}

@media (max-height: 480px) and (min-width: 480px) and (orientation: landscape) {
  .playback-container {
    top: 0;
    padding: 8px;
  }

  .playback-container .sim-speed {
    letter-spacing: 1px;
  }
}
</style>
