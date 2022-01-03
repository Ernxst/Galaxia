<template>
  <div class="dropdown">
    <group-button @click="visible = !visible"
                  :data-open="visible"
                  :texture-id="!modelValue ? undefined : parent.textureId"
                  :name="!modelValue ? `Select Parent` : `${parent.name}`" />
    <ul v-show="visible">
      <li v-for="planet in planets"
          :data-active="modelValue === planet.id">
        <group-button :texture-id="planet.textureId"
                      :name="planet.name"
                      type="planet"
                      :expandable="false"
                      @click="$emit('update:modelValue', planet.id); visible = false" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Planet } from "@/@types/celestial/planet";
import GroupButton from "@/views/create/builder/group-builder/group-button.vue";
import { computed, defineComponent, PropType, ref, toRefs } from "vue";


export default defineComponent({
  name: "planet-selector",
  emits: ["update:modelValue"],
  components: { GroupButton },
  props: {
    planets: Object as PropType<Planet[]>,
    modelValue: Number,
  },
  setup(props) {
    const { modelValue, planets } = toRefs(props);
    const parent = computed(() => {
      return modelValue.value === null ? {} : planets.value.find(r => r.id === modelValue.value);
    });
    const visible = ref<boolean>(false);

    return { parent, visible };
  }
});
</script>

<style scoped>
.dropdown {
  width: 100%;
  position: relative;
}

.button, .button:hover {
  --btn-bg: var(--main);
}

ul {
  display: grid;
  grid-gap: 6px;
  position: absolute;
  top: calc(100% - 6px);
  left: 0;
  right: 0;
  padding: 6px;
  background: var(--page-bg);
  border: 1px solid var(--main);
  border-radius: 2px;
  box-shadow: 0 0 10px 4px rgba(0, 0, 0, .55);
  z-index: 5;
  overflow-y: auto;
  max-height: 256px;
}

li > .button, li > .button:hover {
  --btn-bg: var(--accent);
  margin-bottom: 0;
}

li[data-active=true] {
  pointer-events: none;
}

li[data-active=true] .button {
  --btn-bg: var(--green);
}
</style>
