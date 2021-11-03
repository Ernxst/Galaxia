<template>
  <TroisRenderer
    ref="renderer"
    :orbit-ctrl="true"
    :alpha="true"
    :antialias="true"
    :resize="true"
    shadow
  >
    <scene-controller
      ref="controller"
      :orbit-controls="orbitControls"
      :aspect="aspect"
      @loaded="onLoad"
    />
  </TroisRenderer>
</template>

<script lang="ts">
  // TODO: Use FPS controls instead of OrbitControls
  import { TONE_MAPPING_EXPOSURE } from "@/assets/three/three.constants";
  import SceneController from "@/components/three/scene/SceneController.vue";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import {
    PCFSoftShadowMap,
    ReinhardToneMapping,
    sRGBEncoding,
  } from "three/src/constants";
  import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
  import { Renderer as TroisRenderer } from "troisjs";
  import { computed, defineComponent, onMounted, ref } from "vue";

  export default defineComponent({
    name: "Renderer",
    components: { TroisRenderer, SceneController },
    setup() {
      const width = ref<number>(1);
      const height = ref<number>(1);
      const aspect = computed(() => {
        return width.value / height.value;
      });

      function onResize(e) {
        width.value = e.size.width;
        height.value = e.size.height;
      }

      const renderer = ref<typeof TroisRenderer>(null);
      const orbitControls = ref<OrbitControls>(null);
      const controller = ref<typeof SceneController>(null);

      function onLoad() {
        // TODO: Use when implementing postprocessing
        // renderer.value.renderFn = () => {
        //   controller.value.render();
        // };
        let i = 0;
        renderer.value.onBeforeRender(() => {
          controller.value.render();
          if (i < 2) {
            const glRenderer: WebGLRenderer = renderer.value.renderer;
            console.log(glRenderer.info);
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
        renderer.value.onResize = onResize;
        orbitControls.value = renderer.value.three.cameraCtrl;
        orbitControls.value.listenToKeyEvents(window);

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
