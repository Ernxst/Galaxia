<template>
  <form-container :description="`Give your ${type} an identity, starting off with basic attributes.`"
                  header="Base Attributes">
    <text-input v-for="attr in textAttributes"
                :set="text = sentenceCase(attr.name)"
                :id="`sim-${attr.name}`"
                v-model="modelValue[attr.name]"
                :label="text"
                :maxlength="attr.maxLength"
                :multiline="attr.rows > 1"
                :name="attr.name"
                :placeholder="`Enter ${text.toLowerCase()} here`"
                :required="attr.name === 'name'"
                :rows="attr.rows" />
  </form-container>

</template>

<script lang="ts">
import TextInput from "@/components/ui/widgets/text-input.vue";
import FormContainer from "@/views/create/builder/forms/form-container.vue";
import { startCase } from "lodash-es";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "text-form",
  emits: ["update:modelValue"],
  components: { TextInput, FormContainer },
  props: {
    modelValue: Object,
    type: String as PropType<"star" | "moon" | "planet" | "asteroid belt">
  },
  setup() {
    const textAttributes = [{ name: "name", maxLength: 32, rows: 1, },
      { name: "caption", maxLength: 128, rows: 1, },
      { name: "shortDescription", maxLength: 512, rows: 5 },
      { name: "description", maxLength: 1024, rows: 12 },
    ];

    function sentenceCase(text: string) {
      return startCase(text);
    }

    return { textAttributes, sentenceCase };
  }
});
</script>

<style scoped>

</style>
