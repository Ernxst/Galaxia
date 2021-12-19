import { StarSystem } from "@/@types/celestial/containers/star-system";
import { SimulationService, StarSystems } from "@/services/simulation.service";
import { ActionTree, Commit, GetterTree, MutationTree } from "vuex";


export interface StarSystemModuleState {
  presetSimulations: StarSystems;
  userSimulations: StarSystems;
}

const state: StarSystemModuleState = {
  presetSimulations: {},
  userSimulations: {},
};

const getters = <GetterTree<StarSystemModuleState, any>>{
  presetSimulations: (state: StarSystemModuleState): StarSystems => {
    return state.presetSimulations;
  },
  userSimulations: (state: StarSystemModuleState): StarSystems => {
    return state.userSimulations;
  },
  simulation: (state: StarSystemModuleState): ((id: number) => StarSystem) => {
    return (id: number) => {
      const preset = state.presetSimulations[id];
      if (preset) return preset;
      return state.userSimulations[id];
    };
  },
};

const fetchSimulations = async (commit: Commit, action: string,
                                simPromise: Promise<StarSystem[]>) => {
  try {
    const simulations = await simPromise;
    const map : StarSystems = {}
    for (const sim of simulations) map[sim.id] = sim;
    commit(action, map);
    return Promise.resolve(simulations);
  } catch (e) {
    return Promise.reject(e);
  }
};

const actions = <ActionTree<StarSystemModuleState, any>>{
  async fetchPresetSimulations({ commit }) {
    const systems = SimulationService.instance().presetSimulations();
    return fetchSimulations(commit, "setPresetSimulations", systems)
  },
};

const mutations = <MutationTree<StarSystemModuleState>>{
  setPresetSimulations(state: StarSystemModuleState, starSystems: StarSystems) {
    state.presetSimulations = starSystems;
  },
  setUserSimulations(state: StarSystemModuleState, starSystems: StarSystems) {
    state.userSimulations = starSystems;
  },
};

export const starSystem = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
