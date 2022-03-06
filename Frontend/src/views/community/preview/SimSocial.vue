<template>
  <div class="content">
    <button class="ribbon centred noselect"
            :data-active="canLike"
            :data-liked="hasLikedThisSim"
            type="button"
            @click="toggleLike">
      <span class="material-icons icon centred">{{ hasLikedThisSim ? "favorite" : "favorite_border" }}</span>
      <span><strong>{{ likes.length }}</strong></span>
      <VTooltip text="Please sign in to leave like"
                v-if="!canLike" />
    </button>
    <hr />
    <SimComments :id="id"
                 :username="username" />
  </div>
</template>

<script lang="ts">
import VTooltip from "@/components/ui/widgets/v-tooltip.vue";
import { useStore } from "@/store/store";
import SimComments from "@/views/community/preview/SimComments.vue";
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, toRefs } from "vue";


export default defineComponent({
  name: "SimSocial",
  components: { VTooltip, SimComments },
  props: {
    id: { type: Number, required: true },
    username: { type: String, required: true }
  },
  setup(props) {
    const { id, username } = toRefs(props);

    const likes = ref<string[]>([]);
    const hasLikedThisSim = computed(() => likes.value.includes(username.value));
    const toggleLike = () => hasLikedThisSim.value ? unlike() : like();
    const like = async () => {
      if (!canLike) return;
      const payload = {
        username: username.value,
        simulationID: id.value,
      };
      try {
        await store.dispatch("social/like", payload);
      } catch (e) {
        alert(e);
      }
    };

    const unlike = async () => {
      const payload = {
        username: username.value,
        simulationID: id.value,
      };
      try {
        await store.dispatch("social/unlike", payload);
      } catch (e) {
        alert(e);
      }
    };

    const store = useStore();
    const fetchLikes = () => {
      store.dispatch("social/fetchLikes", id.value)
        .then((r: string[]) => likes.value = r)
        .catch(() => {
        });
    };

    fetchLikes();
    const interval = ref<number>();
    onMounted(() => interval.value = setInterval(fetchLikes, 1500));
    onBeforeUnmount(() => clearInterval(interval.value));

    const guestUsername = store.getters["auth/guestUsername"];
    const canLike = computed(() => username.value !== guestUsername);

    return { likes, hasLikedThisSim, canLike, toggleLike };
  }
});
</script>

<style scoped>
.content {
  display: grid;
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
}

.ribbon {
  gap: 4px;
  cursor: pointer;
  margin-left: auto;
  padding: 4px;
}

.ribbon[data-active="false"] {
  filter: brightness(0.75);
  cursor: default;
}

.ribbon, .ribbon:hover {
  background: none;
  outline: none;
  border: none;
}

.ribbon span {
  font-size: 16px;
}

.ribbon[data-liked="true"] {
  color: var(--main);
}

hr {
  border: none;
  border-top: 1px solid var(--main);
  width: 75%;
  border-radius: 24px;
  margin-bottom: 24px;
}
</style>
