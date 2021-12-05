<template>
    <page column
          fill
          header="Welcome"
          overflow-y
          pad
          top>
      <p class="page-subtitle">Welcome to <strong>Galaxia</strong>. Please enter your email and password and click
        <strong>sign in</strong> to continue (<i>or <strong>register</strong> if you do not have an account</i>).You can
        also sign in as a <strong>guest</strong> if you would just like to create and run simulations without saving
        them.
      </p>
      <section class="content">
        <login-form ref="form"
                    @guest-login="submit('guestLogin', $event)"
                    @login="submit('login', $event)"
                    @register="submit('register', $event)" />
      </section>
    </page>
</template>

<script lang="ts">
import Page from "@/components/ui/layout/page.vue";
import { AuthRequest } from "@/services/auth.service";
import LoginForm from "./login-form.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "Home",
  components: { LoginForm, Page },
  methods: {
    async submit(type: "login" | "register" | "guestLogin", user?: AuthRequest) {
      try {
        await this.$store.dispatch(`auth/${type}`, user);
        const username = this.$store.getters["auth/currentUsername"];
        await this.$router.push({ name: "home", params: { username } });
      } catch (error) {
        alert(error);
        this.$refs.form.focus();
      }
    }
  },
  mounted() {
    if (this.$store.getters["auth/loggedIn"] === true)
      this.$router.push({ name: "home", params: { username: this.$store.getters["auth/currentUsername"] } });
    else this.$refs.form.focus();
  }
});
</script>

<style scoped>
.page-subtitle {
  margin-top: var(--page-padding);
  margin-bottom: var(--page-padding);
  font-size: 11px;
  text-align: center;
}

.page-subtitle strong {
  color: var(--main);
}

.page-subtitle strong:nth-child(2) {
  color: var(--green);
}

.content {
  margin-bottom: auto;
  padding: 16px;
}

.content, .content > * {
  width: 100%;
}

@media (min-width: 768px) {
  .page-subtitle {
    margin-top: calc(var(--page-padding) / -2);
    text-align: left;
    width: 100%;
    font-size: 12px;
  }

  .content {
    margin-top: auto;
    width: 67%;
  }
}

@media (min-width: 1024px) {
  .content {
    width: 58%;
  }
}
</style>
