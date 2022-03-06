<template>
  <celestial-form-container :description="description"
                            header="Textures">
    <template v-for="attribute in attributes">
      <div v-if="attribute.show"
           :key="attribute.name"
           class="texture">
        <flat-button :text="`Select ${attribute.name}`"
                     @click="currentAttribute = attribute" />
        <div :set="texture = current[attribute.name]"
             class="texture-container centred">
          <template v-if="texture && texture.url">
            <div class="image">
              <img :alt="`${attribute.name} preview`"
                   :src="texture.url" />
              <span class="tex-name">{{ texture.name }}</span>
              <span class="remove-btn close-icon material-icons"
                    @click="modelValue[attribute.keyName] = null">close</span>
            </div>
          </template>
          <span v-else>No {{ attribute.name }} selected</span>
        </div>
      </div>
    </template>
    <template v-if="currentAttribute">
      <texture-selector-popup v-model="modelValue"
                              :key-name="currentAttribute.keyName"
                              :tex-type="currentAttribute.name"
                              :textures="currentTextures"
                              :type="type"
                              @click="modelValue[currentAttribute.keyName] = $event"
                              @close="currentAttribute = null" />
    </template>
  </celestial-form-container>
</template>

<script lang="ts">
import { TextureMap } from "@/@types/app/texture-maps";
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import { useStore } from "@/store/store";
import CelestialFormContainer from "@/views/create/forms/form-container.vue";
import TextureSelectorPopup from "@/views/create/popup/texture-selector-popup.vue";
import { MoonData, PlanetData, StarData } from "@/views/create/util/types";
import LoadingPopup from "@/views/sign-in/loading-popup.vue";
import { computed, defineComponent, PropType, ref, toRefs } from "vue";


export default defineComponent({
  name: "textured-form",
  emits: ["update:modelValue"],
  components: { TextureSelectorPopup, FlatButton, LoadingPopup, CelestialFormContainer },
  props: {
    modelValue: {
      type: Object as PropType<StarData | PlanetData | MoonData>,
      required: true,
    },
    type: String as PropType<"star" | "moon" | "planet">
  },
  setup(props) {
    const { modelValue } = toRefs(props);
    const store = useStore();
    const textures = ref<TextureMap[]>([]);
    const atmosphereTextures = ref<TextureMap[]>([]);
    const bumpMaps = ref<TextureMap[]>([]);
    const specularMaps = ref<TextureMap[]>([]);
    textures.value = store.getters["media/textures"];
    atmosphereTextures.value = store.getters["media/atmosphereTextures"];
    bumpMaps.value = store.getters["media/bumpMaps"];
    specularMaps.value = store.getters["media/specularMaps"];

    const description = `Applying textures gives your ${props.type} its unique look to distinguish it from other celestial bodies in the simulation.`;
    const currentAttribute = ref(null);
    const currentTextures = computed(() => {
      if (!currentAttribute.value) return [];
      return currentAttribute.value.array.filter(e => e.for === `${props.type}s`);
    });
    const visible = computed(() => (currentTextures.value === []));

    const current = computed(() => ({
      "Texture": modelValue.value.texture,
      "Atmosphere Texture": modelValue.value.atmosphereTexture,
      "Bump Map": modelValue.value.bumpMap,
      "Specular Map": modelValue.value.specularMap,
    }));

    const attributes = [{ name: "Texture", array: textures, keyName: "texture", show: true, },
      {
        name: "Atmosphere Texture",
        array: atmosphereTextures,
        keyName: "atmosphereTexture",
        show: atmosphereTextures.value.filter(e => e.for === `${props.type}s`).length > 0,
      },
      { name: "Bump Map", array: bumpMaps, keyName: "bumpMap", show: props.type !== "star", },
      { name: "Specular Map", array: specularMaps, keyName: "specularMap", show: props.type !== "star", },
    ];

    return { description, attributes, currentAttribute, currentTextures, current, visible };
  }
});
</script>

<style scoped>
.texture {
  display: grid;
  grid-row-gap: 16px;
}

.texture-container {
  border: 1px solid var(--main);
  overflow: hidden;
  min-height: fit-content;
  backdrop-filter: blur(3px);
  background: rgba(255, 255, 255, .2);
}

.texture-container > span {
  color: var(--text-colour);
  font-size: 24px;
  text-align: center;
  padding: 8px;
}

.image {
  position: relative;
}

.image .tex-name {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--main);
  color: var(--page-bg);
  font-size: 11px;
  padding: 4px 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.image .remove-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--red);
  transform: scale(0.75);
}
</style>
