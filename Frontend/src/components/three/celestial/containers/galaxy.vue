<template>
  <!-- TODO: Remove AmbientLight once lighting is set up -->
  <AmbientLight :intensity="0.25" />
  <Group ref="galaxy">
    <!-- <Starfield ref="starfield" /> -->
    <StarSystem ref="starSystem" :name="currentSystem" />
  </Group>
</template>

<script lang="ts">
  import { AmbientLight, Group } from "troisjs";
  import { defineComponent } from "vue";
  import StarSystem from "./star-system.vue";
  import Starfield from "./Starfield.vue";
  export default defineComponent({
    name: "Galaxy",
    emits: ["sceneLoaded"],
    components: { AmbientLight, Group, StarSystem, Starfield },
    props: { name: String },
    computed: {
      currentSystem() {
        return "Solar System";
      },
    },
    methods: {
      evolve(speed: number) {
        // this.$refs.starfield.animate(0.00005 * speed);
        this.$refs.starSystem.evolve(speed);
      },
    },
    mounted() {
      this.$emit("sceneLoaded");
    },
  });
</script>

<style scoped></style>
