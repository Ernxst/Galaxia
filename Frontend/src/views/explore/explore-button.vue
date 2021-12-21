<template>
  <article class="container">
    <div class="image">
      <img :src="img"
           :alt="caption" />
    </div>
    <span class="caption">{{ caption }}</span>
    <h2 class="title">{{ title }}</h2>
    <p class="description">{{ description }}</p>
    <flat-button text="Explore"
                 @click="$emit('click', $event)" />
  </article>
</template>

<script lang="ts">
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "explore-button",
  components: { FlatButton },
  emits: ["click"],
  props: {
    title: String,
    description: String,
    caption: String,
    img: String,
  }
});
</script>

<style scoped>
article {
  position: relative;
  cursor: default;
  height: min-content;
  padding: 16px;
  border: 1px solid transparent;
  transition: .3s ease-in-out all;
}

@media (pointer: fine) {
  .description, .caption, .title, div {
    transition: .3s ease-in-out all;
    text-shadow: 0 0 20px var(--page-bg);
  }
}

article > * {
  position: relative;
  z-index: 3;
}

article:hover {
  border-color: var(--main);
}

article:hover .description, article:hover .caption, article:hover .title, article:hover div {
  filter: brightness(1.2);
}

.image, article::before, article::after {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

article::after {
  box-shadow: inset 0 0 8px 8px var(--page-bg);
  content: "";
  z-index: 1;
}

article::before {
  z-index: 2;
  content: "";
  background: var(--page-bg);
  opacity: .35;
}

.caption {
  font-size: 10px;
  color: rgba(255, 255, 255, .67);
}

.title {
  margin-top: 0;
  font-size: 28px;
  width: 100%;
}

.description {
  font-size: 12px;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  article:hover {
    transform: scale(1.2);
  }
}
</style>
