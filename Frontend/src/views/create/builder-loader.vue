<template>
  <loading-popup :visible="loading"
                 text="Preparing Builder" />
</template>

<script lang="ts">
import { TextureMap } from "@/@types/app/texture-maps";
import { useStore } from "@/store/store";
import LoadingPopup from "@/views/sign-in/loading-popup.vue";
import { computed, defineComponent, Ref, ref } from "vue";


export default defineComponent({
  name: "builder-loader",
  components: { LoadingPopup },
  setup() {
    const textures = ref<TextureMap[]>([]);
    const atmosphereTextures = ref<TextureMap[]>([]);
    const bumpMaps = ref<TextureMap[]>([]);
    const specularMaps = ref<TextureMap[]>([]);

    async function loadTextures(array: Ref<TextureMap[]>, action: string) {
      try {
        array.value = await store.dispatch(`media/fetch${action}`);
      } catch (e) {
        alert(e);
      }
    }

    const store = useStore();
    loadTextures(textures, "Textures");
    loadTextures(atmosphereTextures, "AtmosphereTextures");
    loadTextures(bumpMaps, "BumpMaps");
    loadTextures(specularMaps, "SpecularMaps");

    const loading = computed(() => {
      const texMaps = [textures.value, atmosphereTextures.value, bumpMaps.value, specularMaps.value];
      return texMaps.some(e => e.length === 0);
    });

    return { loading };
  }
});
</script>

<style scoped>

</style>
