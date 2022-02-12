<template>
  <article class="builder centred">
    <builder-loader />
    <builder-sidebar v-if="ready"
                     :editing="editing"
                     :simulation="simulation"
                     :step="step"
                     :subtitle="currentStep.instruction"
                     :title="currentStep.title"
                     :username="username"
                     @back="step--"
                     @next="step++"
                     @to="step = $event" />
    <section class="content centred">
      <div class="preview-container centred">
        <v-preview :data="model3D"
                   :previewing="previewing" />
      </div>
      <div class="info-container centred">
        <step-indicator :num-of-steps="steps.length"
                        :step="step"
                        :title="currentStep.name" />
      </div>
      <slot name="footer"></slot>
    </section>
  </article>
</template>

<script lang="ts">
import { useStore } from "@/store/store";
import BuilderLoader from "@/views/create/builder-loader.vue";
import { steps } from "@/views/create/builder-steps";
import VPreview from "@/views/create/preview/v-preview.vue";
import BuilderSidebar from "@/views/create/sidebar/builder-sidebar.vue";
import StepIndicator from "@/views/create/step-indicator.vue";
import { Simulation } from "@/views/create/util/types";
import { computed, defineComponent, PropType, ref } from "vue";


export default defineComponent({
  name: "v-builder",
  components: { BuilderLoader, StepIndicator, VPreview, BuilderSidebar },
  props: {
    username: String,
    simulation: Object as PropType<Simulation>,
    editing: Boolean,
  },
  setup() {
    const step = ref<number>(0);
    const currentStep = computed(() => (steps[step.value]));

    const store = useStore();
    store.dispatch("simulation/reset");
    const model3D = computed(() => store.getters["simulation/modelToPreview"]);
    const previewing = computed(() => store.getters["simulation/previewing"]);

    const ready = ref<boolean>(false);
    setTimeout(() => ready.value = true, 167);

    return { step, steps, currentStep, model3D, previewing, ready };
  }
});
</script>

<style scoped>
.builder {
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}

.preview-container, .content, .info-container {
  width: 100%;
  height: 100%;
}

.content {
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
}

.preview-container {
  align-items: flex-start;
  overflow: hidden;
  position: relative;
}

.info-container {
  flex-direction: column;
  height: min-content;
  padding-bottom: 8px;
}

@media (min-width: 768px) {
  .builder {
    flex-direction: row;
  }

  .content {
    height: 100%;
  }
}
</style>
