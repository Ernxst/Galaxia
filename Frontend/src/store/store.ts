import { InjectionKey } from "vue";
import {
  createLogger,
  createStore,
  Store,
  useStore as baseUseStore,
} from "vuex";
import createPersistedState from "vuex-persistedstate";
import { starSystem } from "./modules/star-system.module";

// Plug in logger when in development environment
const debug = process.env.NODE_ENV !== "production";
const plugins = debug ? [createLogger({})] : [];

// Plug in session storage based persistence
plugins.push(createPersistedState({ storage: window.localStorage }));

// Define State here
export type State = {};
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  strict: process.env.NODE_ENV !== "production",
  plugins,
  modules: {
    starSystem,
  },
});

export function useStore() {
  return baseUseStore(key);
}
