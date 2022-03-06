<template>
  <section class="comments-container">
    <h2>Comments</h2>
    <p v-if="comments.length ===0">It's a little lonely here ...</p>
    <ul class="comments">
      <li v-for="comment in comments"
          :key="comment.createdAt">
        <SimComment v-bind="comment"
                    :can-delete="canComment && comment.username === username"
                    @delete="deleteComment(comment.id)" />
      </li>
    </ul>
  </section>
  <hr />
  <section class="inputs">
    <h2>Join the discussion</h2>
    <p v-if="!canComment">You cannot comment using a guest account. Please register or sign in.</p>
    <TextInput :multiline="true"
               id="comment-input"
               placeholder="Share your thoughts"
               v-model="newComment"
               :data-disabled="!canComment"
               :no-spaces="false"
               :maxlength="128"
               @submit="postComment" />
    <FlatButton class="submit"
                :data-disabled="!newComment || !canComment"
                @click="postComment"
                text="Post"
                bg="var(--green)">
    </FlatButton>
  </section>
</template>

<script lang="ts">
import { SimulationComment } from "@/@types/app";
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import TextInput from "@/components/ui/widgets/text-input.vue";
import { useStore } from "@/store/store";
import SimComment from "@/views/community/preview/SimComment.vue";
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, toRefs } from "vue";


export default defineComponent({
  name: "SimComments",
  components: { SimComment, FlatButton, TextInput },
  props: {
    id: { type: Number, required: true },
    username: { type: String, required: true }
  },
  setup(props) {
    const { id, username } = toRefs(props);
    const comments = ref<SimulationComment[]>([]);
    const newComment = ref<string>("");

    const postComment = async () => {
      const payload = {
        comment: newComment.value,
        username: username.value,
        simulationID: id.value,
      };
      try {
        await store.dispatch("social/newComment", payload);
        newComment.value = "";
      } catch (e) {
        alert(e);
      }
    };

    const deleteComment = async (commentID: number) => {
      try {
        await store.dispatch("social/deleteComment", { commentID, simulationID: id.value });
      } catch (e) {
        alert(e);
      }
    };

    const store = useStore();
    const fetchComments = () => {
      store.dispatch("social/fetchComments", id.value)
        .then((r: SimulationComment[]) => comments.value = r)
        .catch(() => {
        });
    };

    fetchComments();
    const interval = ref<number>();
    onMounted(() => interval.value = setInterval(fetchComments, 1500));
    onBeforeUnmount(() => clearInterval(interval.value));

    const guestUsername = store.getters["auth/guestUsername"];
    const canComment = computed(() => username.value !== guestUsername);

    return { comments, newComment, canComment, postComment, deleteComment };
  }
});
</script>

<style scoped>
h2 {
  background: var(--main);
  padding-left: 6px;
  padding-right: 6px;
  color: var(--page-bg);
  width: fit-content;
}

.comments {
  display: grid;
  grid-gap: 8px;
}

.inputs {
  display: grid;
  grid-gap: 16px;
  width: 100%;
}

.inputs p {
  font-size: 12px;
  margin-top: 0;
}

.text-input * {
  text-transform: none;
}

hr {
  margin-top: 32px;
  border: none;
  border-top: 1px solid var(--main);
  width: 75%;
  border-radius: 24px;
}

@media (min-width: 480px) {
  .inputs {
    grid-template-columns: 1fr auto;
  }

  .inputs h2, .inputs p, .comments-container p {
    grid-column: span 3;
  }

  .submit {
    height: fit-content;
  }
}
</style>
