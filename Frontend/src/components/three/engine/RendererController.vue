<template>
  <article id="renderer"
           class="centred">
    <Renderer ref="renderer"
              :alpha="true"
              :antialias="false"
              :orbit-ctrl="true"
              :resize="true"
              shadow>
      <main-controller
        ref="controller"
        :orbit-controls="orbitControls"
        :scene-component="sceneComponent"
        :scene-props="sceneProps"
        :show-tour="showTour"
        :teleport="teleport"
        :track-gestures="trackGestures"
        :ui="ui"
        @loaded="onLoad"
        @ready="$emit('ready')" />
    </Renderer>
  </article>
</template>

<script lang="ts">
// TODO: Use FPS controls instead of OrbitControls - swap between FPS & OrbitControls dynamically
import { TONE_MAPPING_EXPOSURE } from "@/assets/three/three.constants";
import MainController from "@/components/three/engine/MainController.vue";
import { rendererNeedsResize } from "@/components/three/engine/util";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { PCFSoftShadowMap, ReinhardToneMapping, sRGBEncoding, } from "three/src/constants";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { Renderer } from "troisjs";
import { defineComponent, onMounted, ref, } from "vue";
import { setComposerSize, setupPostprocessing, } from "./postprocessing/postprocessing";


export default defineComponent({
  name: "RendererController",
  components: { Renderer, MainController },
  emits: ["ready"],
  props: {
    controls: { type: Boolean, default: false },
    sceneComponent: Object,
    sceneProps: { type: Object, default: {} },
    ui: { type: Boolean, default: false },
    trackGestures: { type: Boolean, default: false },
    showTour: { type: Boolean, default: false },
    teleport: { type: Boolean, default: true },
  },
  setup(props) {
    const renderer = ref<typeof Renderer>(null);
    const orbitControls = ref<OrbitControls>(null);
    const controller = ref<typeof MainController>(null);

    function onLoad() {
      const glRenderer: WebGLRenderer = renderer.value.renderer;
      const camera: PerspectiveCamera = renderer.value.camera;
      renderer.value.renderFn = setupPostprocessing(
        glRenderer, renderer.value.scene, camera);

      renderer.value.onBeforeRender(() => {
        const { width, height, needsResize } = rendererNeedsResize(glRenderer);
        if (needsResize) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          const controlsCamera = orbitControls.value.object;
          controlsCamera.aspect = camera.aspect;
          controlsCamera.updateProjectionMatrix();

          glRenderer.setSize(width, height, false);
          setComposerSize(width, height);
        }

        controller.value.render();
      });
    }

    onMounted(() => {
      orbitControls.value = renderer.value.three.cameraCtrl;
      orbitControls.value.enabled = props.controls;
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
      renderer,
      controller,
      orbitControls,
      onLoad,
    };
  },
});
</script>

<style scoped>
article {
  position: relative;
  width: stretch;
  height: 100%;
}
</style>
