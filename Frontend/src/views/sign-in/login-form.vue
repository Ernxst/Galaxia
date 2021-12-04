<template>
  <form class="sign-in-form"
        @submit.prevent="submit('login')">
    <text-input id="username"
                ref="username"
                v-model="username"
                :no-spaces="true"
                :required="true"
                autocomplete="username"
                label="username"
                placeholder="USERNAME" />
    <text-input id="password"
                v-model="password"
                :no-spaces="true"
                :required="true"
                :type="showPassword ? 'text': 'password'"
                autocomplete="current-password"
                label="password"
                placeholder="PASSWORD" />
    <checkbox id="show-password"
              v-model="showPassword"
              label="Show Password?" />
    <flat-button bg="var(--green)"
                 text="Sign In"
                 type="submit" />
    <flat-button ref="register"
                 text="Register"
                 type="submit"
                 @click.prevent="submit('register')" />
    <flat-button ref="guest"
                 text="Guest Login"
                 type="submit"
                 @click.prevent="$emit('guestLogin')" />

  </form>
</template>

<script lang="ts">
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import Checkbox from "@/components/ui/widgets/checkbox.vue";
import TextInput from "@/components/ui/widgets/text-input.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "login-form",
  components: { TextInput, Checkbox, FlatButton },
  emits: ["guestLogin", "login", "register"],
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    focus() {
      this.password = "";
      this.$refs.username.focus();
    },
    submit(type: "login" | "register") {
      this.showPassword = false;
      this.$emit(type, {
        username: this.username,
        password: this.password
      });
    }
  },
});
</script>

<style scoped>
.sign-in-form {
  display: grid;
  grid-row-gap: 16px;
  grid-template-areas:
    "first first"
    "second second"
    "third third"
    "fourth fourth"
    "fifth fifth"
    "sixth sixth";
}

.sign-in-form > *:first-child {
  grid-area: first;
}

.sign-in-form > *:nth-child(2) {
  grid-area: second;
}

.sign-in-form > *:nth-child(3) {
  grid-area: third;
  margin-left: auto;
  margin-right: auto;
}

.sign-in-form > *:nth-child(4) {
  grid-area: fourth;
}

.sign-in-form > *:nth-child(5) {
  grid-area: fifth;
}

.sign-in-form > *:nth-child(6) {
  grid-area: sixth;
}

@media (min-width: 768px) {
  .sign-in-form {
    width: min-content;
    margin-left: auto;
    margin-right: auto;
    grid-template-areas:
    "first second"
    "third third"
    "fourth fifth"
    "sixth sixth";
  }

  .sign-in-form > *:nth-child(3) {
    margin-right: unset;
  }

  .sign-in-form {
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 8px;
  }
}
</style>
