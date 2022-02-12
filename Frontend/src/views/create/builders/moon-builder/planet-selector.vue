<template>
  <div class="dropdown">
    <group-button :data-open="visible"
                  :name="!id ? `Select Parent` : `${parent.name}`"
                  :texture-id="!id ? undefined : parent.textureId"
                  @click="visible = !visible" />
    <ul v-show="visible">
      <li v-for="planet in planets"
          :data-active="id === planet.id">
        <group-button :expandable="false"
                      :name="planet.name"
                      :texture-id="planet.textureId"
                      type="planet"
                      @click="id = planet.id; visible = false" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { PlanetData } from "@/views/create/util/types";
import GroupButton from "@/views/create/builder/group-builder/group-button.vue";
import { computed, defineComponent, PropType, ref, toRefs, watch } from "vue";


export default defineComponent({
  name: "planet-selector",
  components: { GroupButton },
  emits: ["update:parentId"],
  props: {
    planets: Array as PropType<PlanetData[]>,
    parentId: Number,
  },
  setup(props, { emit }) {
    const { planets } = toRefs(props);
    const id = ref<number | null>(props.parentId);
    watch(id, (newVal: number | null) => emit("update:parentId", newVal));
    const parent = computed(() => {
      return id.value === null ? {} : planets.value.find(r => r.id === id.value);
    });
    const visible = ref<boolean>(false);

    return { id, parent, visible };
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
