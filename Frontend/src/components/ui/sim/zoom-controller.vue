<template>
  <div class="zoom-slider-container centred">
    <slider label="Zoom"
            id="zoom-slider"
            :min="minZoom"
            :max="maxZoom"
            :model-value="zoom"
            orient="vertical"
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
      zoom: BASE_ZOOM
    };
  },
  methods: {
    onUpdate(value: number) {
      this.$emit("adjustZoom", value);
      this.zoom = value;
    },
    reset() {
      this.zoom = BASE_ZOOM;
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
</style>
