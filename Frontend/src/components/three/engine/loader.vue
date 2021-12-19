<template>
  <section ref="container"
           class="loader abs centred">
    <span class="percentage">{{ `${currentPercentage}%` }}</span>
    <div class="content centred">
      <label for="assets">{{ message }}</label>
      <progress id="assets"
                :max="100"
                :value="percentage"></progress>
    </div>
    <!-- TODO: Add fact of the day message -->
  </section>
</template>

<script lang="ts">
// TODO: Wormhole loading screen
import { defineComponent } from "vue";


export default defineComponent({
  name: "loader",
  props: { assetsToLoad: Number },
  emits: ["assetsLoaded", "ready"],
  watch: {
    loaded() {
      this.message = "Ready";
      this.assetsLoaded = this.assetsToLoad;
      this.$refs.container.classList.add("complete");
      setTimeout(() => {
        this.$emit("assetsLoaded");
        this.$emit("ready");
      }, 1300);
    },
  },
  computed: {
    percentage(): number {
      return Math.round((this.assetsLoaded * 100) / this.assetsToLoad);
    },
    currentPercentage(): number {
      return Math.min(100, this.percentage);
    },
    loaded(): boolean {
      return this.assetsLoaded === this.assetsToLoad;
    },
  },
  data() {
    return {
      assetsLoaded: 0,
      message: "Building Galaxy",
    };
  },
  mounted() {
    window.addEventListener("assetLoaded", (event) => {
      this.assetsLoaded += 1;
    });
  },
});
</script>

<style scoped>
.loader {
  --width: 32vw;
  transition: 1.33s ease transform;
  transition-delay: 0.8s;
  z-index: 9;
  background: var(--page-bg);
}

.loader.complete {
  transform: translateY(-100vh);
}

.percentage {
  position: absolute;
  margin: auto;
  font-size: var(--width);
  color: var(--text-colour);
  opacity: 0.125;
  text-align: center;
  z-index: 0;
  transition: 0.75s ease color;
  font-weight: 700;
  -webkit-text-stroke: 1px var(--main);
}

.loader.complete .percentage {
  color: var(--green);
  -webkit-text-stroke: 1px var(--green);
}

.content {
  z-index: 1;
  width: var(--width);
  flex-direction: column;
}

label {
  color: var(--text-colour);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-align: center;
}

progress {
  --bg: var(--main);
  width: 100%;
}

progress[value] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
}

progress[value]::-webkit-progress-bar {
  background-color: transparent;
  padding: 2px;
  border: 1px solid var(--bg);
}

progress[value]::-webkit-progress-value {
  background-color: var(--bg);
  transition: width 0.1s ease;
}
</style>
