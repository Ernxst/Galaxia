<template>
  <page-background v-if="bg" />
  <header v-if="header !== undefined"
          class="page-header centred">
    <h1>{{ header }}</h1>
    <slot name="header"></slot>
  </header>
  <main v-bind="$attrs"
        class="page centred">
    <slot></slot>
  </main>
  <app-footer v-if="footer" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppFooter from "./app-footer.vue";
import PageBackground from "./page-background.vue";


export default defineComponent({
  name: "page",
  components: { PageBackground, AppFooter },
  props: {
    header: String,
    bg: { type: Boolean, default: true },
    footer: { type: Boolean, default: true }
  }
});
</script>

<style scoped>
.page-header {
  margin: var(--page-padding);
  margin-bottom: 0;
  border: 1px solid var(--main);
  border-left: 6px solid var(--main);
  padding: 3px;
  z-index: 1;
}

.page-header h1 {
  margin: 0;
  width: 100%;
  text-align: center;
  background: var(--main);
  color: var(--page-bg);
  padding-left: 8px;
  font-size: 24px;
}

.page[fill] {
  height: 100%;
}

.page[pad] {
  padding: var(--page-padding);
}

.page[overflow-y] {
  overflow-y: auto;
}

.page[top] {
  justify-content: flex-start;
}

.page[left] {
  align-items: flex-start;
}

.page[column] {
  flex-direction: column;
}

@media (min-width: 480px) {
  .page-header h1 {
    font-size: 28px;
  }
}

@media (min-width: 768px) {
  .page-header h1 {
    text-align: left;
  }

  .page[overflow-y] {
    overflow-y: unset;
  }
}

@media (min-width: 920px) {
  .page-header {
    margin-right: 0;
    border-right: none;
    padding-right: 0;
  }
}

@media (max-width: 812px) and (orientation: landscape) {
  .page {
    justify-content: flex-start;
  }

  .page[overflow-y] {
    overflow-y: auto;
  }
}

@media (max-height: 320px) and (min-width: 480px) and (orientation: landscape) {
  .page-header h1 {
    font-size: 24px;
  }
}
</style>
