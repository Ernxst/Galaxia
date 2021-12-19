<template>
  <teleport to="body">
    <header ref="banner"
            class="intro abs centred">
      <div class="tagline centred">
        <span class="line" />
        <p class="content">Simulating</p>
      </div>
      <div class="header-container">
        <span class="line thick" />
        <h1 class="simulation-name">{{ simulationName }}</h1>
      </div>
      <div class="tagline centred">
        <span class="line" />
        <p class="content">By <strong>{{ username }}</strong></p>
      </div>
    </header>
  </teleport>
</template>

<script lang="ts">
import { gsap } from "gsap";
import { defineComponent } from "vue";


export default defineComponent({
  name: "sim-intro",
  emits: ["introStarted"],
  props: {
    username: { type: String, required: true },
    simulationName: { type: String, required: true },
  },
  methods: {
    setup() {
      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out", duration: 1.25 },
      });
      // Animate simulation name in
      timeline.to(".intro .simulation-name", { opacity: 1, delay: 0.9 }, 0);
      timeline.to(".intro .line.thick", { left: 0, right: 0, delay: .67 }, 0);

      // Animate taglines and banner in simultaneously
      timeline.to(".intro .content", { opacity: 1 }, 1);
      timeline.to(".intro .line:not(.thick)", { left: 0, right: 0 }, 1);

      // Pause for 1.2s
      // Animate banner and taglines out simultaneously
      timeline.to(".intro .content", { opacity: 0, delay: 1.2 }, 2);
      timeline.to(".intro .line:not(.thick)", { left: "50%", right: "50%", delay: 1.2 }, 2);

      // Pause for 0.5s
      // Animate simulation name out
      timeline.to(".intro .simulation-name", { opacity: 0, duration: 0.67, delay: 1 }, 3);
      timeline.to(".intro .line.thick", { left: "50%", right: "50%", delay: 1 }, 3);
      return timeline;
    },
    async start() {
      const timeline = this.setup();
      this.$emit("introStarted", timeline.totalDuration());
      await timeline.play();
      document.body.removeChild(this.$refs.banner);
    }
  },
});
</script>

<style scoped>
header {
  bottom: 33%;
  height: fit-content;
  margin-top: auto;
  margin-bottom: auto;
  flex-direction: column;
  z-index: 11;
}

.header-container, .tagline {
  position: relative;
  width: 100%;
}

.header-container {
  margin-top: 8px;
  margin-bottom: 8px;
}

h1, .content {
  text-align: center;
  width: 100%;
  margin: 0;
  padding: 12px;
  z-index: 13;
  position: relative;
  opacity: 0;
}

.content {
  width: fit-content;
  padding: 2px 8px;
  backdrop-filter: blur(4px);
}

.line {
  position: absolute;
  top: 50%;
  bottom: 0;
  height: 1px;
  background: var(--main);
  z-index: 11;
  left: 50%;
  right: 50%;
}

.line.thick {
  height: 100%;
  top: 0;
}
</style>
