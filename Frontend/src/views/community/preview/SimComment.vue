<template>
  <article class="comment-container">
    <h3 class="name">{{ username }}</h3>
    <span class="date">{{ formattedDate }}</span>
    <p class="comment">{{ comment }}</p>
    <span class="material-icons close-icon centred"
          v-if="canDelete" @click="$emit('delete')">close</span>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";


export default defineComponent({
  name: "SimComment",
  emits: ["delete"],
  props: {
    id: Number,
    createdAt: { type: String, required: true },
    comment: String,
    username: String,
    canDelete: Boolean,
  },
  setup(props) {
    function formatDate(s: string) {
      const date = new Date(s);
      const dateStr = date.toLocaleDateString("en-GB", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: 'UTC'
      });
      const time = date.toLocaleTimeString().slice(0, -3);
      return `${dateStr} @ ${time}`;
    }

    const { createdAt } = toRefs(props);
    const formattedDate = computed(() => formatDate(createdAt.value));
    return { formattedDate };
  }
});
</script>

<style scoped>
.comment-container {
  position: relative;
  backdrop-filter: blur(3px);
  background: rgba(255, 255, 255, 0.22);
  padding: 16px;
  display: grid;
  grid-gap: 8px;
  border: 1px solid var(--main);
}

.comment-container * {
  margin: 0;
}

.name {
  background: var(--main);
  padding-left: 6px;
  padding-right: 6px;
  color: var(--page-bg);
  width: fit-content;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date {
  font-size: 10px;
}

.comment {
  text-transform: none;
  font-size: 14px;
  max-width: 100%;
}

.close-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 14px;
  background: var(--red);
  border-radius: 0;
}
</style>
