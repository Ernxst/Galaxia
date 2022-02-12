import { validateSimulation } from "@/views/create/util/simulation-validator";
import { CelestialBodyData, CelestialType, Simulation } from "@/views/create/util/types";
import { defaultStar } from "@/views/create/util/util";
import { MoonData } from "@/views/create/util/types";
import { cloneDeep } from "lodash-es";
import { ActionTree, GetterTree, MutationTree } from "vuex";


export interface SimulationModuleState {
  simulation: Simulation | null;
  modelToPreview: CelestialBodyData | null;
  modelType: CelestialType | null;
  moons: MoonData[];
  previewing: boolean;
}

const state: SimulationModuleState = {
  simulation: null,
  modelToPreview: defaultStar,
  modelType: "star",
  moons: [],
  previewing: false,
};

const getters = <GetterTree<SimulationModuleState, any>>{
  modelType: (state: SimulationModuleState): CelestialType | null => {
    return state.modelType;
  },
  modelToPreview: (state: SimulationModuleState): CelestialBodyData | null => {
    return state.modelToPreview;
  },
  previewing: (state: SimulationModuleState): Boolean => {
    return state.previewing;
  },
  simulation: (state: SimulationModuleState): Simulation | null => {
    return state.simulation;
  },
  validSimulation: (state: SimulationModuleState): boolean | string => {
    if (!state.simulation) return true;
    const { star, planets, asteroidBelts, name, description } = state.simulation;
    const moons = state.moons;
    return validateSimulation({ name, description }, star, planets, moons, asteroidBelts);
  },
  moons: (state: SimulationModuleState): MoonData[] => {
    return state.moons;
  },
};

const actions = <ActionTree<SimulationModuleState, any>>{
  reset({ commit }) {
    commit("setSimulation", null);
    commit("setPreviewing", false);
    commit("setModelToPreview", { model: defaultStar, type: "star" });
    commit("setMoons", []);
  }
};

const mutations = <MutationTree<SimulationModuleState>>{
  setSimulation(state: SimulationModuleState, simulation: Simulation | null) {
    state.simulation = cloneDeep(simulation);
  },
  setMoons(state: SimulationModuleState, moons: MoonData[]) {
    state.moons = cloneDeep(moons);
  },
  setModelToPreview(state: SimulationModuleState, {
    model,
    type
  }: { model: CelestialBodyData | null, type: CelestialType | null }) {
    state.modelToPreview = cloneDeep(model);
    state.modelType = type;
  },
  setModelType(state: SimulationModuleState, type: CelestialType | null) {
    state.modelType = type;
  },
  setPreviewing(state: SimulationModuleState, previewing: boolean) {
    state.previewing = previewing;
  }
};

export const simulation = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
