import App from "@/App.vue";

import "@/assets/stylesheets/animations.css";
import "@/assets/stylesheets/base.css";
import "@/assets/stylesheets/colours.css";
import "@/assets/stylesheets/constants.css";
import "@/assets/stylesheets/global.css";
import "@/assets/stylesheets/util.css";

import router from "@/router/router";
import { key, store } from "@/store/store";
import { createApp } from "vue";


const app = createApp(App);
app.use(router);
app.use(store, key);
app.mount("#app");
