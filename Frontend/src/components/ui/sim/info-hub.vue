<template>
  <section class="info-hub">
    <celestial-factfile v-if="factfileOpen" :body="activeBody" @close="closeFactfile"/>
    <section :class="hubClass" v-else>
      <span class="close-icon material-icons centred" @click="reset" v-if="bodySelected">close</span>
      <span class="subtitle">{{ bodySelected ? type : "Galaxia" }}</span>
      <h3 class="name">{{ bodySelected ? activeBody.name : "Select a Celestial Body" }}</h3>
      <p class="short-description">{{
          bodySelected ? activeBody.shortDescription :
            "Use the navbar to select a celestial body to follow through space."
        }}</p>
      <flat-button v-if="bodySelected" text="Learn More" @click="openFactfile"/>
    </section>
  </section>
</template>

<script lang="ts">
import { Moon } from "@/@types/celestial/moon";
import { Planet } from "@/@types/celestial/planet";
import { RingedPlanet } from "@/@types/celestial/ringed-planet";
import { Star } from "@/@types/celestial/star";
import CelestialFactfile from "@/components/ui/sim/factfile/celestial-factfile.vue";
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "info-hub",
  components: { FlatButton, CelestialFactfile },
  emits: ["reset", "openFactfile", "closeFactfile"],
  data() {
    return {
      type: "" as "Star" | "Planet" | "Moon",
      activeBody: null as Star | Planet | RingedPlanet | Moon | null,
      factfileOpen: false,
    };
  },
  computed: {
    hubClass(): string {
      const base = "body-overview glass centred "
      return base + ((this.bodySelected && !this.factfileOpen) ? "in" : "");
    },
    bodySelected(): boolean {
      return this.activeBody !== null;
    },
  },
  methods: {
    // TODO: offset camera while factfile open
    openFactfile() {
      this.factfileOpen = true;
      this.$emit("openFactfile");
    },
    closeFactfile() {
      this.factfileOpen = false;
      this.$emit("closeFactfile");
    },
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
  width: 40vw;
  z-index: 2;
}

.body-overview.in {
  animation-duration: .67s;
  animation-name: fadeIn;
  animation-fill-mode: forwards;
}

.close-icon {
  position: absolute;
  top: 16px;
  right: -16px;
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