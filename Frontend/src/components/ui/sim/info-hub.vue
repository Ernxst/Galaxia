<template>
  <section class="info-hub">
    <celestial-factfile v-if="factfileOpen" :body="activeBody" @close="closeFactfile"/>
    <section v-else :class="hubClass">
      <span v-if="bodySelected" class="close-icon material-icons centred" @click="reset">close</span>
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
      const base = "body-overview glass centred ";
      return base + ((this.bodySelected && !this.factfileOpen) ? "in" : "");
    },
    bodySelected(): boolean {
      return this.activeBody !== null;
    },
  },
  methods: {
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
  animation-duration: .5s;
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
  font-size: 2.5vw;
  text-align: center;
}

.short-description {
  text-align: center;
  font-size: 11px;
  font-weight: 100;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
}

@media (max-width: 480px) {
  .info-hub {
    position: relative;
    width: 100%;
  }

  .body-overview {
    width: 100%;
    border-radius: 0;
    position: relative;
    bottom: unset;
    background: none;
    border: none;
    backdrop-filter: none;
    background-clip: unset;
    margin: unset;
  }

  .name {
    font-size: 28px;
  }

  .close-icon {
    right: 16px;
    border-radius: 0;
  }
}

@media (max-height: 480px) and (min-width: 480px) and (orientation: landscape) {
  .body-overview {
    bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
    padding: 6px 6px 10px;
    width: 33vw;
  }

  .subtitle {
    margin-top: 4px;
  }

  .name {
    margin-bottom: 8px;
    font-size: 17px;
    letter-spacing: 2px;
  }

  .short-description {
    display: none;
  }

  .close-icon {
    padding: 2px;
  }
}
</style>
