<template>
  <celestial-form-container :description="description"
                            header="Asteroid Belt Attributes">
    <div v-for="attr in attributes"
         :key="attr.name"
         class="container">
      <div class="inner">
        <slider
          :id="`${modelValue.name}-${attr.name}`"
          v-model="modelValue[attr.name]"
          :label="`${sentenceCase(attr.name)}`"
          :max="attr.max"
          :min="attr.min"
          :name="attr.name"
          :show-limits="true"
          :step="attr.step" />
        <v-tooltip :text="attr.tooltip" />
      </div>
      <span class="warning"
            v-if="attr.name === 'numOfAsteroids'"
            :data-show="modelValue.numOfAsteroids > 40_000"><strong>Warning!</strong> Setting the number of asteroids higher than <strong>40,000</strong> may result in significant performance drops on lower end systems.</span>
    </div>
  </celestial-form-container>
</template>

<script lang="ts">
import Slider from "@/components/ui/widgets/slider.vue";
import VTooltip from "@/components/ui/widgets/v-tooltip.vue";
import CelestialFormContainer from "@/views/create/forms/form-container.vue";
import { AsteroidBeltData } from "@/views/create/util/types";
import { startCase } from "lodash-es";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "asteroid-form",
  emits: ["update:modelValue"],
  components: { VTooltip, CelestialFormContainer, Slider },
  props: {
    modelValue: Object as PropType<AsteroidBeltData>,
  },
  watch: {
    'modelValue.innerSemiMajor': function (newVal: number, oldVal: number) {
      if (newVal > oldVal && newVal >= this.modelValue.outerSemiMajor)
        this.modelValue.outerSemiMajor = newVal;
    },
    'modelValue.outerSemiMajor': function (newVal: number, oldVal: number) {
      if (newVal < oldVal && newVal < this.modelValue.innerSemiMajor)
        this.modelValue.innerSemiMajor = newVal;
    },
  },
  setup() {
    const description = `Customise these attributes to make your asteroid belt look just the way you want it. Changes made here are reflected in the 3D preview.`;

    function sentenceCase(text: string) {
      return startCase(text);
    }

    const attributes = [{ name: "numOfAsteroids", min: 300, max: 250_000, step: 10, tooltip: "Set how many individual asteroids you want in this asteroid belt. Naturally, more asteroids will require more processing power to render.\nA value less than 20,000 is safe for all devices." },
      { name: "depth", min: 0.5, max: 25, step: 0.1, tooltip: "The depth defines the vertical height of your asteroid belt and is measured in astronomical units AU (1 AU = 149,600,000 km)" },
      { name: "innerSemiMajor", min: 0.386, max: 50, step: 0.001, tooltip: `The semi major axis is the longest radius of the asteroid belt's orbit (with the semi minor being the shortest).\n1 AU is the Astronomical Unit - the (average) distance between the Sun and the Earth (=149,600,000 km).\nThis value modifies the semi major of the inner side of the belt.` },
      { name: "innerEccentricity", min: 0, max: 0.9999, step: 0.001, tooltip: `Celestial orbits are not perfectly circular. The orbital eccentricity affects how round the orbit of your asteroid belt is.\nAn eccentricity of 0 gives a perfect circle whereas a value of 0.9999... gives a very squashed ellipse.\nThis value modifies the eccentricity of the inner side of the belt.` },
      { name: "outerSemiMajor", min: 0.5, max: 55, step: 0.01, tooltip: `The semi major axis is the longest radius of the asteroid belt's orbit (with the semi minor being the shortest).\n1 AU is the Astronomical Unit - the (average) distance between the Sun and the Earth (=149,600,000 km).\nThis value modifies the semi major of the outer side of the belt.` },
      { name: "outerEccentricity", min: 0, max: 0.9999, step: 0.001, tooltip: `Celestial orbits are not perfectly circular. The orbital eccentricity affects how round the orbit of your asteroid belt is.\nAn eccentricity of 0 gives a perfect circle whereas a value of 0.9999... gives a very squashed ellipse.\nThis value modifies the eccentricity of the outer side of the belt.` },
    ];

    return { description, attributes, sentenceCase, };
  }
});
</script>

<style scoped>
.warning {
  display: block;
  color: rgba(255, 255, 255, .75);
  font-size: 9px;
  margin-top: 48px;
  margin-bottom: -24px;
  max-height: 0;
  overflow: hidden;
  transition: .4s ease-in-out all;
}

.warning[data-show=true] {
  max-height: 1000px;
}

.warning strong {
  color: var(--main);
}

.container:last-child {
  margin-bottom: 36px;
}
</style>
