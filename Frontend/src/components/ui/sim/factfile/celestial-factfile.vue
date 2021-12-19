<template>
  <teleport to="body">
    <div :class="`factfile-container pseudo-after ${closing ? 'out': ''}`">
      <article class="celestial-factfile glass centred">
        <section class="factfile centred">
          <header class="header">
            <h2>{{ body.name }}</h2>
            <p>{{ body.caption }}</p>
          </header>
          <factfile-stats v-bind="body" />
          <section class="content">
            <p v-for="paragraph in body.description.split(`\n`)">{{ paragraph }}</p>
          </section>
        </section>
        <span class="close-icon material-icons centred"
              @click="closeFactfile">close</span>
      </article>
    </div>
  </teleport>
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
  --factfile-width: 100vw;
  --margin: 0;
  position: fixed;
  z-index: 3;
  left: var(--margin);
  animation-duration: 1s;
  animation-name: slideDown;
  animation-fill-mode: forwards;
  height: 100vh;
  flex-direction: column;
}

.factfile-container.out {
  animation-name: slideUp;
}

.factfile-container::after {
  left: calc(var(--margin) * -1);
  right: unset;
  z-index: 3;
  background: black;
  opacity: .33;
  width: var(--margin);
  display: none;
}

.celestial-factfile {
  position: relative;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
  border-radius: 0;
  width: var(--factfile-width);
  z-index: 4;
}

.factfile {
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}

.factfile > * {
  padding: 18px 36px;
}

.factfile * {
  text-shadow: 0 0 8px var(--page-bg);
}

.close-icon {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 5;
}

header {
  margin-bottom: 10px;
  width: 100%;
}

header h2 {
  letter-spacing: 11px;
  font-size: 30px;
  position: relative;
}

header p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.content {
  margin: 0 18px 18px;
  padding: 18px;
}

.content p {
  font-size: 10px;
  margin: 0 0 16px;
  line-height: 1.6;
  white-space: pre-line;
  text-align: justify;
  text-indent: 48px;
}

@media (min-height: 480px) and (orientation: landscape) {
  @media (min-width: 480px) {
    .factfile-container {
      --factfile-width: 75vw;
      --margin: 32px;
    }

    .factfile-container::after {
      display: block;
    }

    .factfile {
      overflow-y: hidden;
    }

    .content {
      overflow-y: auto;
      max-height: 100vh;
    }

    .close-icon {
      right: -16px;
      position: absolute;
    }
  }

  @media (min-width: 640px) {
    .factfile-container {
      --factfile-width: 66.7vw;
      --margin: 64px;
    }

    .factfile * {
      text-shadow: none;
    }
  }

  @media (min-width: 768px) {
    .factfile-container {
      --factfile-width: 50vw;
      --margin: 96px;
    }
  }

  @media (min-width: 1024px) {
    .factfile-container {
      --factfile-width: 35vw;
      --margin: 128px;
    }
  }
}
</style>
