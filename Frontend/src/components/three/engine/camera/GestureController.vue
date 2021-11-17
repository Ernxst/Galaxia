<template>
  <video ref="webcam"/>
  <canvas ref="canvas"/>
</template>

<script lang="ts">
// TODO: Gestures for rotation and adjusting speed
// TODO: Make controls togglable in a menu
// TODO: SceneController needs to wait for model to load and for camera permission
import * as handTrack from 'handtrackjs';
import { defineComponent, getCurrentInstance, onMounted, ref } from "vue";


export default defineComponent({
  name: "gesture-controller",
  emits: ["loaded", "zoomIn", "zoomOut", "rotate", "pause", "play"],
  setup() {
    const webcam = ref<HTMLVideoElement>(null);
    const canvas = ref<HTMLCanvasElement>(null);
    const enabled = ref(false);
    const { emit } = getCurrentInstance();

    let model;
    const predictions = ref<Object[]>([]);

    async function setupWebcam() {
      if (navigator.mediaDevices.getUserMedia) {
        const options: MediaStreamConstraints = {
          audio: false,
          video: { facingMode: 'user', width: { ideal: document.body.clientWidth } }
        };
        webcam.value.srcObject = await navigator.mediaDevices.getUserMedia(options);
        await webcam.value.play();
      }
    }

    function setupCanvas() {
      canvas.value.width = webcam.value.videoWidth;
      canvas.value.height = webcam.value.videoHeight;
    }

    async function load() {
      try {
        await setupWebcam();
        setupCanvas();
        model = await handTrack.load({
          flipHorizontal: true,
          imageScaleFactor: 0.7,
          scoreThreshold: 0.7,
        });
        const { status, msg } = await handTrack.startVideo(webcam.value);
        enabled.value = status;
        if (!status) alert("Error");
      } catch (error) {
        alert("Could not set up gesture controls");
      } finally {
        emit("loaded");
      }
    }

    // TODO: Run in web worker
    async function detectVideo() {
      if (!enabled.value) return;
      predictions.value = await model.detect(webcam.value);
      const gesture = predictions.value.find((elem) => {
        return elem.label !== "face";
      });
      if (!gesture) return;
      switch (gesture.label) {
        case "closed":
          emit("pause");
          break;
        case "open":
          emit("play");
          break;
        default:
          break;
      }
    }

    onMounted(() => {
      load();
    });

    return { webcam, canvas, model, detectVideo };
  },
  beforeUnmount() {
    if (this.model) {
      handTrack.stopVideo(this.$refs.webcam);
      this.model.dispose();
    }
  }
});
</script>

<style scoped>
video, canvas {
  display: none;
}
</style>
