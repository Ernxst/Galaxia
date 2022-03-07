<template>
  <div class="group-container noselect">
    <group-button :data-open="active"
                  :name="body.name"
                  :texture="body.texture"
                  :type="type"
                  @click="$emit('click')" />
    <template v-if="active || animating">
      <div ref="menu"
           class="builder-menu centred">
        <flat-button bg="var(--red)"
                     text="Remove"
                     @click="$emit('removeBody')" />
        <slot></slot>
        <celestial-builder v-model:data="body"
                           :editing="!!body.id"
                           :simulation-id="simulationId"
                           :type="type" />
        <flat-button :data-disabled="saved"
                     :text="`${ !submitted ? 'Save' : 'Update'}`"
                     bg="var(--green)"
                     @click="submit" />
      </div>
    </template>
    <loading-popup :text="`${ !submitted ? 'Saving' : 'Updating'} ${type}`"
                   :visible="saving" />
  </div>
</template>

<script lang="ts">
import { EASE_TYPE } from "@/assets/gsap/gsap.constants";
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import { useStore } from "@/store/store";
import { useSubmit } from "@/views/create/builders/base-builder.composable";
import CelestialBuilder from "@/views/create/builders/celestial-builder.vue";
import GroupButton from "@/views/create/builders/group-builder/group-button.vue";
import { CelestialBodyData, CelestialType } from "@/views/create/util/types";
import LoadingPopup from "@/views/sign-in/loading-popup.vue";
import { nextTick } from "@vue/runtime-core";
import gsap from "gsap";
import { computed, defineComponent, PropType, ref, toRefs, watch } from "vue";


export default defineComponent({
  name: "celestial-group-item",
  components: { LoadingPopup, GroupButton, FlatButton, CelestialBuilder },
  emits: ["click", "removeBody", "update:body", "update:id", "update:saved"],
  props: {
    active: Boolean,
    type: { type: String as PropType<CelestialType>, required: true },
    simulationId: { type: Number, required: true },
    body: { type: Object as PropType<CelestialBodyData>, required: true },
    id: { type: Number, required: true },
    saved: Boolean,
  },
  setup(props, { emit }) {
    const { active, body, id, simulationId } = toRefs(props);
    const menu = ref<HTMLDivElement | null>(null);
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
    const submitted = computed(() => id.value && id.value >= 0);
    const needsUpdate = ref<boolean>(false);
    const saving = ref<boolean>(false);
    const saved = computed(() => (submitted.value && !needsUpdate.value));

    watch(saved, (newVal: boolean) => emit("update:saved", newVal), { deep: true });
    watch(body, (newVal: CelestialBodyData) => {
      needsUpdate.value = true;
      store.commit("simulation/setModelToPreview", { model: newVal, type: props.type });
    }, { deep: true });

    const submit = () => useSubmit({
      data: body,
      type: props.type,
      simulationID: simulationId.value,
      bodyID: id,
      saving: saving,
      store: store,
      emit: emit,
      isGroup: true,
      onAfterCreate: (id: number) => emit("update:id", id),
      onAfterSave: () => needsUpdate.value = false
    });

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
