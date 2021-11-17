<template>
  <div class="zoom-slider-container centred">
    <slider id="zoom-slider"
            ref="slider"
            :max="maxZoom"
            :min="minZoom"
            :model-value="zoom"
            label="Zoom"
            orient="vertical"
            v-bind:disabled="disabled"
            @update:model-value="onUpdate"
    />
  </div>
</template>

<script lang="ts">
import { BASE_ZOOM, MAX_ZOOM, MIN_ZOOM } from "@/assets/three/camera/camera.constants";
import Slider from "@/components/ui/widgets/slider.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "zoom-controller",
  components: { Slider },
  emits: ["adjustZoom"],
  computed: {
    minZoom(): number {
      return MIN_ZOOM;
    },
    maxZoom(): number {
      return MAX_ZOOM;
    }
  },
  data() {
    return {
      zoom: BASE_ZOOM,
      disabled: false,
    };
  },
  methods: {
    onUpdate(value: number) {
      this.$emit("adjustZoom", value);
      this.zoom = value;
    },
    update(value: number) {
      this.zoom = value;
    },
    disable() {
      this.disabled = true;
    },
    enable() {
      this.disabled = false;
    },
    zoomIn() {
      if (this.zoom < this.maxZoom) this.zoom += 1;
      this.$emit("adjustZoom", this.zoom);
    },
    zoomOut() {
      if (this.zoom < this.minZoom) this.zoom -= 1;
      this.$emit("adjustZoom", this.zoom);

    },
    reset() {
      this.zoom = BASE_ZOOM;
      this.enable();
    }
  }
});
</script>

<style scoped>
.zoom-slider-container {
  position: fixed;
  right: 16px;
  top: 40%;
}

@media (max-width: 480px) {
  .zoom-slider-container {
    display: none;
  }
}
</style>
