<template>
  <button ref="label"
          class="info centred noselect">Click to
    <div class="diamond-container">
      <div class="diamond" />
    </div>
    continue
  </button>
</template>

<script lang="ts">
import { gsap } from "gsap";
import { defineComponent } from "vue";


export default defineComponent({
  name: "welcome-cursor",
  data() {
    return {
      x: 0,
      y: 0,
      animating: false,
    };
  },
  methods: {
    update(event: MouseEvent, box: DOMRect) {
      if (this.animating) return;
      const label: HTMLLinkElement = this.$refs.label;
      const width = label.clientWidth;
      const height = label.clientHeight;
      const halfWidth = width / 2;

      const x = Math.round(event.clientX - halfWidth);
      const y = Math.round(event.clientY - height / 2);
      if ((x < box.left || (x + width) > box.right) || (y < box.top || (y + height) > box.bottom))
        return this.moveLabel(label, Math.round(window.innerWidth / 2 - halfWidth), Math.round(box.top * 1.33), 1);
      return this.moveLabel(label, x, y - 24, 0.05);
    },
    moveLabel(label: HTMLLinkElement, finalX: number, finalY: number, duration: number) {
      const data = { x: this.x, y: this.y };
      return gsap.to(data, {
        duration,
        ease: "power2.out",
        x: finalX,
        y: finalY,
        onStart: () => {
          this.animating = true;
        },
        onUpdate: () => {
          this.x = data.x;
          this.y = data.y;
          label.style.left = `${this.x}px`;
          label.style.top = `${this.y}px`;
        },
        onComplete: () => {
          this.animating = false;
        }
      });
    },
  }
});
</script>

<style scoped>
.info {
  font-size: 11px;
  color: var(--main);
  text-align: center;
  z-index: 7;
  letter-spacing: 3px;
  text-shadow: 0 0 8px var(--page-bg);
}

.info, .info:focus {
  outline: none;
  border: none;
  background: none;
}

.diamond-container {
  display: inline-block;
  width: 22px;
  height: 22px;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, .33);
  transform: rotate(45deg);
  margin-left: 8px;
  margin-right: 10px;
}

.diamond {
  background: var(--main);
  width: 100%;
  height: 100%;
}

@media (min-width: 480px) {
  .info {
    position: absolute;
    top: 33%;
  }
}

@media (pointer: fine) {
  .info {
    position: fixed;
    white-space: nowrap;
    cursor: pointer;
  }
}
</style>
