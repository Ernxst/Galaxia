<template>
  <section ref="content"
           class="pseudo-after"
           :data-animate="animate">
    <div class="section-content">
      <slot />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";


export default defineComponent({
  name: "v-content",
  props: {
    animate: { type: Boolean, default: true },
  },
  setup(props) {
    const content = ref<HTMLDivElement>(null);
    const { animate } = toRefs(props);

    function transition(timeline: gsap.core.Timeline = gsap, toVisible: boolean) {
      if (!animate.value) return;
      timeline.to(content.value, {
        height: toVisible ? "auto" : 0,
        delay: toVisible ? 0.33 : 0,
      }, toVisible ? 0 : 1);

      timeline.to(".section-content > * ", {
        opacity: toVisible ? 1 : 0,
      }, toVisible ? 0 : 1);
    }

    return { content, animate, transition };
  }
});
</script>

<style scoped>
section {
  position: relative;
  overflow-y: hidden;
}

section::after {
  background: var(--bg);
  opacity: 0.2;
  z-index: -1;
  transition: .2s ease-in-out background-color;
}

.section-content {
  padding: 21px;
}

section[data-animate=true] {
  height: 0;
}

section[data-animate=true] .section-content > * {
  opacity: 0;
}
</style>
