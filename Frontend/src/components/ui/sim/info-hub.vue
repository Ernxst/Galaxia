<template>
  <section class="info-hub">
    <section class="body-overview glass centred">
      <span class="close-icon material-icons centred" @click="reset" v-if="bodySelected">close</span>
      <span class="subtitle">{{ bodySelected ? type : "Galaxia" }}</span>
      <h3 class="name">{{ bodySelected ? activeBody.name : "Select a Celestial Body" }}</h3>
      <p class="short-description">{{
          bodySelected ? activeBody.shortDescription :
            "Use the navbar to select a celestial body to follow through space."
        }}</p>
    </section>
  </section>
</template>

<script lang="ts">
import { Moon } from "@/@types/celestial/moon";
import { Planet } from "@/@types/celestial/planet";
import { RingedPlanet } from "@/@types/celestial/ringed-planet";
import { Star } from "@/@types/celestial/star";
import { defineComponent } from "vue";


export default defineComponent({
  name: "info-hub",
  emits: ["reset", "openFactfile", "closeFactfile"],
  props: {},
  data() {
    return {
      type: "" as "Star" | "Planet" | "Moon",
      activeBody: null as Star | Planet | RingedPlanet | Moon | null
    }
  },
  computed: {
    bodySelected(): boolean {
      return this.activeBody !== null;
    },
  },
  methods: {
    setActiveBody(body: Star | Planet | RingedPlanet | Moon, type: string) {
      this.activeBody = body;
      this.type = type;
    },
    resetBody() {
      this.activeBody = null;
      this.type = "";
    },
    reset() {
      this.resetBody();
      this.$emit("reset");
    },
  },
});
</script>

<style scoped>

.body-overview {
  flex-direction: column;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 36px;
  padding: 24px;
  margin: auto;
  width: 33vw;
  z-index: 2;
}

.close-icon {
  position: absolute;
  top: 16px;
  right: -16px;
  padding: 6px;
  cursor: pointer;
  background: var(--main);
  border-radius: 50%;
  transition: 0.25s ease-in-out all;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.33);
}

.close-icon:hover {
  color: var(--page-bg);
  background: var(--main);
}

.subtitle {
  font-size: 10px;
  margin: 0 0 6px;
  font-weight: 100;
  color: var(--main);
}

.name {
  margin: 0;
  font-weight: 100;
  letter-spacing: 16px;
  font-size: 36px;
  text-align: center;
}

.short-description {
  text-align: center;
  font-size: 11px;
  font-weight: 100;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
}
</style>
