<template>
  <celestial-form-container :description="description"
                            header="Celestial Attributes">
    <div v-for="attr in attributes"
         :key="attr.name"
         v-show="attr.show"
         class="container">
      <slider
        :id="`${name}-${attr.name}`"
        v-model="modelValue[attr.name]"
        :label="`${sentenceCase(attr.name)} ${ attr.relative ? `(relative to ${comparedTo})` : ''}`"
        :max="attr.max"
        :min="attr.min"
        :name="attr.name"
        :show-limits="true"
        :step="attr.step" />
      <v-tooltip v-if="attr.tooltip !== ''"
                 :text="attr.tooltip" />
    </div>
    <div class="container">
      <slider v-if="type === 'star'"
              :id="`${name}-luminosity`"
              v-model="modelValue.luminosity"
              :max="10"
              :min="0.25"
              :show-limits="true"
              :step="0.01"
              label="Solar Luminosity (relative to the sun)"
              name="luminosity" />
      <v-tooltip :text="`The solar luminosity is the total power output of the Sun radiated to space. In Layman's terms, it is the amount of light emitted by an object each second.\nIn the simulation, a higher solar luminosity will light up the planets, moons and asteroid belts in the simulation more.\nHowever, if the other bodies are placed too close to the star, they will appear white, receiving too much light.`" />
    </div>
  </celestial-form-container>
</template>

<script lang="ts">
import Slider from "@/components/ui/widgets/slider.vue";
import VTooltip from "@/components/ui/widgets/v-tooltip.vue";
import CelestialFormContainer from "@/views/create/builder/forms/form-container.vue";
import { startCase } from "lodash-es";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "celestial-form",
  emits: ["update:modelValue"],
  components: { VTooltip, CelestialFormContainer, Slider },
  props: {
    name: String,
    modelValue: Object,
    type: String as PropType<"star" | "moon" | "planet" | "asteroid belt">
  },
  setup(props) {
    const description = `These are the most basic attributes to define your ${props.type}, affecting visual and rotational characteristics of the ${props.type}. `;

    function sentenceCase(text: string) {
      return startCase(text);
    }

    const comparedTo = (props.type === "star" ? "The Sun" :
      props.type === "planet" ? "The Earth" : "The moon");

    const attributes = [
      {
        name: "mass",
        min: 0.25,
        max: 10,
        step: 0.01,
        relative: true,
        tooltip: "Define how heavy (massive) your object is!",
        show: props.type !== 'asteroid belt',
      },
      {
        name: "meanVelocity",
        min: 0.25,
        max: 10,
        step: 0.01,
        relative: true,
        show: props.type !== 'asteroid belt',
        tooltip: `The mean velocity defines how fast your ${props.type} travels through space and hence has some influence on how fast one orbit around its parent takes (if applicable).`
      },
      {
        name: "dayLength",
        min: 0,
        max: props.type === 'asteroid belt' ? 1_000_000 : 10,
        step: props.type === 'asteroid belt' ? 1 : 0.01,
        relative: props.type !== 'asteroid belt',
        show: true,
        tooltip: `The day length, as you might expect, defines the length of a day on the ${props.type}. It also defines how fast the ${props.type} spins on its own axis. A shorter day length = faster spinning!\nHowever, tidally locked bodies do not spin on their own axis. To add your own tidally locked ${props.type}, set the day length to 0.`
      },
      {
        name: "axialTilt",
        min: 0,
        max: 360,
        step: 0.1,
        relative: false,
        tooltip: `Put simply, the axial tilt is defined as the angle between an object's rotational axis and the horizontal (orbital) plane.\nModifying the ${props.type}'s axial tilt gives it a tilted look - like the Leaning Tower of Pisa.`,
        show: true
      },
    ];

    return { description, comparedTo, attributes, sentenceCase, };
  }
});
</script>

<style scoped>
</style>
