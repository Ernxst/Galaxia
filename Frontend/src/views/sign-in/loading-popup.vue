<template>
  <teleport to="body">
    <div class="abs overlay"
         v-if="visible || animating" />
    <div class="popup centred">
      <content-container ref="container"
                         @opened="$emit('opened')"
                         @closed="$emit('closed')"
                         v-bind="$attrs"
                         :glow="true"
                         :animate="animate"
                         :visible="visible">
        <template v-slot:header>
          <h1>{{ text }}</h1>
        </template>
        <template v-slot:content>
          <div class="content centred">
            <v-spinner />
            <p>Please wait</p>
          </div>
        </template>
      </content-container>
    </div>
  </teleport>
</template>

<script lang="ts">
import ContentContainer from "@/components/ui/widgets/content-container/content-container.vue";
import VSpinner from "@/components/ui/widgets/v-spinner.vue";
import { computed, defineComponent, ref } from "vue";


export default defineComponent({
  name: "loading-popup",
  components: { VSpinner, ContentContainer },
  emits: ["closed", "opened"],
  props: {
    animate: { type: Boolean, default: true },
    visible: { type: Boolean, default: true },
    text: { type: String, default: "Authenticating" },
  },
  setup() {
    const container = ref<typeof ContentContainer>(null);
    const animating = computed(() => (container.value ? container.value.animating : false));
    return { container, animating };
  },
});
</script>

<style scoped>
h1 {
  margin: 0;
  letter-spacing: 4px;
  font-size: 5.5vw;
  text-align: center;
}

.content {
  flex-direction: column;
  min-width: 33vw !important;
}

@media (min-width: 480px) {
  h1 {
    font-size: 32px;
  }
}
</style>
