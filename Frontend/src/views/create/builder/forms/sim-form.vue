<template>
  <form>
    <div class="container">
      <text-input id="sim-name"
                  v-model="modelValue.name"
                  :maxlength="48"
                  :required="true"
                  label="Simulation Name"
                  name="name"
                  placeholder="The Solar System" />
      <v-tooltip text="Give your simulation a name!" />
    </div>
    <text-input id="sim-description"
                v-model="modelValue.description"
                :maxlength="4096"
                :multiline="true"
                label="Description"
                name="description" />
    <flat-button bg="var(--green)"
                 text="Next"
                 @click="submit" />
  </form>
</template>

<script lang="ts">
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import TextInput from "@/components/ui/widgets/text-input.vue";
import VTooltip from "@/components/ui/widgets/v-tooltip.vue";
import { useStore } from "@/store/store";
import { SimulationData } from "@/views/create/util/types";
import { defineComponent, PropType, ref, toRefs } from "vue";


export default defineComponent({
  name: "sim-form",
  components: { VTooltip, FlatButton, TextInput },
  emits: ["update:modelValue", "next", "saved"],
  props: {
    modelValue: Object as PropType<SimulationData>,
  },
  setup(props, { emit }) {
    const store = useStore();
    const { modelValue } = toRefs(props);
    const submitted = ref<boolean>(false);
    const simulationID = ref<number>(0);

    function validate() {
      const response = store.getters["builder/validSimulation"];
      if (response !== true) {
        alert(response);
        return false;
      }
      return true;
    }

    async function submit() {
      if (!validate()) return;

      try {
        if (!submitted.value) {
          simulationID.value = await store.dispatch("starSystem/createSimulation", modelValue.value);
          submitted.value = true;
          emit("saved", simulationID.value);
        } else {
          const payload = {
            simulationID: simulationID.value,
            simulation: modelValue.value
          };
          await store.dispatch("starSystem/updateSimulation", payload);
        }
        emit("next");
      } catch (e) {
        alert(e);
      }
    }

    return { submit };
  }
});
</script>

<style scoped>
form {
  display: grid;
  grid-gap: 16px;
  width: 100%;
}
</style>
