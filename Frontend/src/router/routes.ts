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
        return "An interactive journey through space and time in three dimensions.";
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
        return "Sign into or register your Galaxia account.";
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
        return "Your dashboard.";
      },
      requiresAuth: true,
    },
  },
  {
    path: "/:username/explore",
    component: () => import("@/views/explore/Explore.vue"),
    name: "explore",
    props: true,
    meta: {
      title: (route: RouteLocationNormalized) => {
        return "Explore";
      },
      description: (route: RouteLocationNormalized) => {
        return "Select the type of celestial journey you'd like to go on.";
      },
      requiresAuth: true,
    },
  },
  {
    path: "/:username/explore/preset",
    component: () => import("@/views/explore/SelectPreset.vue"),
    name: "select-preset",
    props: true,
    meta: {
      title: (route: RouteLocationNormalized) => {
        return "Select Preset Simulation";
      },
      description: (route: RouteLocationNormalized) => {
        return "Explore the available preset simulations.";
      },
      requiresAuth: true,
    },
  },
  {
    path: "/:username/explore/build",
    component: () => import("@/views/create/BuildSimulation.vue"),
    name: "Build",
    props: true,
    meta: {
      title: (route: RouteLocationNormalized) => {
        return "Build Your Universe";
      },
      description: (route: RouteLocationNormalized) => {
        return "Build your own custom simulation.";
      },
      requiresAuth: true,
    },
  },
  {
    path: "/:username/:simulationID/simulate",
    component: () => import("@/views/simulate/Simulate.vue"),
    props: (route: RouteLocationNormalized) => ({
      username: route.params.username,
      simulationID: Number(route.params.simulationID)
    }),
    name: "simulate",
    meta: {
      title: async (route: RouteLocationNormalized) => {
        const id = Number(route.params.simulationID);
        const simulation = await store.dispatch("starSystem/fetchSimulation", id);
        return simulation.name;
      },
      description: async (route: RouteLocationNormalized) => {
        const id = Number(route.params.simulationID);
        const simulation = await store.dispatch("starSystem/fetchSimulation", id);
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
