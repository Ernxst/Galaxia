<template>
  <div class="image-collage">
    <div v-for="(urls, index) in [left, right]"
         :key="urls"
         class="column centred"
         :data-left="index === 0">
      <img v-for="image in urls"
           :key="image"
           :alt="name"
           :src="image"
           loading="lazy" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from "vue";


export default defineComponent({
  name: "img-collage",
  props: {
    name: String,
    images: {
      type: Object as PropType<string[]>,
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
  /*display: grid;*/
  /*grid-template-columns: repeat(auto-fit, 48px);*/
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.column {
  flex: calc(50% - 8px);
  max-width: calc(50% - 8px);
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

img {
  vertical-align: middle;
  width: 100%;
}

[data-left="true"] img:last-child {
  transform: scaleY(1.33);
}

[data-left="false"] img {
  transform: scaleY(1.6);
}
</style>
