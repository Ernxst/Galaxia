<template>
  <header class="page-header centred">
    <h1 ref="header">Beyond Galaxia</h1>
  </header>
  <page column
        pad>
    <section ref="main"
             class="centred">
      <span class="material-icons">chevron_right</span>
      <p>
        the <strong>farpoint </strong> is defined as the farthest point from the
        eye at which images are clear - the requested page is beyond the
        <strong>farpoint </strong> of <strong>Galaxia ... </strong>
      </p>
    </section>
    <router-link to="/">
      <flat-button text="Back to safety" />
    </router-link>
  </page>
</template>

<script lang="ts">
import Page from "@/components/ui/layout/page.vue";
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import { nextTick } from "@vue/runtime-core";
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";


export default defineComponent({
  name: "NotFound",
  components: { FlatButton, Page },
  setup() {
    const header = ref<HTMLHeadingElement>(null);
    const main = ref<HTMLElement>(null);

    function resize() {
      main.value.style.maxWidth = `${header.value.offsetWidth}px`;
    }

    onMounted(() => {
      nextTick(() => {
        resize();
      });
      window.addEventListener("resize", resize);
    });

    onBeforeMount(() => {
      window.removeEventListener("resize", resize);
    });
    return { header, main };
  },
});
</script>

<style scoped>
header {
  margin: auto auto 0;
  padding: 3px;
  border: 1px solid var(--main);
}

h1 {
  text-align: center;
  font-size: 28px;
  width: min-content;
  background: var(--main);
  color: var(--page-bg);
  padding-left: 12px;
  margin: 0;
}

section {
  align-items: flex-start;
  margin-bottom: 36px;
}

section p {
  margin: 0;
  text-align: center;
}

p strong {
  color: var(--main);
}

section span {
  display: none;
}

@media (min-width: 550px) {
  h1 {
    white-space: nowrap;
  }
}

@media (min-width: 480px) {
  h1 {
    font-size: 32px;
  }

  section span {
    display: block;
    font-size: 24px;
    margin-right: 9px;
    transition: 0.25s ease margin-right;
  }

  @media (pointer: fine) {
    section:hover span {
      margin-right: 21px;
    }
  }

  section p {
    text-align: justify;
  }
}
</style>
