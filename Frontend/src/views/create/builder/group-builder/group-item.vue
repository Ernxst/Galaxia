<template>
  <div :data-open="active"
       class="group-container noselect">
    <group-button @click="$emit('click')"
                  :data-open="active"
                  :name="modelValue.name"
                  :type="type"
                  :texture-id="modelValue.textureId" />
    <template v-if="active || animating">
      <div ref="menu"
           class="builder-menu centred">
        <flat-button bg="var(--red)"
                     text="Remove"
                     @click="$emit('remove')" />
        <slot></slot>
        <celestial-builder v-model="modelValue"
                           :parent="true"
                           :type="type" />
        <flat-button bg="var(--green)"
                     :text="`${ !submitted ? 'Save' : 'Update'}`"
                     @click="submit"
                     :data-disabled="saved" />
      </div>
    </template>
    <loading-popup :visible="saving"
                   :text="`${ !submitted ? 'Saving' : 'Updating'} ${type}`" />
  </div>
</template>

<script lang="ts">
import { EASE_TYPE } from "@/assets/gsap/gsap.constants";
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import { useStore } from "@/store/store";
import CelestialBuilder from "@/views/create/builder/celestial-builder.vue";
import GroupButton from "@/views/create/builder/group-builder/group-button.vue";
import { validateCelestialBody } from "@/views/create/util/simulation-validator";
import { AsteroidBeltData, MoonData, PlanetData } from "@/views/create/util/types";
import { scaleParams } from "@/views/create/util/util";
import LoadingPopup from "@/views/sign-in/loading-popup.vue";
import { nextTick } from "@vue/runtime-core";
import gsap from "gsap";
import { startCase } from "lodash-es";
import { computed, defineComponent, PropType, ref, toRefs, watch } from "vue";


export default defineComponent({
  name: "group-item",
  components: { LoadingPopup, GroupButton, FlatButton, CelestialBuilder },
  emits: ["click", "remove", "update:modelValue", "needsSave", "saved"],
  props: {
    simulationID: Number,
    active: Boolean,
    modelValue: Object as PropType<PlanetData | MoonData | AsteroidBeltData>,
    type: String as PropType<"planet" | "moon" | "asteroid belt">
  },
  setup(props, { emit }) {
    const menu = ref<HTMLDivElement>(null);
    const { active, modelValue, simulationID } = toRefs(props);
    const animating = ref<boolean>(false);
    watch(active, (newVal) => (animate(newVal)));

    function animate(toVisible: boolean) {
      animating.value = true;
      nextTick(() => {
        gsap.to(menu.value, {
          ease: EASE_TYPE,
          height: toVisible ? 'auto' : 0,
          paddingTop: toVisible ? 16 : 0,
          paddingBottom: toVisible ? 16 : 0,
          duration: 0.75,
          onComplete: () => (animating.value = false),
        });
      });
    }

    const store = useStore();
    const submitted = ref<boolean>(false);
    const id = ref<number>(0);
    const needsUpdate = ref<boolean>(false);
    watch(modelValue, () => needsUpdate.value = submitted.value, { deep: true });
    const saving = ref<boolean>(false);

    const saved = computed(() => (submitted.value && !needsUpdate.value));
    watch(saved, () => emit("needsSave", saved.value));

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
          emit("saved", id.value);
        } else {
          payload.id = id.value;
          await store.dispatch(`builder/update${action}`, payload);
        }

        saving.value = false;
        needsUpdate.value = false;
      } catch (e) {
        saving.value = false;
        alert(e);
      }
    }

    return { menu, animating, submitted, saved, saving, submit };
  }
});
</script>

<style scoped>
.builder-menu {
  border-top: 1px solid var(--main);
  border-bottom: 1px solid var(--main);
  background: var(--page-bg);
  padding: 16px;
  overflow-y: hidden;
  flex-direction: column;
  margin: 0 -16px 16px;
  height: 0;
}

.builder-menu .button-container:first-child {
  margin-bottom: 16px;
  width: 100%;
}

.builder-menu .button-container:last-child {
  margin-top: 16px;
  width: 100%;
}
</style>
