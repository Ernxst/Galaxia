<template>
  <form>
    <text-input id="sim-name"
                :maxlength="48"
                :model-value="simulation.name"
                :required="true"
                label="Simulation Name"
                name="name"
                placeholder="The Solar System"
                @update:model-value="$emit('update:simulation', {...simulation, name: $event})" />
    <text-input id="sim-description"
                :maxlength="4096"
                :model-value="simulation.description"
                :multiline="true"
                label="Description"
                name="description"
                placeholder="This is my simulation and I hope you like it!"
                @update:model-value="$emit('update:simulation', {...simulation, description: $event})" />
    <flat-button bg="var(--green)"
                 text="Next"
                 @click="submit" />
  </form>
</template>

<script lang="ts">
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import TextInput from "@/components/ui/widgets/text-input.vue";
import { useStore } from "@/store/store";
import { defaultStar } from "@/views/create/util/util";
import { SimulationData } from "@/views/create/util/types";
import { defineComponent, PropType, toRefs } from "vue";


export default defineComponent({
  name: "data-builder",
  components: { FlatButton, TextInput },
  emits: ["update:simulation", "update:simulationId", "next"],
  props: {
    simulation: Object as PropType<SimulationData>,
    simulationId: Number,
  },
  setup(props, { emit }) {
    const store = useStore();
    store.commit("simulation/setPreviewing", false);
    store.commit("simulation/setModelToPreview", { model: defaultStar, type: "star" });
    const { simulation, simulationId } = toRefs(props);

    function validate() {
      const response = store.getters["simulation/validSimulation"];
      if (response !== true) {
        alert(response);
        return false;
      }
      return true;
    }

    async function submit() {
      if (!validate()) return;

      try {
        const { name, description } = simulation.value;
        const payload = {
          simulation: { name, description }
        };

        if (!simulationId.value) {
          const id = await store.dispatch("starSystem/createSimulation", payload.simulation);
          emit("update:simulationId", id);
        } else {
          payload.simulationID = simulationId.value;
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
