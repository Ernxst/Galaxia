import { Store } from "vuex";
import { State } from "./store/store";


declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
