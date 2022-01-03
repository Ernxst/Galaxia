<template>
  <div class="celestial-builder">
    <div class="forms">
      <text-form v-model="modelValue"
                 :type="type" />
      <celestial-form v-model="modelValue"
                      :name="modelValue.name"
                      :type="type" />
      <spherical-form v-if="spherical"
                      v-model="modelValue"
                      :name="modelValue.name"
                      :type="type" />
      <orbitable-form v-if="orbitable"
                      v-model="modelValue"
                      :name="modelValue.name"
                      :type="type" />
      <textured-form v-if="textured"
                     v-model="modelValue"
                     :name="modelValue.name"
                     :type="type" />
      <asteroid-form v-if="type === 'asteroid belt'"
                     v-model="modelValue"
                     :name="modelValue.name" />
    </div>
    <div v-if="!parent"
         class="buttons">
      <flat-button text="Back"
                   @click="$emit('back')" />
      <flat-button bg="var(--green)"
                   text="Next"
                   @click="submit" />
    </div>
    <loading-popup :visible="saving"
                   :text="`Saving ${type}`" />
  </div>
</template>

<script lang="ts">
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import { useStore } from "@/store/store";
import AsteroidForm from "@/views/create/builder/forms/asteroid-form.vue";
import CelestialForm from "@/views/create/builder/forms/celestial-form.vue";
import OrbitableForm from "@/views/create/builder/forms/orbitable-form.vue";
import SphericalForm from "@/views/create/builder/forms/spherical-form.vue";
import TextForm from "@/views/create/builder/forms/text-form.vue";
import TexturedForm from "@/views/create/builder/forms/textured-form.vue";
import { validateCelestialBody } from "@/views/create/util/simulation-validator";
import { scaleParams } from "@/views/create/util/util";
import LoadingPopup from "@/views/sign-in/loading-popup.vue";
import { startCase } from "lodash-es";
import { computed, defineComponent, PropType, ref, toRefs } from "vue";


export default defineComponent({
  name: "celestial-builder",
  emits: ["update:modelValue", "back", "next"],
  components: {
    LoadingPopup,
    AsteroidForm,
    TexturedForm,
    OrbitableForm,
    SphericalForm,
    CelestialForm,
    TextForm,
    FlatButton
  },
  props: {
    simulationID: Number,
    modelValue: Object,
    type: String as PropType<"star" | "moon" | "planet" | "asteroid belt">,
    parent: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const store = useStore();
    const submitted = ref<boolean>(false);
    const id = ref<number>(null);
    const { modelValue, simulationID } = toRefs(props);
    const saving = ref<boolean>(false);

    function validate() {
      const response = store.getters["builder/validSimulation"];
      if (response !== true) {
        alert(response);
        return false;
      }
      const message = validateCelestialBody(modelValue.value, props.type);
      if (message !== true) {
        alert(message);
        return false;
      }
      return true;
    }

    async function submit() {
      if (!validate()) return;

      try {
        saving.value = true;
        let data = { ...modelValue.value };
        data = scaleParams(data, props.type);
        const payload = { simulationID: simulationID.value, data: data };
        const action = startCase(props.type).replace(" ", "");

        if (!submitted.value) {
          id.value = await store.dispatch(`builder/create${action}`, payload);
          submitted.value = true;
        } else {
          payload.id = id.value;
          await store.dispatch(`builder/update${action}`, payload);
        }

        saving.value = false;
        emit("next");
      } catch (e) {
        saving.value = false;
        alert(e);
      }
    }

    const spherical = computed(() => (props.type !== "asteroid belt"));
    const orbitable = computed(() => (props.type !== "asteroid belt" && props.type !== "star"));
    const textured = computed(() => (props.type !== "asteroid belt"));
    return { submit, spherical, orbitable, textured, saving };
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
