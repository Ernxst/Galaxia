<template>
  <celestial-form-container :description="description"
                            header="Orbit Parameters">
    <div class="container">
      <slider :id="`${modelValue.name}-orbital-period`"
              v-model="modelValue.orbitalPeriod"
              :max="10"
              :min="0.25"
              :show-limits="true"
              :step="0.01"
              label="Orbital Period"
              name="orbital-period" />
      <v-tooltip :text="`The orbital period is how long the ${type} takes to complete one full orbit around its parent.\nTherefore, a shorter orbital period will result in faster orbits and vice versa.`" />
    </div>

    <div class="container">
      <slider :id="`${modelValue.name}-eccentricity`"
              v-model="modelValue.eccentricity"
              :max="0.9999"
              :min="0"
              :show-limits="true"
              :step="0.001"
              label="Orbital Eccentricity"
              name="eccentricity" />
      <v-tooltip :text="`Celestial orbits are not perfectly circular. The orbital eccentricity affects how round the orbit of your ${type} is.\nAn eccentricity of 0 gives a perfect circle whereas a value of 0.9999... gives a very squashed ellipse.`" />
    </div>

    <div class="container">
      <slider :id="`${modelValue.name}-semi-major`"
              v-model="modelValue.semiMajor"
              :max="55"
              :min="0.386"
              :show-limits="true"
              :step="0.001"
              label="Semi Major Axis (AU)"
              name="semi-major" />
      <v-tooltip :text="`The semi major axis is the longest radius of the ${type}'s orbit (with the semi minor being the shortest).\n1 AU is the Astronomical Unit - the (average) distance between the Sun and the Earth (=149,600,000 km).`" />
    </div>

    <div class="orbit-preview centred">
      <p>Below are some 2D visualisations of your {{ type }}'s orbital path.</p>
      <h3>Orbital Path</h3>
      <svg viewbox="0 0 240 240"
           xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50%"
                 cy="50%"
                 :rx="rx"
                 :ry="ry" />
      </svg>
    </div>
    <div class="inclination-preview">
      <slider :id="`${modelValue.name}-inclination`"
              v-model="modelValue.inclination"
              :max="45"
              :min="0"
              :show-limits="true"
              label="Orbital Inclination"
              name="inclination" />
      <h3>Inclination Preview</h3>
      <div class="inclination">
        <span class="line abs x"></span>
        <span class="line abs y"></span>
        <span class="line abs value"
              :style="`--angle: ${-inclination}deg`"></span>
        <v-tooltip :text="`The green line shows how the elevation of your ${type} changes through one full orbit around the parent`" />
      </div>
    </div>
  </celestial-form-container>
</template>

<script lang="ts">
import Slider from "@/components/ui/widgets/slider.vue";
import VTooltip from "@/components/ui/widgets/v-tooltip.vue";
import CelestialFormContainer from "@/views/create/forms/form-container.vue";
import { MoonData, PlanetData } from "@/views/create/util/types";
import { computed, defineComponent, PropType, toRefs } from "vue";


export default defineComponent({
  name: "orbitable-form",
  emits: ["update:modelValue"],
  components: { VTooltip, CelestialFormContainer, Slider },
  props: {
    modelValue: Object as PropType<PlanetData | MoonData>,
    type: String as PropType<"moon" | "planet">
  },
  watch: {
    'modelValue.semiMajor': function (newVal: number) {
      this.modelValue.semiMinor = newVal * (1 - this.modelValue.eccentricity ** 2) ** 0.5;
    },
    'modelValue.eccentricity': function (newVal: number) {
      this.modelValue.semiMinor = this.modelValue.semiMajor * (1 - newVal ** 2) ** 0.5;

    },
  },
  setup(props) {
    const description = `These attributes define the orbit characteristics of the ${props.type}, hence affecting how the ${props.type} orbits around its star.`;
    const { semiMajor, eccentricity, inclination } = toRefs(props.modelValue);
    const rx = computed(() => (semiMajor.value * 2));
    const ry = computed(() => (rx.value * (1 - eccentricity.value ** 2) ** 0.5));
    return { description, rx, ry, inclination, };
  }
});
</script>

<style scoped>
.orbit-preview {
  flex-direction: column;
  cursor: default;
}

svg {
  stroke: var(--text-colour);
  fill: none;
  stroke-width: 2px;
  stroke-dasharray: 1 7;
  stroke-linecap: round;
  width: 100%;
  height: 256px;
}

h3 {
  font-size: 13px;
  padding: 4px;
  background: var(--main);
  color: var(--page-bg);
}

h3, p {
  width: 100%;
  text-align: left;
}

p {
  font-size: 10px;
}

.inclination-preview h3 {
  margin-top: 48px;
  margin-bottom: 24px;
}

.inclination {
  position: relative;
  width: 100%;
  height: 72px;
  margin-bottom: -18px;
  cursor: default;
}

.inclination .line {
  margin: auto;
}

.inclination .x {
  border-top: 1px dotted var(--text-colour);
  height: 1px;
  width: 50%;
}

.inclination .y {
  border-left: 1px dotted var(--text-colour);
  width: 1px;
  height: 100%;
}

.inclination .line.value {
  --angle: 0;
  width: 50%;
  height: 1px;
  background: var(--green);
  transform: rotate(var(--angle));
}
</style>
