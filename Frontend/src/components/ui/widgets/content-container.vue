<template>
  <article v-show="visible || animating"
           ref="container">
    <div class="content">
      <header>
        <slot name="header" />
      </header>
      <section>
        <slot></slot>
      </section>
    </div>
  </article>
</template>

<script lang="ts">
import { gsap } from "gsap";
import { defineComponent } from "vue";


export default defineComponent({
  name: "content-container",
  props: {
    visible: { type: Boolean, default: true },
  },
  data() {
    return {
      animating: false,
    };
  },
  watch: {
    visible(newVal: boolean) {
      gsap.to(this.$refs.container, {
        ease: "power2.out",
        duration: .33,
        opacity: newVal ? 1 : 0,
        onStart: () => (this.animating = true),
        onComplete: () => (this.animating = false)
      });
    }
  },
});
</script>

<style scoped>
article {
  --bg: var(--main);
  padding: 7px;
  position: relative;
  transition: .2s ease-in-out filter;
}

article[glow=true] {
  box-shadow: 0 0 32px -16px var(--bg);
}

article[disabled=true] {
  --bg: rgba(255, 255, 255, .33);
  pointer-events: none;
  filter: brightness(0.5);
}

article::before, article::after, .content::before, section::after {
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

.content::before {
  top: 11px;
  bottom: 11px;
  border: 3px solid var(--page-bg);
  border-top: none;
  border-bottom: none;
  z-index: 1;
}

header, section::after {
  transition: .2s ease-in-out background-color;
}

header {
  background: var(--bg);
  padding: 10px 28px;
}

section {
  padding: 21px;
  position: relative;
}

section::after {
  top: 0;
  bottom: 0;
  background: var(--bg);
  opacity: 0.1;
  z-index: -1;
}
</style>
