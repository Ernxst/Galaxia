import { APP_TITLE, DEFAULT_DESCRIPTION } from "@/assets/util/util.constants";
import { nextTick } from "@vue/runtime-core";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";


const router = createRouter({
  history: createWebHistory(),
  routes,
});

// TODO: Check login status
const loggedIn = (): boolean => {
  return false;
};

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !loggedIn()) {
    next({
      path: "/welcome",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

router.afterEach((to, _) => {
  nextTick(() => {
    const meta: any = to.meta;
    document.title = meta.title(to) + " — " + APP_TITLE;
    const desc = document.querySelector('head meta[name="description"]');
    const content: string = meta.description(to) || DEFAULT_DESCRIPTION;
    if (desc) desc.setAttribute("content", content);
  });
});

export default router;
