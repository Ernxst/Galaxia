<template>
  <div :style="`--diameter: ${2 * radius}px; --ring-scale: ${ringScale}`"
       class="circle-button-container centred">
    <button
      :disabled="disabled"
      :type="type"
      class="circle-button pseudo-before centred"
      @click="onClick"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave">
      <span class="circle-button-text abs centred">{{ text }}</span>
      <slot></slot>
    </button>
    <svg ref="ring"
         :data-mouse="mouseEntered"
         class="ring-container abs">
      <circle :cx="ringRadius"
              :cy="ringRadius"
              :r="ringRadius"
              :transform="`rotate(-90 ${ringRadius} ${ringRadius})`"
              class="ring" />
    </svg>
  </div>
</template>

<script lang="ts">
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import useButton from "@/components/ui/widgets/buttons/use-button";
import { computed, defineComponent, toRefs } from "vue";


export default defineComponent({
  name: "circle-button",
  extends: FlatButton,
  props: {
    radius: { type: Number, default: 24, },
    ringScale: { type: Number, default: 1.2, },
  },
  setup(props, { emit }) {
    const { radius, ringScale } = toRefs(props);
    const ringRadius = computed(() => radius.value * ringScale.value);
    return { ...useButton(emit), ringRadius };
  },
});
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
  font-weight: 300;
  z-index: 1;
  color: var(--text-colour);
  margin: auto;
  text-align: center;
}

.circle-button:before {
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

.ring-container[data-mouse=true] .ring {
  stroke-dashoffset: 0;
}

.circle-button-container[disabled=true] .circle-button {
  pointer-events: none;
  background: rgba(255, 255, 255, 0.75);
}
</style>
