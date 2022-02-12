<template>
  <aside :data-minimised="minimised"
         class="sidebar centred">
    <builder-navbar :step="step" />
    <div class="sidebar-outer">
      <div class="sidebar-inner">
        <div class="sidebar-content">
          <builder-sidebar-header :step="step"
                                  :subtitle="subtitle"
                                  :title="title" />
          <builder-stages :simulation="simulation"
                          :step="step"
                          :username="username"
                          @back="$emit('back')"
                          @next="$emit('next')"
                          @to="$emit('to')" />
        </div>
      </div>
    </div>
    <span class="toggler close-icon material-icons centred"
          @click="minimised = !minimised">navigate_next</span>
  </aside>
</template>

<script lang="ts">
import BuilderStages from "@/views/create/builders/builder-stages.vue";
import BuilderNavbar from "@/views/create/sidebar/builder-navbar.vue";
import BuilderSidebarHeader from "@/views/create/sidebar/builder-sidebar-header.vue";
import { Simulation } from "@/views/create/util/types";
import { defineComponent, PropType, ref, toRefs, watch } from "vue";


export default defineComponent({
  name: "builder-sidebar",
  components: { BuilderStages, BuilderSidebarHeader, BuilderNavbar, },
  emits: ["back", "next", "to"],
  props: {
    step: Number,
    title: String,
    subtitle: String,
    username: String,
    simulation: Object as PropType<Simulation>,
  },
  setup(props) {
    const minimised = ref<boolean>(false);
    const { step } = toRefs(props);
    watch(step, () => (minimised.value = false));
    return { minimised };
  }
});
</script>

<style scoped>
.sidebar {
  position: relative;
  justify-content: flex-start;
}

.sidebar-outer {
  position: relative;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
}

.sidebar-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #130F40;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-margin-bottom: 16px;
}

.toggler {
  display: flex;
  position: absolute;
  bottom: -12px;
  right: 16px;
  font-size: 16px;
  transition: .3s ease-in-out all;
  z-index: 25;
  transform: rotate(270deg);
  background: var(--accent);
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    flex-direction: column;
  }

  .sidebar-outer {
    --height: 300px;
    height: var(--height);
    width: 100%;
    will-change: height;
    transition-property: height;
    overflow-y: hidden;
    border-bottom: 1px solid var(--main);
  }

  .sidebar[data-minimised=true] .sidebar-outer {
    height: 0;
  }

  .sidebar[data-minimised=true] .toggler {
    transform: rotate(90deg);
  }

  .sidebar-inner {
    min-height: var(--height);
    overflow-y: hidden;
  }
}

@media (max-height: 640px) {
  .sidebar-outer {
    --height: 200px;
  }
}

@media (min-width: 768px) {
  .sidebar {
    height: 100%;
  }

  .sidebar-outer {
    --width: 300px;
    width: var(--width);
    height: 100%;
    will-change: width;
    transition-property: width;
    overflow-x: hidden;
    border-right: 1px solid var(--main);
  }

  .sidebar[data-minimised=true] .sidebar-outer {
    width: 0;
  }

  .sidebar-inner {
    min-width: var(--width);
    overflow-x: hidden;
  }

  .toggler {
    top: 16px;
    right: -12px;
    bottom: unset;
    transform: rotate(180deg);
  }


  .sidebar[data-minimised=true] .toggler {
    transform: rotate(0);
  }
}
</style>
