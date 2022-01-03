<template>
  <page :bg="false"
        :footer="false"
        column
        overflow-y
        top>
    <sim-builder @submit="submit">
      <app-footer />
    </sim-builder>
  </page>
</template>

<script lang="ts">
import { StarSystem } from "@/@types/celestial/containers/star-system";
import AppFooter from "@/components/ui/layout/app-footer.vue";
import Page from "@/components/ui/layout/page.vue";
import SimBuilder from "@/views/create/builder/simulation-builder-menu.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "Build",
  components: { AppFooter, SimBuilder, Page },
  props: {
    username: String
  },
  setup() {
    function submit(simulation: StarSystem) {
    }

    return { submit };
  }
});
</script>

<style scoped>
</style>
