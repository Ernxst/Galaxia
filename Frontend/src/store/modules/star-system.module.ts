import { ActionTree, GetterTree, MutationTree } from "vuex";
import { solarSystem } from "@/services/star-system.service";
import { StarSystem } from "@/@types/celestial/containers/star-system";

export type StarSystems = { [key: string]: StarSystem };

export interface StarSystemModuleState {
  starSystems: StarSystems;
}

const state: StarSystemModuleState = {
  starSystems: {},
};

const getters = <GetterTree<StarSystemModuleState, any>>{
  starSystems: (state: StarSystemModuleState): StarSystems => {
    return state.starSystems;
  },
  starSystem: (
    state: StarSystemModuleState
  ): ((name: string) => StarSystem) => {
    return (name: string) => {
      return state.starSystems[name];
    };
  },
};

const actions = <ActionTree<StarSystemModuleState, any>>{
  async fetchAllStarSystems({ commit }) {
    const systems = { "Solar System": solarSystem };
    commit("setStarSystems", systems);
  },
  async fetchStarSystem({ commit }, name) {},
};

const mutations = <MutationTree<StarSystemModuleState>>{
  setStarSystems(state: StarSystemModuleState, starSystems: StarSystems) {
    state.starSystems = starSystems;
  },
  addStarSystem(state: StarSystemModuleState, starSystem: StarSystem) {
    state.starSystems[starSystem.name] = starSystem;
  },
};

export const starSystem = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
