import { APP_TITLE, DEFAULT_DESCRIPTION } from "@/assets/util/util.constants";
import { nextTick } from "@vue/runtime-core";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";


const router = createRouter({
  history: createWebHistory(),
  routes,
});

const loggedIn = (): boolean => {
  return false;
};

router.beforeEach((to, from) => {
  return !(to.meta.requiresAuth && !loggedIn());
});

router.afterEach((to, from) => {
  nextTick(() => {
    const meta: any = to.meta;
    document.title = meta.title(to) + " — " + APP_TITLE;
    const desc = document.querySelector('head meta[name="description"]');
    const content: string = meta.description(to) || DEFAULT_DESCRIPTION;
    if (desc) desc.setAttribute("content", content);

    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }
  });
});

export default router;
