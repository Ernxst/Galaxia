<template>
  <teleport to="body">
    <div v-if="visible || animating"
         class="abs overlay" />
    <div class="popup centred">
      <texture-selector ref="container"
                        v-model="modelValue"
                        v-bind="$attrs"
                        :animate="animate"
                        :glow="true"
                        :key-name="keyName"
                        :tex-type="texType"
                        :textures="textures"
                        :type="type"
                        :visible="visible"
                        @click="$emit('click', $event)">
        <template v-slot:custom>
          <span class="close-icon material-icons centred"
                @click="$emit('close')">close</span>
        </template>
        <flat-button :data-disabled="!modelValue[keyName]"
                     bg="var(--green)"
                     text="Confirm"
                     @click="$emit('close')" />
      </texture-selector>
    </div>
  </teleport>
</template>

<script lang="ts">
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import ContentContainer, { ContentContainerProps } from "@/components/ui/widgets/content-container/content-container.vue";
import TextureSelector, { TextureSelectorProps } from "@/views/create/popup/texture-selector.vue";
import { computed, defineComponent, ref } from "vue";


export default defineComponent({
  name: "texture-selector-popup",
  components: { FlatButton, TextureSelector },
  emits: ["update:modelValue", "close", "click"],
  props: {
    ...TextureSelectorProps,
    ...ContentContainerProps,
  },
  setup() {
    const container = ref<typeof ContentContainer>(null);
    const animating = computed(() => (container.value ? container.value.animating : false));
    return { container, animating };
  },
});
</script>

<style scoped>
.close-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 7;
  background: var(--red);
  transition-duration: .167s;
}

.popup > * {
  max-height: stretch;
}
</style>
