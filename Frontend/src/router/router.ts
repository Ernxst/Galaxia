import { APP_TITLE, DEFAULT_DESCRIPTION } from "@/assets/util/util.constants";
import { store } from "@/store/store";
import { nextTick } from "@vue/runtime-core";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";


const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from): string | void => {
  const canAccess = !(to.meta.requiresAuth && !store.getters["auth/loggedIn"]);
  if (!canAccess) return "/login";
});

router.afterEach((to, from) => {
  nextTick(async () => {
    const meta: any = to.meta;
    document.title = await meta.title(to) + " — " + APP_TITLE;
    const desc = document.querySelector('head meta[name="description"]');
    const content: string = await meta.description(to) || DEFAULT_DESCRIPTION;
    if (desc) desc.setAttribute("content", content);

    const selection = window.getSelection();
    if (selection) selection.removeAllRanges();
  });
});

export default router;
