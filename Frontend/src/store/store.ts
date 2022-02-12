import { auth, AuthState } from "@/store/modules/auth.module";
import { builder, BuilderModuleState } from "@/store/modules/builder.module";
import { media, MediaModuleState } from "@/store/modules/media.module";
import { simulation } from "@/store/modules/simulation.module";
import { starSystem, StarSystemModuleState } from "@/store/modules/star-system.module";
import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore, } from "vuex";
import createPersistedState from "vuex-persistedstate";

// Plug in logger when in development environment
// const debug = process.env.NODE_ENV !== "production";
// const plugins = debug ? [createLogger({})] : [];
const plugins = [];

// Plug in session storage based persistence
plugins.push(createPersistedState({ storage: window.localStorage }));

// Define State here
export type State = AuthState & StarSystemModuleState & MediaModuleState & BuilderModuleState;
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  strict: process.env.NODE_ENV !== "production",
  plugins,
  modules: {
    starSystem,
    auth,
    media,
    builder,
    simulation,
  },
});

export function useStore() {
  return baseUseStore(key);
}
