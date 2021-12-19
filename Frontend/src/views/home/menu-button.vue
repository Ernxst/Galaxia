<template>
  <a v-bind="$attrs"
     :activating="mouseDown"
     :ready="ready"
     class="menu-button pseudo-before pseudo-after centred noselect"
     @mousedown="mouseDown = true"
     @mouseup="mouseDown = false">
    <div class="img-container pseudo-after abs">
      <img :alt="text"
           :src="image">
    </div>
    <span class="info centred"><span class="material-icons">chevron_right</span>{{ infoText }}</span>
    <section class="content centred">
      <span class="subtitle">{{ subtitle }}</span>
      <h2>{{ text }}</h2>
      <p>{{ description }}</p>
    </section>
  </a>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "menu-button",
  emits: ["click"],
  props: {
    text: { type: String, required: true, },
    subtitle: { type: String, required: true, },
    description: { type: String, required: true, },
    image: { type: String, required: true, },
  },
  data() {
    return {
      mouseDown: false,
      ready: false,
      idTimeout: null as typeof setTimeout,
    };
  },
  watch: {
    // click and hold for 1.2s before emitting click;
    mouseDown() {
      if (this.mouseDown) {
        if (this.isTouchDevice) this.$emit("click");
        else
          // TODO: Play sound
          this.idTimeout = setTimeout(() => {
            if (this.mouseDown) {
              // TODO: Play sound when complete
              this.ready = true;
              setTimeout(() => {
                this.$emit("click");
              }, 125);
            }
          }, 1150);
      } else {
        // TODO: Stop sound
        clearTimeout(this.idTimeout);
        this.ready = false;
      }
    }
  },
  computed: {
    isTouchDevice(): boolean {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
    },
    infoText(): string {
      if (this.isTouchDevice) return `Click to continue to ${this.text}`;
      if (this.ready) return "Release to continue to " + this.text;
      return this.mouseDown ? "Keep Holding" : "Click and hold to activate";
    }
  }
});
</script>

<style scoped>
.menu-button {
  --content-colour: var(--text-colour);
  --transition-duration: .2s;
  --padding-x: 16px;
  --padding-y: 16px;
  border: 1px solid var(--content-colour);
  border-radius: var(--button-radius);
  position: relative;
  padding: var(--padding-y) var(--padding-x);
  align-items: flex-end;
  transition: var(--transition-duration) ease border;
  cursor: pointer;
}

.menu-button[disabled=true] {
  pointer-events: none;
  filter: brightness(0.33);
}

.menu-button:hover {
  --content-colour: var(--main);
}

.menu-button[activating=true] {
  border-color: var(--accent);
}

.menu-button[ready=true] {
  border-color: var(--green);
}

.menu-button:before, .menu-button:after {
  top: unset;
  background: var(--accent);
  opacity: 0.67;
  transition: 1.25s ease height, .25s ease background-color;
  height: 0;
  z-index: 3;
}

.menu-button:before {
  opacity: 0.521;
  height: 100%;
  z-index: 2;
  background: var(--page-bg);
}

.menu-button[activating=true]:after {
  height: 100%;
}

.menu-button[ready=true]:after {
  background: var(--green);
}

img, .img-container::after {
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.img-container::after {
  box-shadow: inset 0 0 24px 16px var(--page-bg);
  z-index: 1;
}

.info {
  opacity: 0;
  position: absolute;
  top: var(--padding-y);
  left: var(--padding-x);
  right: var(--padding-x);
  font-size: 9px;
  text-align: left;
  transition: var(--transition-duration) ease opacity;
  color: var(--main);
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 4;
}

.info .material-icons {
  font-size: 12px;
  margin-right: 4px;
}

.menu-button:hover .info {
  opacity: 1;
}

.content {
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  color: var(--content-colour);
  z-index: 4;
}

.content > * {
  text-align: left;
  transition: var(--transition-duration) ease border, var(--transition-duration) ease color;
  text-shadow: 0 0 8px var(--page-bg);
}

.content span {
  letter-spacing: 4px;
  font-size: 9px;
  border-left: 4px solid var(--content-colour);
  padding-left: 8px;
  margin-left: 3px;
}

h2 {
  margin-top: 4px;
}

p {
  font-size: 12px;
  margin: 0 0 0 3px;
}

@media (min-width: 920px) {
  h2 {
    font-size: 2.3vw;
    margin-bottom: 8px;
  }
}
</style>
