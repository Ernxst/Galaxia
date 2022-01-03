<template>
  <article class="centred">
    <builder-loader />
    <builder-sidebar :step="step"
                     @step="step = $event"
                     v-if="ready">
      <sidebar-header :text="currentStep.instruction"
                      :title="currentStep.title" />
      <sidebar-forms :max="steps.length - 1"
                     :step="step"
                     @back="step -= 1"
                     @next="step += 1"
                     @to="step = $event"
                     @submit="$emit('submit', $event)" />
    </builder-sidebar>
    <section class="content centred">
      <div class="preview-container centred"></div>
      <div class="info-container centred">
        <div :data-end="step === steps.length - 1"
             class="decorated">
              <span class="centred">Step <strong>{{ step + 1 }}</strong> of <strong>{{
                  steps.length
                }}</strong><br><strong>{{ currentStep.name }}</strong></span>
        </div>
      </div>
      <slot></slot>
    </section>
  </article>
</template>

<script lang="ts">
import BuilderLoader from "@/views/create/builder/builder-loader.vue";
import BuilderSidebar from "@/views/create/builder/sidebar/builder-sidebar.vue";
import SidebarForms from "@/views/create/builder/sidebar/sidebar-forms.vue";
import SidebarHeader from "@/views/create/builder/sidebar/sidebar-header.vue";
import { computed, defineComponent, ref } from "vue";


export default defineComponent({
  name: "simulation-builder-menu",
  components: { BuilderLoader, SidebarForms, SidebarHeader, BuilderSidebar },
  emits: ["submit"],
  setup() {
    const step = ref<number>(0);
    const steps = [{
      name: "Simulation", title: "Build Simulation",
      instruction: "To start building your simulation, please fill out the basic details below. Click 'next' when you're done to verify the entered information and move onto the next step.",
    },
      {
        name: "Star", title: "Create your Star",
        instruction: "The next step is to create the star which all celestial objects will orbit. Click 'next' when you're done to verify the entered information and move onto the next step."
      },
      {
        name: "Planets", title: "Create Planets",
        instruction: "Continue by adding the planets that will orbit your star. For each planet, click 'save' (or 'update') to verify it and add it to the simulation."
      },
      {
        name: "Moons", title: "Create Moons",
        instruction: "Add moons to orbit your planets here. For each moon, click 'save' (or 'update') to verify it and add it to the simulation."
      },
      {
        name: "Asteroids", title: "Create Asteroid Belts",
        instruction: "Finish off your simulation with some asteroid belts.  For each asteroid belt, click 'save' (or 'update') to verify it and add it to the simulation."
      },
      {
        name: "Liftoff", title: "Prepare for Takeoff!",
        instruction: "Complete pre-flight checks and click 'Liftoff' to being your new interactive journey."
      },];
    const currentStep = computed(() => (steps[step.value]));

    const ready = ref<boolean>(false);
    setTimeout(() => (ready.value = true), 167);
    return { step, steps, currentStep, ready };
  }
});
</script>

<style scoped>
article {
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

.decorated {
  height: fit-content;
  position: sticky;
  bottom: 0;
  backdrop-filter: blur(4px);
}

.decorated span {
  font-size: 10px;
}

.decorated > span {
  flex-direction: column;
}

strong {
  color: var(--main);
}

.decorated[data-end=true] > span:before, .decorated[data-end=true] > span:after {
  border-color: var(--green);
}

.decorated[data-end=true] strong {
  color: var(--green);
}

@media (min-width: 768px) {
  article {
    flex-direction: row;
  }

  .content {
    height: 100%;
  }
}
</style>
