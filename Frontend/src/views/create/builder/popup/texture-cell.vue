<template>
  <div :data-active="active"
       class="cell noselect"
       @click="$emit('click', id)">
    <div class="image">
      <img :alt="name"
           :src="url"
           loading="lazy" />
    </div>
    <div class="content">
      <h3>{{ name }}</h3>
      <p class="resolution">Resolution: <strong>{{ width }} × {{ height }}</strong></p>
      <p class="type">For: <strong>{{ type }}</strong></p>
      <a v-if="originalUrl !== ''"
         :href="originalUrl"
         class="centred"
         rel="noopener"
         target="_blank"><span class="material-icons">navigate_next</span>Link to Original</a>
    </div>
  </div>
</template>

<script lang="ts">
import { TexturedBody } from "@/services/media.service";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "texture-cell",
  emits: ["click"],
  props: {
    id: Number,
    updatedAt: String,
    createdAt: String,
    name: String,
    filename: String,
    apiUrl: String,
    url: String,
    for: String as PropType<TexturedBody>,
    originalUrl: String,
    size: Number,
    width: Number,
    height: Number,
    active: Boolean,
  },
  computed: {
    type(): string {
      return this.for;
    }
  }
});
</script>

<style scoped>
.cell {
  display: grid;
  grid-row-gap: 16px;
  position: relative;
  padding: 8px;
  border: 2px solid transparent;
  transition: .167s ease-in-out all;
  cursor: pointer;
  margin: 3px;
}

.cell:hover {
  border-color: var(--main);
}

.cell[data-active=true] {
  border-color: var(--green);
  pointer-events: none;
}

.image {
  cursor: pointer;
  height: fit-content;
  border: 1px solid var(--text-colour);
}

img {
  object-fit: cover;
}

.content {
  display: grid;
  grid-row-gap: 6px;
}

h3 {
  margin-top: 0;
  margin-bottom: 6px;
  width: 100%;
  background: var(--main);
  color: var(--page-bg);
  padding-left: 6px;
}

p {
  margin: 0;
  font-size: 11px;
}

strong {
  color: var(--main);
}


.type, a, a span {
  font-size: 11px;
  transition: .167s ease-in-out all;
}

a {
  margin-top: 6px;
  color: var(--main);
  padding-bottom: 2px;
  border-bottom: 1px solid var(--main);
  width: min-content;
  white-space: nowrap;
}

a span {
  padding-right: 4px;
}

a:hover {
  filter: brightness(1.5);
}

@media (max-width: 480px) {
  p, a span {
    font-size: 10px;
  }
}
</style>
