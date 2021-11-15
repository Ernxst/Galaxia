<template>
  <div class="slider-container noselect centred" :orient="orient">
    <p class="slider-label">{{ label }}</p>
    <div class="slider-inner centred">
      <span class="min value centred" v-if="show_limits">{{ minValue }}</span>
      <div class="slider centred">
        <input
          type="range"
          :min="minValue"
          :max="maxValue"
          class="slider"
          :id="id"
          ref="slider"
          :step="step"
          value.number="modelValue"
          @input="update"
        />
        <label :for="id" class="current-value noselect centred" ref="sliderLabel">
          {{ modelValue }}
        </label>
      </div>
      <span class="max value centred" v-if="show_limits">{{ maxValue }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUpdate } from "@vue/runtime-dom";
import { computed, onMounted, ref, toRefs, watch } from "vue";


export default defineComponent({
  name: "slider",
  props: {
    min: { default: 0, type: Number },
    max: { default: 100, type: Number },
    modelValue: { default: 50, type: Number },
    step: { default: 1, type: Number },
    show_limits: { default: false, type: Boolean },
    id: String,
    label: String,
    orient: { default: "horizontal", type: String },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const reactiveProps = toRefs(props);
    const minValue = reactiveProps.min;
    const maxValue = reactiveProps.max;
    const range = computed(() => {
      return maxValue.value - minValue.value;
    });

    watch(reactiveProps.modelValue, () => {
      if (slider.value.value !== props.modelValue)
        slider.value.value = props.modelValue
    });

    const slider = ref<HTMLInputElement>();
    const sliderLabel = ref<HTMLElement>();

    function update(event: Event) {
      const el = event.target as HTMLInputElement;
      const newValue: number = parseInt(el.value);
      emit("update:modelValue", newValue);
    }

    function setPos(value: number) {
      const percentage = (value - minValue.value) / range.value;
      const width = slider.value?.clientWidth;
      const labelWidth = sliderLabel.value?.clientWidth;
      if (sliderLabel.value && width && labelWidth) {
        sliderLabel.value.style["left"] = `${
          percentage * (width - labelWidth)
        }px`;
      }
    }

    onBeforeUpdate(() => {
      setPos(props.modelValue);
    });

    onMounted(() => {
      // @ts-ignore
      slider.value.value = props.modelValue;
      setPos(props.modelValue);
      window.addEventListener("resize", () => {
        setPos(props.modelValue);
      });
    });
    return {
      minValue,
      maxValue,
      slider,
      sliderLabel,
      update,
    };
  },
});
</script>

<style scoped>
.slider-container[orient=vertical] .slider-inner {
  transform: rotate(270deg);
  margin-top: 64px;
}

.slider-container,
.slider {
  width: 100%;
  flex-direction: column;
  position: relative;
}

.slider-label {
  text-align: left;
  margin-top: 0;
  margin-bottom: 16px;
  line-height: 90%;
  font-size: 16px;
  color: var(--text-colour);
}

.slider-container[orient=vertical] .slider-label {
  text-align: center;
}

.slider-inner,
.slider-label,
.slider {
  width: 100%;
}

.value {
  padding: 4px;
  border-radius: var(--button-radius);
  color: var(--text-colour);
  background: var(--page-bg);
  -webkit-text-stroke: 1px var(--page-bg);
}

.min {
  margin-right: 6px;
}

.max {
  margin-left: 6px;
}

.slider-container[orient=vertical] .value {
  transform: rotate(-270deg);
}

.slider input[type="range"] {
  --thumb-size: 24px;
  --bg: var(--main);
  -webkit-appearance: none;
  height: 4px;
  border-radius: var(--button-radius);
  outline: none;
  width: 100%;
  background: #D3D3D3;
  background-image: -webkit-gradient(
    linear,
    20% 0%,
    20% 100%,
    color-stop(0%, var(--bg)),
    color-stop(100%, var(--bg))
  );
  background-image: -webkit-linear-gradient(left, var(--bg) 0%, var(--bg) 100%);
  background-image: -moz-linear-gradient(left, var(--bg) 0%, var(--bg) 100%);
  background-image: -o-linear-gradient(to right, var(--bg) 0%, var(--bg) 100%);
  background-image: linear-gradient(to right, var(--bg) 0%, var(--bg) 100%);
  background-repeat: no-repeat;
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
  background: #212121;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -10px;
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
}

input[type="range"]:focus::-ms-fill-lower {
  background: transparent;
}

input[type="range"]:focus::-ms-fill-upper {
  background: transparent;
}

.current-value {
  position: absolute;
  left: 0;
  top: calc(100% + 14px);
  color: var(--bg);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.22);
  padding: 5px;
  z-index: 2;
  font-weight: 700;
  -webkit-text-stroke: 1px var(--page-bg);
}

.slider-container[orient=vertical] .current-value {
  transform: rotate(-270deg);
}

.slider-container[disabled=true] input[type=range] {
  --bg: grey;
  pointer-events: none;
}

.slider-container[disabled=true] .slider-label {
  color: grey;
}
</style>
