import { RouteLocationNormalized } from "vue-router";


export const routes = [
  {
    path: "/",
    component: () => import("@/views/welcome/Welcome.vue"),
    name: "welcome",
    meta: {
      title: (route: RouteLocationNormalized) => {
        return "Welcome";
      },
      description: (route: RouteLocationNormalized) => {
        return "";
      },
      requiresAuth: false,
    },
  },
  {
    path: "/login",
    component: () => import("@/views/sign-in/SignIn.vue"),
    name: "login",
    meta: {
      title: (route: RouteLocationNormalized) => {
        return "Sign In";
      },
      description: (route: RouteLocationNormalized) => {
        return "";
      },
      requiresAuth: false,
    },
  },
  {
    path: "/:username",
    component: () => import("@/views/home/Home.vue"),
    name: "home",
    props: true,
    meta: {
      title: (route: RouteLocationNormalized) => {
        return "Home";
      },
      description: (route: RouteLocationNormalized) => {
        return "";
      },
      requiresAuth: true,
    },
  },
  {
    path: "/:username/:simulationID/simulate",
    component: () => import("@/views/simulate/Simulate.vue"),
    props: true,
    name: "simulate",
    meta: {
      title: (route: RouteLocationNormalized) => {
        const id = route.params.id;
        return "Solar System"; // TODO: get from store by ID
      },
      description: (route: RouteLocationNormalized) => {
        const id = route.params.id;
        return "The Solar System"; // TODO: get from store by ID
      },
      requiresAuth: true,
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
