<template>
  <page header="Explore"
        column
        fill
        top
        overflow-y
        pad>
    <p>To start your celestial journey, please choose an option below.</p>
    <section class="buttons">
      <explore-button @click="go('select-preset')"
                      img="https://i.natgeofe.com/n/7b222564-6288-4377-8278-671a71385a7e/solar-system-interactive-animation-promo_3x2.jpg"
                      title="Preset Simulation"
                      description="Select a pre-made simulation to dive into celestial exploration mode immediately."
                      caption="Start your journey" />
      <explore-button @click="go('Build')"
                      img="https://www.seti.org/sites/default/files/styles/original/public/2018-08/protodisk_NASA_JPL-Caltech_T.Pyle_.jpg?itok=xaXME_pS"
                      title="Custom Simulation"
                      description="Build your simulation the way you want it - either from a template or from scratch."
                      caption="Build your journey" />
    </section>
  </page>
</template>

<script lang="ts">
import Page from "@/components/ui/layout/page.vue";
import ExploreButton from "@/views/explore/explore-button.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "Explore",
  components: { ExploreButton, Page },
  props: {
    username: { type: String }
  },
  methods: {
    go(page: string) {
      this.$router.push({ name: page, params: { username: this.username } });
    }
  }
});
</script>

<style scoped>
p {
  margin-bottom: 24px;
  text-align: center;
}

.buttons {
  display: grid;
  grid-auto-flow: row;
  row-gap: 16px;
}

@media (min-width: 768px) {
  p {
    margin-bottom: 48px;
  }

  .buttons {
    grid-auto-flow: column;
    column-gap: 64px;
    width: 75%;
  }
}

@media (min-width: 920px) {
  .buttons {
    column-gap: 128px;
  }
}
</style>
