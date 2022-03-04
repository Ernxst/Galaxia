import { StarSystem } from "@/@types/celestial/containers/star-system";
import { SimulationService, StarSystems } from "@/services/simulation.service";
import { SimulationData } from "@/views/create/util/types";
import { ActionTree, Commit, GetterTree, MutationTree } from "vuex";


export interface StarSystemModuleState {
  presetSimulations: StarSystems;
  userSimulations: StarSystems;
  cachedSimulation: StarSystem | null;
}

const state: StarSystemModuleState = {
  presetSimulations: {},
  userSimulations: {},
  cachedSimulation: null,
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
  cachedSimulation: (state: StarSystemModuleState): StarSystem | null => {
    return state.cachedSimulation
  }
};

const fetchSimulations = async (commit: Commit, action: string,
                                simPromise: Promise<StarSystem[]>) => {
  try {
    const simulations = await simPromise;
    const map: StarSystems = {};
    for (const sim of simulations) map[sim.id] = sim;
    commit(action, map);
    return Promise.resolve(simulations);
  } catch (e) {
    return Promise.reject(e);
  }
};

const actions = <ActionTree<StarSystemModuleState, any>>{
  async fetchSimulation({ commit }, simulationID: number) {
    try {
      const simulation = await SimulationService.instance().fetchSimulation(simulationID);
      return Promise.resolve(simulation);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  async fetchPresetSimulations({ commit }) {
    const systems = SimulationService.instance().presetSimulations();
    return fetchSimulations(commit, "setPresetSimulations", systems);
  },

  async fetchUserSimulations({ commit }) {
    const systems = SimulationService.instance().userSimulations();
    return fetchSimulations(commit, "setUserSimulations", systems);
  },

  async createSimulation({ commit }, simulation: SimulationData) {
    try {
      const id = await SimulationService.instance().createSimulation(simulation);
      return Promise.resolve(id);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  async updateSimulation({ commit }, simData: { simulationID: number, simulation: SimulationData }) {
    try {
      await SimulationService.instance().updateSimulation(simData.simulationID, simData.simulation);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

const mutations = <MutationTree<StarSystemModuleState>>{
  setPresetSimulations(state: StarSystemModuleState, starSystems: StarSystems) {
    state.presetSimulations = starSystems;
  },
  setUserSimulations(state: StarSystemModuleState, starSystems: StarSystems) {
    state.userSimulations = starSystems;
  },
  cacheSimulation(state: StarSystemModuleState, simulation: StarSystem | null) {
    state.cachedSimulation = simulation;
  }
};

export const starSystem = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
