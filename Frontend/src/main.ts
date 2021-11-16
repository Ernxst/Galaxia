import App from "@/App.vue";
import "@/assets/global.css";
import router from "@/router/router";
import { key, store } from "@/store/store";
import { createApp } from "vue";


const app = createApp(App);
app.use(router);
app.use(store, key);
app.mount("#app");
