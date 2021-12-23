<template>
  <article v-show="visible || animating"
           :data-animate="animate"
           ref="container">
    <div class="content">
      <v-header :animate="animate"
                ref="header">
        <slot name="header" />
      </v-header>
      <v-content :animate="animate"
                 ref="content">
        <slot name="content" />
      </v-content>
      <slot name="custom" />
    </div>
  </article>
</template>

<script lang="ts">
import { EASE_TYPE } from "@/assets/gsap/gsap.constants";
import VContent from "@/components/ui/widgets/content-container/v-content.vue";
import VHeader from "@/components/ui/widgets/content-container/v-header.vue";
import { gsap } from "gsap";
import { defineComponent, onMounted, ref, toRefs, watch } from "vue";


export const ContentContainerProps = {
  visible: { type: Boolean, default: true },
  animate: { type: Boolean, default: true },
};

export default defineComponent({
  name: "content-container",
  components: { VContent, VHeader },
  emits: ["opened", "closed"],
  props: ContentContainerProps,
  setup(props, { emit }) {
    let timeline = null;
    const animating = ref<boolean>(false);

    const container = ref<HTMLDivElement>(null);
    const header = ref<typeof VHeader>(null);
    const content = ref<typeof VContent>(null);

    const { visible, animate } = toRefs(props);
    watch(visible, (toVisible: boolean) => (transition(toVisible)));
    const reset = () => (timeline = null);

    const transition = (toVisible: boolean) => {
      animating.value = true;
      reset();
      if (!animate) return;
      timeline = gsap.timeline({
        defaults: { ease: EASE_TYPE, duration: .67 },
        onComplete: () => {
          emit(toVisible ? "opened" : "closed");
          reset();
          animating.value = false;
        }
      });

      header.value.transition(timeline, toVisible);
      content.value.transition(timeline, toVisible);
      timeline.to(container.value, {
        height: toVisible ? "auto" : 0,
        delay: toVisible ? 0 : 0.5,
        duration: .33,
      }, toVisible ? 0 : 1);
    };

    onMounted(() => {
      if (visible.value) setTimeout(() => (transition(visible.value)), 500);
    });

    return { container, header, content, animating, transition };
  },
});
</script>

<style scoped>
article {
  --bg: var(--main);
  position: relative;
  transition: .2s ease-in-out filter;
}

article[data-animate=true] {
  height: 0;
  overflow: hidden;
}

article[glow=true] {
  box-shadow: 0 0 48px -20px var(--bg);
}

article[disabled=true] {
  --bg: rgba(255, 255, 255, .33);
  pointer-events: none;
  filter: brightness(0.5);
}

article::before, article::after, .content::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  transition: .2s ease-in-out border-color;
}

article::before {
  top: 16px;
  bottom: 16px;
  left: 0.5px;
  right: 0.5px;
  border: 1px solid var(--bg);
  opacity: 0.5;
  border-top: none;
  border-bottom: none;
  z-index: 2;
}

article::after {
  top: 0;
  bottom: 0;
  border: 2px solid var(--bg);
  border-radius: 1px;
}

.content {
  padding: 7px;
}

.content::before {
  top: 11px;
  bottom: 11px;
  border: 3px solid var(--page-bg);
  border-top: none;
  border-bottom: none;
  z-index: 1;
}
</style>
