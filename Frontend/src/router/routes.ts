import { RouteLocationNormalized } from "vue-router";

export const routes = [
  {
    path: "/",
    component: () => import("@/views/Simulate.vue"),
    name: "home",
    meta: {
      title: (route: RouteLocationNormalized) => {
        return "Home";
      },
      description: (route: RouteLocationNormalized) => {
        return ""; // TODO: Route description
      },
      requiresAuth: false,
    },
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("@/views/NotFound.vue"),
    name: "not-found",
    meta: {
      title: (route: RouteLocationNormalized) => {
        return "Beyond Farpoint";
      },
      description: (route: RouteLocationNormalized) => {
        return "The requested page could not be located.";
      },
    },
  },
];
