<template>
  <page column
        fill
        header="Galaxia"
        overflow-y
        pad>
    <p v-if="isGuest"
       class="page-subtitle">Welcome to Galaxia. You are currently using a <strong>guest</strong> account allowing you
      to
      create simulations. Please log into or register a new account to save and/or share any simulations. You are
      currently at the main menu. Please choose an option below to continue.</p>
    <p v-else
       class="page-subtitle">Welcome to Galaxia, <strong>{{ username }}</strong>. You are currently at the main menu.
      Please choose an option below to continue.</p>
    <section class="nav-container">
      <nav class="menu-buttons">
        <menu-button description="Create a new galaxy, either from scratch or a preset, and fine-tune it completely to your liking."
                     image="https://images.newscientist.com/wp-content/uploads/2020/08/28214732/28-aug_traversable-wormholes.jpg?width=800"
                     subtitle="Start a new journey"
                     text="Explore"
                     @click="go('explore' )"
        />
        <menu-button :disabled="true"
                     description="View, run, share and edit your previously created Galaxia simulations."
                     image="https://images.newscientist.com/wp-content/uploads/2020/10/28124436/f0254420-black_hole_web.jpg?width=800"
                     subtitle="View your work"
                     text="My Simulations" />
        <menu-button :disabled="true"
                     description="View community-shared simulations, textures and celestial bodies available for use in your custom simulations."
                     image="https://scitechdaily.com/images/TRAPPIST-1-System-1-2048x2048.jpg"
                     subtitle="Interact with the community"
                     text="Community" />
        <menu-button :disabled="true"
                     description="Adjust Galaxia to behave just the way you want it."
                     image="https://i.natgeofe.com/k/a2a738a9-e019-4911-98e6-17f31c45ac88/milky-way-2.jpg?w=826&h=464"
                     subtitle="Fine-tune Galaxia"
                     text="Options" />
      </nav>
    </section>
    <section class="sign-out-btn centred">
      <flat-button text="Sign Out"
                   @click="logout" />
    </section>
  </page>
</template>

<script lang="ts">
import AppFooter from "@/components/ui/layout/app-footer.vue";
import Page from "@/components/ui/layout/page.vue";
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import ContentContainer from "@/components/ui/widgets/content-container/content-container.vue";
import { useStore } from "@/store/store";
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import MenuButton from "./menu-button.vue";


export default defineComponent({
  name: "Home",
  components: { ContentContainer, AppFooter, FlatButton, MenuButton, Page },
  props: {
    username: { type: String, required: true },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const isGuest = computed(() => {
      return props.username == store.getters["auth/guestUsername"];
    });

    function go(page: string, routeParams = {}) {
      router.push({
        name: page,
        params: {
          username: props.username,
          ...routeParams
        }
      });
    }

    async function logout() {
      await store.dispatch("auth/logout");
      await router.push({ name: "login" });
    }

    return { go, logout, isGuest };
  },
});
</script>

<style scoped>
.page-subtitle {
  margin-top: calc(var(--page-padding) / -2);
  margin-bottom: calc(var(--page-padding) / 2);
  font-size: 12px;
  text-align: center;
  box-shadow: 0 4px 8px 4px var(--page-bg);
  z-index: 5;
}

.page-subtitle strong {
  color: var(--main);
}

.nav-container {
  overflow-y: auto;
}

.menu-buttons {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-row-gap: 16px;
  min-height: 200vh;
  padding: var(--page-padding);
}

.sign-out-btn {
  margin-top: var(--page-padding);
  width: 100%;
  box-shadow: 0 calc(var(--page-padding) * -1) calc(var(--page-padding) * 2) var(--page-padding) var(--page-bg);
  z-index: 5;
  padding-left: var(--page-padding);
  padding-right: var(--page-padding);
}

.sign-out-btn > * {
  width: 100%;
}

@media (max-height: 320px) {
  .menu-buttons {
    min-height: 250vh;
  }
}

@media (min-width: 768px) {
  .page-subtitle {
    text-align: left;
    width: 100%;
  }

  .nav-container {
    display: grid;
    height: 100%;
  }

  .menu-buttons {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-row-gap: 32px;
    grid-column-gap: 32px;
    min-height: unset;
    padding: 0;
  }

  .sign-out-btn {
    justify-content: flex-end;
    box-shadow: none;
    padding: 0;
  }

  .sign-out-btn > * {
    width: unset;
  }
}

@media (min-width: 920px) {
  .menu-buttons {
    grid-template-columns: 3fr 3fr 5fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
    "first second third"
    "first second fourth";
  }

  .menu-buttons > *:first-child {
    grid-area: first;
  }

  .menu-buttons > *:nth-child(2) {
    grid-area: second;
  }

  .menu-buttons > *:nth-child(3) {
    grid-area: third;
  }

  .menu-buttons > *:last-child {
    grid-area: fourth;
  }
}
</style>
