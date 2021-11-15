<template>
  <div
    :style="`--diameter: ${2 * radius}px; --ring-scale: ${ringScale}`"
    class="circle-button-container centred"
  >
    <button
      class="circle-button centred"
      @click="onClick"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <span class="circle-button-text centred">{{ text }}</span>
      <slot></slot>
    </button>

    <svg ref="ring" class="ring-container">
      <circle
        :cx="ringRadius"
        :cy="ringRadius"
        :r="ringRadius"
        :transform="`rotate(-90 ${ringRadius} ${ringRadius})`"
        class="ring"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "circle-button",
  props: {
    text: String,
    radius: {
      type: Number,
      default: 24,
    },
    ringScale: {
      type: Number,
      default: 1.2,
    },
  },
  computed: {
    ringRadius() {
      return this.radius * this.ringScale;
    },
  },
  methods: {
    onClick(event) {
      // TODO: Play button click sound here
      this.$emit(event);
    },
    onMouseEnter() {
      // TODO: Play button hover sound here
      this.$refs.ring.classList.add("ring-hover");
    },
    onMouseLeave() {
      // TODO: Stop button hover sound
      this.$refs.ring.classList.remove("ring-hover");
    },
  },
};
</script>

<style>
.circle-button-container {
  --diameter: 172px;
  --ring-scale: 1.2;
  --ring-diameter: calc(var(--diameter) * var(--ring-scale));
  position: relative;
  width: var(--ring-diameter);
  height: var(--ring-diameter);
  padding: 1px;
}

.circle-button,
.circle-button:before,
.circle-button-text {
  border-radius: 50%;
  transition: 0.4s ease-in-out all;
}

.circle-button {
  border: 1px solid var(--text-colour);
  outline: none;
  position: relative;
  width: var(--diameter);
  height: var(--diameter);
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.circle-button-text {
  font-weight: 100;
  z-index: 1;
  color: var(--text-colour);
  margin: auto;
  text-align: center;
}

.circle-button:before,
.circle-button-text,
.ring-container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.circle-button:before {
  content: "";
  width: 0;
  height: 0;
  z-index: 0;
  margin: auto;
  background: var(--text-colour);
}

.circle-button:hover .circle-button-text {
  color: var(--page-bg);
}

.circle-button:hover svg,
.circle-button:hover svg path {
  fill: var(--page-bg);
}

.circle-button:active {
  border-color: var(--main);
}

.circle-button:active + .ring-hover .ring {
  stroke: var(--main);
}

.circle-button:active:before {
  background: var(--main);
}

.circle-button:hover:before {
  width: 100%;
  height: 100%;
}

.ring-container {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.ring {
  fill: transparent;
  stroke: var(--text-colour);
  stroke-width: 1px;
  stroke-dasharray: 720px;
  stroke-dashoffset: 720px;
  transition: 0.75s ease all;
}

.ring-hover .ring {
  stroke-dashoffset: 0;
}
</style>