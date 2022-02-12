<template>
  <page :bg="false"
        :footer="false"
        column
        overflow-y
        top>
    <v-builder :editing="false"
               :simulation="simulation"
               :username="username">
      <template v-slot:footer>
        <app-footer />
      </template>
    </v-builder>
  </page>
</template>

<script lang="ts">
import AppFooter from "@/components/ui/layout/app-footer.vue";
import Page from "@/components/ui/layout/page.vue";
import { Simulation } from "@/views/create/util/types";
import { defaultSimulation, defaultStar } from "@/views/create/util/util";
import VBuilder from "@/views/create/v-builder.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "Build",
  components: { VBuilder, AppFooter, Page },
  props: {
    username: String
  },
  setup() {
    const simulation: Simulation = {
      ...defaultSimulation,
      star: defaultStar,
      planets: [],
      asteroidBelts: [],
    };
    return { simulation };
  }
});
</script>

<style scoped>
</style>
