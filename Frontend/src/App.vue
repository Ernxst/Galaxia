<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script lang="ts">
import { useStore } from "@/store/store";
import { defineComponent, onBeforeMount } from "vue";


export default defineComponent({
  name: "App",
  watch: {
    $route(to, from) {
      if (to.hash) {
        this.$nextTick(() => {
          this.scrollToId(to.hash.slice(1));
        });
      }
    },
  },
  setup() {
    const store = useStore();
    onBeforeMount(async () => {
      await store.dispatch("auth/fetchGuestUsername");
    });
  },
  methods: {
    scrollToId(id: string) {
      try {
        const element = document.getElementById(id);
        if (!element) return;
        window.scrollTo({
          top: element.offsetTop - 72,
          behavior: "smooth",
        });
      } catch {
        location.hash = id;
      }
    },
  },
});
</script>

<style>
#app {
  --page-padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  #app {
    --page-padding: 24px;
  }
}

@media (min-width: 920px) {
  #app {
    --page-padding: 32px;
  }
}

@media (min-width: 1024px) {
  #app {
    --page-padding: 36px;
  }
}
</style>
