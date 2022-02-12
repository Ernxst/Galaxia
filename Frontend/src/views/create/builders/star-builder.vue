<template>
  <base-builder :data="data"
                :editing="editing"
                :simulation-id="simulationId"
                type="star"
                @back="$emit('back')"
                @next="$emit('next')">
    <text-form v-model="data"
               type="star" />
    <celestial-form v-model="data"
                    type="star" />
    <spherical-form v-model="data"
                    type="star" />
    <textured-form v-model="data"
                   type="star" />
  </base-builder>
</template>

<script lang="ts">
import { useStore } from "@/store/store";
import BaseBuilder from "@/views/create/builders/base-builder.vue";
import { StarData } from "@/views/create/util/types";
import CelestialForm from "@/views/create/forms/celestial-form.vue";
import SphericalForm from "@/views/create/forms/spherical-form.vue";
import TextForm from "@/views/create/forms/text-form.vue";
import TexturedForm from "@/views/create/forms/textured-form.vue";
import { defineComponent, PropType, ref, toRefs, watch } from "vue";


export default defineComponent({
  name: "star-builder",
  components: { TexturedForm, SphericalForm, CelestialForm, TextForm, BaseBuilder },
  emits: ["update:star", "back", "next"],
  props: {
    star: Object as PropType<StarData>,
    editing: Boolean,
    simulationId: { type: Number, required: true, }
  },
  setup(props, { emit }) {
    const { star } = toRefs(props);
    const data = ref<StarData>(star.value);
    const store = useStore();
    store.commit("simulation/setPreviewing", true);
    store.commit("simulation/setModelToPreview", { model: star.value, type: "star" });
    watch(data, (newVal: StarData) => {
      store.commit("simulation/setModelToPreview", { model: newVal, type: "star" });
      emit("update:star", newVal);
    }, { deep: true });

    return { data };
  }
});
</script>

<style scoped>

</style>
