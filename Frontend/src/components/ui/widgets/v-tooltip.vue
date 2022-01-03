<template>
  <article class="tooltip noselect"
           ref="tooltip">
    <div class="tooltip-inner">
      <div class="tooltip-content">
        <p class="text"
           v-if="text"><span v-for="paragraph in text.split('\n')">{{ paragraph }}</span></p>
        <slot></slot>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import type { Placement, StrictModifiers } from '@popperjs/core';
import { createPopper } from '@popperjs/core/lib/popper-lite';
import { defineComponent, onMounted, PropType, ref, toRefs, watch } from "vue";


export default defineComponent({
  name: "v-tooltip",
  props: {
    side: { type: String as PropType<Placement>, default: "bottom" },
    text: String,
  },
  setup(props) {
    const tooltip = ref<HTMLDivElement>(null);
    let popperInstance;
    const { side } = toRefs(props);
    watch(side, (newVal: Placement) => {
      popperInstance.setOptions((options) => ({
        ...options,
        placement: newVal
      }));
    });

    onMounted(() => {
      const parent = tooltip.value.parentElement;
      popperInstance = createPopper<StrictModifiers>(parent, tooltip.value, {
        placement: props.side,
        // modifiers: [
        //   {
        //     name: 'preventOverflow',
        //     options: {
        //       padding: 8
        //     },
        //   },
        // ],
      });
      ['mouseenter', 'focus'].forEach((event) => (parent.addEventListener(event, show)));
      ['mouseleave', 'blur'].forEach((event) => (parent.addEventListener(event, hide)));
    });

    function show() {
      // Make the tooltip visible
      tooltip.value?.setAttribute('data-show', '');
      // Enable the event listeners
      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: true },
        ],
      }));
      // Update its position
      popperInstance.update();
    }

    function hide() {
      // Hide the tooltip
      tooltip.value?.removeAttribute('data-show');
      // Disable the event listeners
      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: false },
        ],
      }));
    }

    return { tooltip, show, hide };
  }
});
</script>

<style scoped>
.tooltip {
  z-index: 20;
  cursor: default;
  display: none;
  padding: 8px;
}

.tooltip[data-show] {
  display: block;
}

.tooltip-inner {
  background: rgba(255, 255, 255, 0.33);
  backdrop-filter: blur(4px);
  border: 1px solid var(--main);
  padding: 3px;
}

.tooltip-content {
  position: relative;
  padding: 4px;
}

.tooltip-content > p.text {
  margin: 0;
  font-size: 10px;
  display: grid;
  grid-gap: 8px;
  color: var(--text-colour);
}
</style>
