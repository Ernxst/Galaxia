<template>
  <div class="button centred"
       @click="$emit('click')">
    <div class="button-inner centred">
      <div v-if="type !== 'asteroid belt'"
           class="image pseudo-after">
        <img :alt="name"
             :src="image" />
      </div>
      <span class="text">{{ name }}</span>
      <span v-if="expandable"
            class="material-icons centred">navigate_next</span>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store/store";
import { computed, defineComponent, toRefs } from "vue";


export default defineComponent({
  name: "group-button",
  emits: ['click'],
  props: {
    name: String,
    textureId: Number,
    type: String,
    expandable: { type: Boolean, default: true },
  },
  setup(props) {
    const { textureId } = toRefs(props);
    const store = useStore();
    const image = computed(() => {
      const id = textureId.value;
      if (id) {
        const texture = store.getters["media/texture"](id);
        return texture.url;
      }
      return "";
    });

    return { image };
  }
});
</script>

<style scoped>
.button {
  --btn-bg: rgba(0, 0, 0, .07);
  border: 1px solid var(--btn-bg);
  border-radius: 1px;
  transition: .2s ease-in-out all;
  margin-bottom: 16px;
  padding: 2px;
  cursor: pointer;
}

.button-inner {
  padding: 8px;
  border-radius: inherit;
  transition: inherit;
  width: 100%;
  justify-content: flex-start;
  background: var(--btn-bg);
}

.image {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--text-colour);
  width: 28px;
  height: 28px;
  min-width: 28px;
  margin-right: 8px;
}

.image:after {
  background: radial-gradient(circle at 50% 0px, #FFFFFF, rgba(255, 255, 255, 0) 58%);
  filter: blur(3px);
  border-radius: 50%;
  z-index: 2;
}

.image img {
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background-color: var(--text-colour);
}

.text {
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;
}

.material-icons {
  color: var(--text-colour);
  transition: .2s ease-in-out all;
  margin-left: auto;
  font-size: 20px;
}

.button:hover {
  --btn-bg: var(--electron-blue);
  box-shadow: 0 0 12px 6px rgba(0, 0, 0, .5);
}

.button[data-open=true] {
  --btn-bg: var(--main);
  box-shadow: 0 0 12px 6px rgba(0, 0, 0, .5);
}

.button[data-open=true] .button-inner {
  color: var(--page-bg);
}

.button[data-open=true] .material-icons {
  background: var(--main);
  transform: rotate(90deg);
  color: var(--page-bg);
}
</style>
