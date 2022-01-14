<template>
  <div :data-orient="orient"
       :data-disabled="false"
       class="slider-container noselect">
    <label v-if="label">{{ label }}</label>
    <div class="slider-inner">
      <span v-if="showLimits">{{ min }}</span>
      <div class="slider">
        <input :id="id"
               ref="slider"
               :max="max"
               :min="min"
               :step="step"
               :name="name"
               :value.number="modelValue"
               type="range"
               @input="onUpdate"
               :style="`--left: ${left}px`"
        />
        <p ref="sliderLabel"
           :for="id">
          {{ modelValue }}
        </p>
      </div>
      <span v-if="showLimits">{{ max }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "slider",
  props: {
    min: { default: 0, type: Number },
    max: { default: 100, type: Number },
    modelValue: Number,
    step: { default: 1, type: Number },
    showLimits: { default: false, type: Boolean },
    id: { type: String, required: true },
    label: String,
    name: String,
    orient: { default: "horizontal", type: String },
  },
  emits: ["update:modelValue"],
  computed: {
    range(): number {
      return Math.abs(this.max - this.min);
    }
  },
  data() {
    return {
      left: 0,
    };
  },
  watch: {
    modelValue(newVal) {
      this.updateSliderPos(newVal);
    }
  },
  methods: {
    onUpdate(event: InputEvent) {
      this.updateSliderPos(event.target.value);
      event.preventDefault();
      this.$emit("update:modelValue", Number(event.target.value));
    },
    update() {
      this.updateSliderPos(this.$refs.slider?.value);
    },
    // Move the slider value indicator
    updateSliderPos(newValue: string) {
      this.$nextTick(() => {
        const percentage = (Number(newValue) - this.min) / this.range;
        const width = this.$refs.slider.clientWidth;
        const lblWidth = this.$refs.sliderLabel.clientWidth;
        this.$refs.sliderLabel.style.left = `${percentage * (width - lblWidth)}px`;
        this.left = percentage * (width - lblWidth / 2);
      });
    },
  },
  mounted() {
    window.addEventListener("resize", this.update);
    this.update();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.update);
  }
});
</script>

<style scoped>
.slider-container {
  display: grid;
  grid-row-gap: 6px;
}

label {
  margin: 0;
  width: 100%;
  font-size: 11px;
  color: var(--text-colour);
}

span {
  padding: 4px;
  border-radius: var(--button-radius);
  color: var(--text-colour);
  font-size: 12px;
}

.slider-inner {
  display: grid;
  grid-template-columns: auto 5fr auto;
  grid-column-gap: 6px;
}

.slider {
  position: relative;
  grid-column-start: 2;
}

input[type="range"] {
  --thumb-size: 24px;
  --bg: var(--main);
  --left: 0;
  -webkit-appearance: none;
  height: 4px;
  background: #D3D3D3 linear-gradient(to right, var(--bg) 0%, var(--bg) 100%) no-repeat;
  border: none;
  outline: none;
  border-radius: var(--button-radius);
  width: 100%;
  position: relative;
}

input::after {
  position: absolute;
  top: 0;
  left: var(--left);
  bottom: 0;
  right: 0;
  z-index: 1;
  content: "";
  background: rgba(255, 255, 255, .5);
  mix-blend-mode: difference;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  box-shadow: none;
  background: transparent;
  border-radius: 0;
  border: none;
}

input[type="range"]::-webkit-slider-thumb {
  box-shadow: none;
  border: 4px solid var(--bg);
  height: var(--thumb-size);
  width: var(--thumb-size);
  border-radius: 2px;
  background: var(--page-bg);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -10px;
  position: relative;
  z-index: 3;
}

input[type="range"]:focus::-webkit-slider-runnable-track {
  background: transparent;
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  box-shadow: none;
  background: transparent;
  border-radius: 0;
  border: none;
}

input[type="range"]::-moz-range-thumb {
  box-shadow: none;
  border: 4px solid var(--bg);
  height: var(--thumb-size);
  width: var(--thumb-size);
  border-radius: 2px;
  background: #FFFFFF;
  cursor: pointer;
  position: relative;
  z-index: 3;
}

input[type="range"]::-ms-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}

input[type="range"]::-ms-fill-lower {
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

input[type="range"]::-ms-fill-upper {
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

input[type="range"]::-ms-thumb {
  box-shadow: none;
  border: 4px solid var(--bg);
  height: var(--thumb-size);
  width: var(--thumb-size);
  border-radius: 2px;
  background: #FFFFFF;
  cursor: pointer;
  position: relative;
  z-index: 3;
}

input[type="range"]:focus::-ms-fill-lower {
  background: transparent;
}

input[type="range"]:focus::-ms-fill-upper {
  background: transparent;
}

p {
  position: absolute;
  left: 0;
  top: 100%;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.22);
  padding: 4px 8px;
  letter-spacing: 0;
  z-index: 2;
  font-size: 12px;
  background: var(--page-bg);
  margin: 6px 0 0 0;
  border: 1px solid var(--main);
}

.slider-container[data-disabled=true] input[type="range"] {
  --bg: grey;
  pointer-events: none;
}

.slider-container[data-disabled=true] label {
  color: grey;
}

.slider-container[data-orient=vertical] {
  transform: rotate(90deg);
}

.slider-container[data-orient=vertical] .slider-inner {
  transform: translate(50%, -50%) translateX(-48px) rotate(180deg);
}

.slider-container[data-orient=vertical] label {
  transform: translateX(-64px) translateY(-35px) rotate(-90deg);
}

.slider-container[data-orient=vertical] span,
.slider-container[data-orient=vertical] p {
  transform: rotate(90deg) translateY(25px);
}

.slider-container[data-orient=vertical] p {
  margin-left: 28px;
}
</style>
