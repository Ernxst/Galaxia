<template>
  <div class="image-collage">
    <div v-for="(urls, index) in [left, right]"
         :key="urls"
         class="column centred"
         :data-left="index === 0">
      <img v-for="image in urls"
           :key="image.id"
           :alt="image.name"
           :src="image.url"
           loading="lazy" />
    </div>
  </div>
</template>

<script lang="ts">
import { TextureMap } from "@/@types/app/texture-maps";
import { computed, defineComponent, PropType, toRefs } from "vue";


export default defineComponent({
  name: "img-collage",
  props: {
    name: String,
    images: {
      type: Object as PropType<TextureMap[]>,
      required: true,
    }
  },
  setup(props) {
    const { images } = toRefs(props);
    // Show a maximum of six images
    const links = computed(() => images.value.slice(0, 4));
    const midpoint = computed(() => Math.ceil(links.value.length / 2));
    const left = computed(() => links.value.slice(0, midpoint.value));
    const right = computed(() => links.value.slice(-midpoint.value));

    return { left, right };
  }
});
</script>

<style scoped>
.image-collage {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.column {
  flex: calc(50% - 8px);
  max-width: 50%;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

img {
  vertical-align: middle;
  width: 100%;
}
</style>
