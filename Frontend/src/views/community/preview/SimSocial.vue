<template>
  <div class="content">
    <button class="ribbon centred noselect"
            type="button"
            @click="toggleLike"
            v-if="canLike">
      <span class="material-icons icon centred">{{ hasLikedThisSim ? "favorite" : "favorite_border" }}</span>
      <span><strong>{{ likes.length }}</strong></span>
    </button>
    <hr />
    <SimComments :id="id"
                 :username="username" />
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store/store";
import SimComments from "@/views/community/preview/SimComments.vue";
import { computed, defineComponent, ref, toRefs } from "vue";


export default defineComponent({
  name: "SimSocial",
  components: { SimComments },
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
      const payload = {
        username: username.value,
        simulationID: id.value,
      };
      try {
        await store.dispatch("social/like", payload);
        likes.value.push(username.value);
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
        likes.value = likes.value.filter(item => item !== username.value);
      } catch (e) {
        alert(e);
      }
    };

    const store = useStore();
    store.dispatch("social/fetchLikes", id.value)
      .then((r: string[]) => likes.value = r)
      .catch(e => alert(e));
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

.ribbon, .ribbon:hover {
  background: none;
  outline: none;
  border: none;
}

.ribbon span {
  font-size: 16px;
}

hr {
  border: none;
  border-top: 1px solid var(--main);
  width: 75%;
  border-radius: 24px;
  margin-bottom: 24px;
}
</style>
