<template>
  <celestial-form-container :description="description"
                            header="Geometry Attributes">
    <slider :id="`${name}-radius`"
            v-model="modelValue.radius"
            :max="10"
            :min="0.3"
            :show-limits="true"
            :step="0.01"
            label="Radius"
            name="radius" />
  </celestial-form-container>
</template>

<script lang="ts">
import Slider from "@/components/ui/widgets/slider.vue";
import CelestialFormContainer from "@/views/create/builder/forms/form-container.vue";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "spherical-form",
  emits: ["update:modelValue"],
  components: { CelestialFormContainer, Slider },
  props: {
    name: String,
    modelValue: Object,
    type: String as PropType<"star" | "moon" | "planet">
  },
  setup(props) {
    const description = `These attributes determine the size and shape of the ${props.type}.`;
    return { description, };
  }
});
</script>

<style scoped>
</style>
