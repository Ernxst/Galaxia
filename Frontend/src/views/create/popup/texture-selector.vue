<template>
  <content-container :animate="animate"
                     :visible="visible">
    <template v-slot:header>
      <h1 class="selector-header">Select {{ texType }}</h1>
    </template>
    <template v-slot:content>
      <div class="selector-content">
        <p class="selector-description">Choose a {{ texType }} below to apply to your {{ type }} below.</p>
        <div class="tex-grid">
          <texture-cell v-for="texture in textures"
                        :key="texture.id"
                        v-bind="texture"
                        :active="modelValue[keyName] && modelValue[keyName].id === texture.id"
                        @click="$emit('click', $event)" />
        </div>
        <slot></slot>
      </div>
    </template>
    <template v-slot:custom>
      <slot name="custom" />
    </template>
  </content-container>
</template>

<script lang="ts">
import { TextureMap } from "@/@types/app/texture-maps";
import ContentContainer, { ContentContainerProps } from "@/components/ui/widgets/content-container/content-container.vue";
import TextureCell from "@/views/create/popup/texture-cell.vue";
import { defineComponent, PropType } from "vue";


export const TextureSelectorProps = {
  type: String as PropType<"star" | "moon" | "planet">,
  texType: String as PropType<"Texture" | "Atmosphere Texture" | "Bump Map" | "Specular Map">,
  textures: Object as PropType<TextureMap[]>,
  modelValue: Object,
  keyName: String,
};

export default defineComponent({
  name: "texture-selector",
  emits: ["click"],
  components: { TextureCell, ContentContainer },
  props: {
    ...TextureSelectorProps,
    ...ContentContainerProps
  },
});
</script>

<style scoped>
h1 {
  font-size: 24px;
}

h1, p {
  text-align: center;
  margin: 0;
}

.selector-content {
  position: relative;
  z-index: 5;
}

p {
  font-size: 13px;
  width: 100%;
  z-index: 5;
}

.tex-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  grid-gap: 24px;
  margin: 16px 0;
  overflow-y: scroll;
  max-height: 60vh;
}

@media (max-height: 768px) {
  .tex-grid {
    max-height: 50vh;
  }
}

@media (max-height: 568px) {
  .tex-grid {
    max-height: 40vh;
  }
}
</style>
