<template>
  <ul class="indicators">
    <li v-for="(_, index) in items"
        :key="index"
        @click="$emit('go', index)"
        :active="index === currentIndex">
      <div />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "carousel-indicators",
  emits: ["go"],
  props: {
    items: Number,
    currentIndex: Number,
  },
});
</script>

<style scoped>
.indicators {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(auto-fit, 21px);
  width: 100%;
  justify-content: center;
}

.indicators li {
  padding: 3px;
  border: 1px solid var(--main);
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.indicators li * {
  background: transparent;
  width: 100%;
  height: 100%;
}

li, li *, li *::after {
  border-radius: 50%;
  transition-duration: .2s;
  transition-timing-function: ease-in-out;
  transition-property: filter, transform, background-color;
}

li[active=true] {
  transform: scale(1.5);
  pointer-events: none;
  border-color: var(--accent);
}

li[active=true] * {
  background: var(--accent);
}

li:hover {
  filter: brightness(1.25);
  transform: scale(1.25);
}

li:hover * {
  background: var(--main);
}
</style>
