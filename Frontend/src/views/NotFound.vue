<template>
  <header class="centred">
    <h1 ref="header">Beyond Galaxia</h1>
  </header>
  <page column pad>
    <article class="centred" ref="main">
      <span class="material-icons">chevron_right</span>
      <p>
        the <strong>farpoint </strong> is defined as the farthest point from the
        eye at which images are clear - the requested page is beyond the
        <strong>farpoint </strong> of <strong>Galaxia </strong> ...
      </p>
    </article>
    <router-link to="/" text="Back to safety"></router-link>
  </page>
</template>

<script lang="ts">
  import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
  import Page from "@/components/ui/layout/page.vue";

  export default defineComponent({
    name: "NotFound",
    components: { Page },
    setup() {
      const header = ref<HTMLHeadingElement>(null);
      const main = ref<HTMLElement>(null);
      function resize() {
        main.value.style.maxWidth = `${header.value.offsetWidth}px`;
      }
      onMounted(() => {
        resize();
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
    margin-top: calc(100vh * 0.125);
    padding-left: 16px;
    padding-right: 16px;
  }

  h1 {
    text-align: center;
    font-size: 28px;
    width: min-content;
  }

  article {
    align-items: flex-start;
    margin-bottom: 36px;
  }

  article p {
    margin: 0;
    text-align: center;
  }

  p strong {
    color: var(--main);
  }

  article span {
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

    article span {
      display: block;
      font-size: 24px;
      margin-right: 9px;
      transition: 0.25s ease margin-right;
    }

    @media (pointer: fine) {
      article:hover span {
        margin-right: 21px;
      }
    }

    article p {
      text-align: left;
    }
  }
</style>
