import { store } from "@/store/store";
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
    props:  (route: RouteLocationNormalized) => ({ simulationID: Number(route.params.simulationID) }),
    name: "simulate",
    meta: {
      title: (route: RouteLocationNormalized) => {
        const simulation = store.getters["starSystem/simulation"](route.params.simulationID);
        return simulation.name;
      },
      description: (route: RouteLocationNormalized) => {
        const simulation = store.getters["starSystem/simulation"](route.params.simulationID);
        return simulation.description;
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
