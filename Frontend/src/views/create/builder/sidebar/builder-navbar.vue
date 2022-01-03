<template>
  <nav class="navbar centred">
    <div class="header"></div>
    <ul class="nav-buttons centred">
      <li v-for="(option, index) in options"
          :key="option.name"
          :data-active="step === index">
        <navbar-item :active="step === index"
                     :icon="option.icon"
                     @click="$emit('click', index)" />
        <v-tooltip :side="side"
                   :text="option.tooltip" />
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import VTooltip from "@/components/ui/widgets/v-tooltip.vue";
import NavbarItem from "@/views/create/builder/sidebar/navbar-item.vue";
import { computed, defineComponent, ref } from "vue";


export default defineComponent({
  name: "builder-navbar",
  emits: ["click"],
  components: { NavbarItem, VTooltip },
  props: {
    step: Number
  },
  setup() {
    const options = [{ name: "text", icon: "text_fields", tooltip: "Modify text attributes", },
      { name: "star", icon: "wb_sunny", tooltip: "Create your star", },
      { name: "planets", icon: "public", tooltip: "Add planets to the simulation", },
      { name: "moons", icon: "dark_mode", tooltip: "Add moons to the simulation", },
      { name: "asteroids", icon: "satellite_alt", tooltip: "Add asteroid belts to the simulation.", },
      { name: "summary", icon: "rocket_launch", tooltip: "Review your simulation", },
    ];

    const width = ref<number>(window.innerWidth);
    const side = computed(() => (width.value < 768 ? "bottom" : "right"));
    window.addEventListener("resize", () => (width.value = document.body.clientWidth));
    return { options, side };
  }
});
</script>

<style scoped>
.navbar {
  width: 100%;
  height: fit-content;
  background: var(--main);
  padding: 8px 20px 8px 24px;
  box-shadow: 0 0 10px 4px rgba(0, 0, 0, .55);
  z-index: 6;
}

ul {
  justify-content: space-between;
}

li[data-active=true] {
  pointer-events: none;
}

@media (min-width: 768px) {
  .navbar {
    height: 100%;
    width: 64px;
    padding-top: 24px;
    padding-bottom: 20px;
    align-items: flex-start;
    box-shadow: none;
  }

  ul {
    flex-direction: column;
  }
}
</style>
