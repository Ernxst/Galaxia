<template>
  <header ref="header" :data-animate="animate">
    <div class="header-content">
      <slot />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";


export default defineComponent({
  name: "v-header",
  props: {
    animate: { type: Boolean, default: true },
  },
  setup(props) {
    const header = ref<HTMLHeadingElement>(null);
    const { animate } = toRefs(props);

    function transition(timeline: gsap.core.Timeline = gsap, toVisible: boolean) {
      if (!animate.value) return;
      timeline.to(".header-content > *", {
        opacity: 0,
        duration: .167,
        delay: toVisible ? .4 : 0,
        repeat: 5,
      }, 0)
        .set(".header-content > *", {
          opacity: 1,
        });

      timeline.to(header.value, {
        width: toVisible ? "100%" : "0%",
        delay: toVisible ? 0.167 : 0,
      }, toVisible ? 0 : 1);

      timeline.to(".header-content > *", {
        opacity: toVisible ? 1 : 0,
      }, toVisible ? 0 : 1);
    }

    return { header, animate, transition };
  }
});
</script>

<style scoped>
header {
  background: var(--bg);
  overflow-x: hidden;
  transition: .2s ease-in-out background-color;
}

header .header-content {
  padding: 10px 28px;
}

header[data-animate=true] {
  width: 0;
}

header[data-animate=true] .header-content > * {
  opacity: 0;
}
</style>
