<template>
  <article v-show="visible || animating"
           ref="container">
    <div class="content">
      <header ref="header">
        <div class="header-content" v-show="hasHeaderSlot">
          <slot name="header"></slot>
        </div>
      </header>
      <section ref="content">
        <div class="section-content" v-show="hasContentSlot">
          <slot name="content"></slot>
        </div>
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
  computed: {
    hasHeaderSlot() {
      return !!this.$slots.header;
    },
    hasContentSlot() {
      return !!this.$slots.content;
    }
  },
  watch: {
    visible(newVal: boolean) {
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out", duration: .67 },
        onStart: () => (this.animating = true),
        onComplete: () => (this.animating = false)
      });
      if (this.hasHeaderSlot) {
        timeline.to(".header-content > *", {
          opacity: 0,
          duration: .167,
          delay: newVal ? .4 : 0,
          repeat: 5,
        }, 0)
          .set(".header-content > *", {
            opacity: 1,
          });

        timeline.to(this.$refs.header, {
          width: newVal ? "100%" : "0%",
          delay: newVal ? 0.167 : 0,
        }, newVal ? 0 : 1);

        timeline.to(".header-content > *", {
          opacity: newVal ? 1 : 0,
        }, newVal ? 0 : 1);
      }

      if (this.hasContentSlot) {
        timeline.to(this.$refs.content, {
          height: newVal ? "auto" : 0,
          delay: newVal ? 0.33 : 0,
        }, newVal ? 0 : 1);

        timeline.to(".section-content > * ", {
          opacity: newVal ? 1 : 0,
        }, newVal ? 0 : 1);
      }

      timeline.to(this.$refs.container, {
        height: newVal ? "auto" : 0,
        delay: newVal ? 0 : 0.5,
        duration: .33,
      }, newVal ? 0 : 1);
    }
  },
});
</script>

<style scoped>
article {
  --bg: var(--main);
  position: relative;
  transition: .2s ease-in-out filter;
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

header, section::after {
  transition: .2s ease-in-out background-color;
}

header {
  background: var(--bg);
  overflow-x: hidden;
}

header .header-content {
  padding: 10px 28px;
}

section {
  position: relative;
  overflow-y: hidden;
}

section .section-content {
  padding: 21px;
}

section::after {
  top: 0;
  bottom: 0;
  background: var(--bg);
  opacity: 0.2;
  z-index: -1;
}
</style>
