import { Star } from "@/@types/celestial/star";
import { BuilderService } from "@/services/builder.service";
import { validateSimulation } from "@/views/create/util/simulation-validator";
import { AsteroidBeltData, MoonData, PlanetData, SimulationData, StarData } from "@/views/create/util/types";
import { ActionTree, GetterTree, MutationTree } from "vuex";


interface Simulation {
  textData: SimulationData;
  star: StarData | Star;
  planets: PlanetData[];
  moons: MoonData[];
  asteroidBelts: AsteroidBeltData[];
}

export interface BuilderModuleState {
  simulation: Simulation
}

const state: BuilderModuleState = {
  simulation: null,
};

const getters = <GetterTree<BuilderModuleState, any>>{
  validSimulation: (state: BuilderModuleState): boolean | string => {
    const { textData, star, planets, moons, asteroidBelts } = state.simulation;
    return validateSimulation(textData, star, planets, moons, asteroidBelts);
  },
  simulation: (state: BuilderModuleState): Simulation => {
    return state.simulation;
  }
};

const createCelestialBody = async (idPromise: Promise<number | void>) => {
  try {
    const id = await idPromise;
    return Promise.resolve(id);
  } catch (e) {
    return Promise.reject(e);
  }
};

const actions = <ActionTree<BuilderModuleState, any>>{
  async createStar({ commit }, payload: { simulationID: number, data: StarData }) {
    const idPromise = BuilderService.instance().createStarForSimulation(payload.simulationID, payload.data);
    return createCelestialBody(idPromise);
  },

  async updateStar({ commit }, payload: { simulationID: number, id: number, data: StarData }) {
    const { simulationID, id, data } = payload;
    const idPromise = BuilderService.instance().updateStar(simulationID, id, data);
    return createCelestialBody(idPromise);
  },

  async createPlanet({ commit }, payload: { simulationID: number, data: PlanetData }) {
    const idPromise = BuilderService.instance().createPlanetForSimulation(payload.simulationID, payload.data);
    return createCelestialBody(idPromise);
  },

  async updatePlanet({ commit }, payload: { simulationID: number, id: number, data: PlanetData }) {
    const { simulationID, id, data } = payload;
    const idPromise = BuilderService.instance().updatePlanet(simulationID, id, data);
    return createCelestialBody(idPromise);
  },

  async deletePlanet({ commit }, payload: { simulationID: number, id: number }) {
    const { simulationID, id } = payload;
    const idPromise = BuilderService.instance().deletePlanet(simulationID, id);
    return createCelestialBody(idPromise);
  },

  async createMoon({ commit }, payload: { simulationID: number, data: MoonData }) {
    const idPromise = BuilderService.instance().createMoonForSimulation(payload.simulationID, payload.data);
    return createCelestialBody(idPromise);
  },

  async updateMoon({ commit }, payload: { simulationID: number, id: number, data: MoonData }) {
    const { simulationID, id, data } = payload;
    const idPromise = BuilderService.instance().updateMoon(simulationID, id, data);
    return createCelestialBody(idPromise);
  },

  async deleteMoon({ commit }, payload: { simulationID: number, planetID: number, id: number }) {
    const { simulationID, planetID,  id } = payload;
    const idPromise = BuilderService.instance().deleteMoon(simulationID, planetID, id);
    return createCelestialBody(idPromise);
  },

  async createAsteroidBelt({ commit }, payload: { simulationID: number, data: AsteroidBeltData }) {
    const idPromise = BuilderService.instance().createAsteroidBeltForSimulation(payload.simulationID, payload.data);
    return createCelestialBody(idPromise);
  },

  async updateAsteroidBelt({ commit }, payload: { simulationID: number, id: number, data: AsteroidBeltData }) {
    const { simulationID, id, data } = payload;
    const idPromise = BuilderService.instance().updateAsteroidBelt(simulationID, id, data);
    return createCelestialBody(idPromise);
  },

  async deleteAsteroidBelt({ commit }, payload: { simulationID: number, id: number }) {
    const { simulationID, id } = payload;
    const idPromise = BuilderService.instance().deleteAsteroidBelt(simulationID, id);
    return createCelestialBody(idPromise);
  },
};

const mutations = <MutationTree<BuilderModuleState>>{
  setSimulation(state: BuilderModuleState, simulation: Simulation) {
    const { textData, star, planets, moons, asteroidBelts } = simulation;
    state.simulation = {
      textData: { ...textData }, star: { ...star },
      planets: planets.map(a => {
        return { ...a };
      }),
      moons: moons.map(a => {
        return { ...a };
      }),
      asteroidBelts: asteroidBelts.map(a => {
        return { ...a };
      }),
    };
  }
};

export const builder = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
