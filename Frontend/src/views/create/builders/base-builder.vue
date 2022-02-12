<template>
  <div class="celestial-builder">
    <div class="forms">
      <slot></slot>
    </div>
    <div v-if="buttons"
         class="buttons">
      <flat-button text="Back"
                   @click="$emit('back')" />
      <flat-button bg="var(--green)"
                   text="Next"
                   @click="submit" />
    </div>
    <loading-popup :text="`Saving ${type}`"
                   :visible="saving" />
  </div>
</template>

<script lang="ts">
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import { useStore } from "@/store/store";
import { useSubmit } from "@/views/create/builders/base-builder.composable";
import { CelestialBodyData, CelestialType } from "@/views/create/util/types";
import LoadingPopup from "@/views/sign-in/loading-popup.vue";
import { defineComponent, PropType, ref, toRefs } from "vue";


export default defineComponent({
  name: "base-builder",
  emits: ["back", "next"],
  components: { LoadingPopup, FlatButton },
  props: {
    simulationId: Number,
    data: Object as PropType<CelestialBodyData>,
    editing: Boolean,
    type: String as PropType<CelestialType>,
    buttons: { type: Boolean, default: true }
  },
  setup(props, { emit }) {
    const { data, simulationId, editing, type } = toRefs(props);
    const id = ref<number | null>(editing.value ? data.value.id : null);
    const saving = ref<boolean>(false);
    const store = useStore();

    const submit = () => useSubmit({
      data: data,
      type: type.value,
      simulationID: simulationId.value,
      planetID: data.value.parentId,
      bodyID: id,
      saving: saving,
      store: store,
      emit: emit,
    });

    return { saving, submit };
  }
});
</script>

<style scoped>
.celestial-builder, .forms {
  display: grid;
  grid-gap: 48px;
  position: relative;
}

.forms {
  width: 100%;
}

.buttons {
  display: grid;
  grid-gap: 16px;
}
</style>
