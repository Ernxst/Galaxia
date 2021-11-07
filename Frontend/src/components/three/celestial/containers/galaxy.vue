<template>
  <Group ref="galaxy">
    <!-- <Starfield ref="starfield" /> -->
    <StarSystem
      ref="starSystem"
      :name="starSystem"
      @star-system-loaded="$emit('sceneLoaded')"
    />
  </Group>
</template>

<script lang="ts">
  import { Group } from "troisjs";
  import { defineComponent } from "vue";
  import StarSystem from "./star-system.vue";
  import Starfield from "./Starfield.vue";
  export default defineComponent({
    name: "Galaxy",
    emits: ["sceneLoaded"],
    components: { Group, StarSystem, Starfield },
    props: { name: String, starSystem: String },
    methods: {
      evolve(speed: number) {
        // this.$refs.starfield.animate(0.00005 * speed);
        this.$refs.starSystem.evolve(speed);
      },
    },
  });
</script>

<style scoped></style>
