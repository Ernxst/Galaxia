<template>
  <div :class="`factfile-container ${closing ? 'out': ''}`">
    <article class="celestial-factfile glass centred">
      <span class="close-icon material-icons centred" @click="closeFactfile">close</span>
      <header class="header">
        <h2>{{ body.name }}</h2>
        <p>{{ body.caption }}</p>
      </header>
      <factfile-stats v-bind="body"/>
      <section class="content">
        <p>{{ body.description }}</p>
      </section>
    </article>
  </div>
</template>

<script lang="ts">
import { Moon } from "@/@types/celestial/moon";
import { Planet } from "@/@types/celestial/planet";
import { RingedPlanet } from "@/@types/celestial/ringed-planet";
import { Star } from "@/@types/celestial/star";
import FactfileStats from "@/components/ui/sim/factfile/factfile-stats.vue";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "celestial-factfile",
  components: { FactfileStats },
  emits: ["close"],
  props: {
    body: Object as PropType<Star | Planet | RingedPlanet | Moon>
  },
  data() {
    return {
      closing: false,
    };
  },
  methods: {
    closeFactfile() {
      this.closing = true;
      setTimeout(() => {
        this.$emit("close");
      }, 1000);
    }
  },
});
</script>

<style scoped>
.factfile-container {
  position: fixed;
  z-index: 3;
  left: 128px;
  animation-duration: 1s;
  animation-name: slideDown;
  animation-fill-mode: forwards;
  height: 100vh;
}

.factfile-container.out {
  animation-name: slideUp;
}

.factfile-container::after {
  position: absolute;
  left: -128px;
  top: 0;
  bottom: 0;
  z-index: 3;
  background: black;
  opacity: .33;
  content: "";
  width: calc(128px + 33vw);
}

.celestial-factfile {
  position: relative;
  flex-direction: column;
  padding: 18px 36px;
  height: 100%;
  justify-content: flex-start;
  border-radius: 0;
  width: 33vw;
  z-index: 4;
}

.close-icon {
  position: absolute;
  top: 16px;
  right: -16px;
}

header {
  margin-bottom: 10px;
  width: 100%;
}

header h2 {
  letter-spacing: 11px;
  font-size: 2vw;
  position: relative;
}

header p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.content {
  margin-top: 10px;
  max-height: 100vh;
  overflow-y: auto;
}

.content p {
  font-size: 10px;
  margin: 0;
  line-height: 1.6;
  white-space: pre-line;
  text-align: justify;
  text-indent: 48px;
}
</style>
