<template>
  <section class="welcome-page-bg"
           :transitioning="clicked">
    <RendererController :scene-component="sceneComponent"
                        ref="renderer" />
  </section>
  <page :bg="false"
        :footer="true"
        column
        fill
        header="Galaxia"
        overflow-y
        pad
        @mousemove="onMouseMove">
    <section ref="container"
             class="welcome-page-content centred"
             @click="onClick">
      <welcome-cursor ref="cursor" />
      <p class="app-description glass"><strong>A fully-customisable journey</strong> through space and time in three
        dimensions.</p>
    </section>
  </page>
</template>

<script lang="ts">
import { animateZoom } from "@/assets/gsap";
import RendererController from "@/components/three/engine/RendererController.vue";
import Page from "@/components/ui/layout/page.vue";
import WelcomeCursor from "@/views/welcome/welcome-cursor.vue";
import WelcomeScene from "@/views/welcome/welcome-scene.vue";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { defineComponent } from "vue";


export default defineComponent({
  name: "Welcome",
  components: { RendererController, WelcomeCursor, Page },
  computed: {
    sceneComponent() {
      return WelcomeScene;
    },
    firstVisit(): boolean {
      return window.history.state.back === null;
    }
  },
  data() {
    return {
      clicked: false,
      animating: false,
    };
  },
  methods: {
    onMouseMove(event: MouseEvent) {
      const container: HTMLDivElement = this.$refs.container;
      this.$refs.cursor.update(event, container.getBoundingClientRect());
    },
    async onClick() {
      if (this.clicked || this.animating) return;
      this.clicked = true;
      const mainController = this.$refs.renderer.$refs.controller;
      const camController = mainController.$refs.camera;
      setTimeout(() => {
        this.transitionOut(camController.getCamera(), 3);
      }, 600);
    },
    async transitionOut(camera: PerspectiveCamera, duration: number) {
      setTimeout(() => {
        const loggedIn = false;
        if (loggedIn)
          this.$router.push({ name: "home", params: { username: "Ernest" } });
        else
          this.$router.push({ name: "login" });
      }, duration * 620);
      await animateZoom(5, camera, duration);
      this.clicked = false;
    }
  },
  mounted() {
    const mainController = this.$refs.renderer.$refs.controller;
    const camController = mainController.$refs.camera;
    const camera: PerspectiveCamera = camController.getCamera();
    camera.zoom = 75;
    const delay = this.firstVisit ? 1300 : 0;
    setTimeout(async () => {
      this.animating = true;
      await animateZoom(1, camera, 1.5);
      this.animating = false;
    }, delay);
  }
});
</script>

<style>
#app > .welcome-page-bg + header,
#app > .welcome-page-bg ~ .page,
#app > .welcome-page-bg ~ footer {
  transition: .55s ease opacity;
}

#app > .welcome-page-bg[transitioning=true] + header,
#app > .welcome-page-bg[transitioning=true] ~ .page,
#app > .welcome-page-bg[transitioning=true] ~ footer {
  opacity: 0;
}

#app > .welcome-page-bg, #app > .welcome-page-bg::after {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

#app > .welcome-page-bg::after {
  opacity: 0;
  transition: 2s ease opacity;
  transition-delay: 1s;
  background: var(--page-bg);
  content: "";
  z-index: 0;
}

#app > .welcome-page-bg[transitioning=true]::after {
  opacity: 1;
}

#app > .page > .welcome-page-content {
  width: 100%;
  height: 100%;
  position: relative;
  align-items: flex-start;
  cursor: pointer;
}

#app > .page > .welcome-page-content > .app-description {
  border-radius: 0;
  padding: 8px 16px;
  position: absolute;
  bottom: calc(var(--page-padding) * -1);
  left: calc(var(--page-padding) * -1);
  width: 100vw;
  overflow-x: hidden;
  text-align: center;
  text-shadow: 0 0 8px var(--page-bg);
}

#app > .page > .welcome-page-content > .app-description.glass strong {
  color: var(--main);
}

@media (min-width: 480px) {
  #app > .page > .welcome-page-content > .app-description.glass {
    padding-left: var(--page-padding);
    max-width: 33vw;
    text-align: left;
    background: none;
    border: none;
    backdrop-filter: none;
  }
}

@media (max-height: 320px) and (min-width: 480px) and (orientation: landscape) {
  #app > .page > .welcome-page-content > .app-description.glass {
    max-width: 67vw;
  }
}
</style>
