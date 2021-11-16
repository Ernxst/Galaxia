<template>
  <Renderer
    ref="renderer"
    :alpha="true"
    :antialias="false"
    :orbit-ctrl="true"
    :resize="true"
    shadow
  >
    <main-controller
      ref="controller"
      :aspect="aspect"
      :orbit-controls="orbitControls"
      @loaded="onLoad"
    />
  </Renderer>
</template>

<script lang="ts">
// TODO: Use FPS controls instead of OrbitControls - swap between FPS & OrbitControls dynamically
import { TONE_MAPPING_EXPOSURE } from "@/assets/three/three.constants";

import MainController from "@/components/three/engine/MainController.vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PCFSoftShadowMap, ReinhardToneMapping, sRGBEncoding, } from "three/src/constants";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { Renderer } from "troisjs";
import { computed, defineComponent, getCurrentInstance, onMounted, ref, } from "vue";
import { setComposerSize, setupPostprocessing, } from "./postprocessing/postprocessing";


export default defineComponent({
  name: "RendererController",
  components: { Renderer, MainController },
  setup() {
    const width = ref<number>(1);
    const height = ref<number>(1);
    const aspect = computed(() => {
      return width.value / height.value;
    });

    const renderer = ref<typeof Renderer>(null);
    const orbitControls = ref<OrbitControls>(null);
    const controller = ref<typeof MainController>(null);

    function onLoad() {
      renderer.value.renderFn = setupPostprocessing(
        renderer.value.renderer,
        renderer.value.scene,
        renderer.value.camera
      );
      let i = 0;
      renderer.value.onBeforeRender(() => {
        controller.value.render();

        if (i < 3) {
          const glRenderer: WebGLRenderer = renderer.value.renderer;
          console.log("Scene polycount:", glRenderer.info.render.triangles);
          console.log("Active Drawcalls:", glRenderer.info.render.calls);
          console.log("Textures in Memory", glRenderer.info.memory.textures);
          console.log(
            "Geometries in Memory",
            glRenderer.info.memory.geometries
          );
          i++;
        }
      });
    }

    onMounted(() => {
      const dom: HTMLElement = renderer.value.renderer.domElement;
      window.addEventListener("resize", (_) => {
        width.value = dom.clientWidth;
        height.value = dom.clientHeight;
        controller.value.resize(width.value, height.value);
        renderer.value.renderer.setSize(width.value, height.value);
        setComposerSize(width.value, height.value);
      });
      orbitControls.value = renderer.value.three.cameraCtrl;
      orbitControls.value.listenToKeyEvents(window);

      const parentElement: HTMLElement =
        getCurrentInstance().proxy.$el.parentNode;
      width.value = parentElement.clientWidth;
      height.value = parentElement.clientHeight;

      const glRenderer: WebGLRenderer = renderer.value.renderer;
      glRenderer.capabilities.logarithmicDepthBuffer = true;
      glRenderer.shadowMap.enabled = true;
      glRenderer.shadowMap.type = PCFSoftShadowMap;
      glRenderer.outputEncoding = sRGBEncoding;
      glRenderer.physicallyCorrectLights = true;
      glRenderer.toneMappingExposure = TONE_MAPPING_EXPOSURE;
      glRenderer.toneMapping = ReinhardToneMapping;
    });

    return {
      aspect,
      renderer,
      controller,
      orbitControls,
      onLoad,
    };
  },
});
</script>

<style></style>
