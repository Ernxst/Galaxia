import { TextureMap } from "@/@types/app/texture-maps";
import { MediaService } from "@/services/media.service";
import { ActionTree, Commit, GetterTree, MutationTree } from "vuex";


export interface MediaModuleState {
  textures: TextureMap[];
  atmosphereTextures: TextureMap[];
  bumpMaps: TextureMap[];
  specularMaps: TextureMap[];
}

const state: MediaModuleState = {
  textures: [],
  atmosphereTextures: [],
  bumpMaps: [],
  specularMaps: [],
};

const getters = <GetterTree<MediaModuleState, any>>{
  textures: (state: MediaModuleState): TextureMap[] => {
    return state.textures;
  },
  atmosphereTextures: (state: MediaModuleState): TextureMap[] => {
    return state.atmosphereTextures;
  },
  bumpMaps: (state: MediaModuleState): TextureMap[] => {
    return state.bumpMaps;
  },
  specularMaps: (state: MediaModuleState): TextureMap[] => {
    return state.specularMaps;
  },
  texture: (state: MediaModuleState): ((id: number) => TextureMap | undefined) => {
    return (id: number) => (state.textures.find(e => e.id === id));
  },
  atmosphereTexture: (state: MediaModuleState): ((id: number) => TextureMap | undefined) => {
    return (id: number) => (state.atmosphereTextures.find(e => e.id === id));
  },
  bumpMap: (state: MediaModuleState): ((id: number) => TextureMap | undefined) => {
    return (id: number) => (state.bumpMaps.find(e => e.id === id));
  },
  specularMap: (state: MediaModuleState): ((id: number) => TextureMap | undefined) => {
    return (id: number) => (state.specularMaps.find(e => e.id === id));
  },
};

const fetchTextures = async (commit: Commit, action: string,
                             simPromise: Promise<TextureMap[]>) => {
  try {
    const textures = await simPromise;
    commit(action, textures);
    return Promise.resolve(textures);
  } catch (e) {
    return Promise.reject(e);
  }
};

const actions = <ActionTree<MediaModuleState, any>>{
  async fetchTextures({ commit }) {
    const textures = MediaService.instance().fetchAll("textures", "textures");
    return fetchTextures(commit, "setTextures", textures);
  },
  async fetchAtmosphereTextures({ commit }) {
    const textures = MediaService.instance().fetchAll("atmosphere_textures", "atmosphere_textures");
    return fetchTextures(commit, "setAtmosphereTextures", textures);
  },
  async fetchBumpMaps({ commit }) {
    const textures = MediaService.instance().fetchAll("bump_maps", "bump_maps");
    return fetchTextures(commit, "setBumpMaps", textures);
  },
  async fetchSpecularMaps({ commit }) {
    const textures = MediaService.instance().fetchAll("specular_maps", "specular_maps");
    return fetchTextures(commit, "setSpecularMaps", textures);
  },
};

const mutations = <MutationTree<MediaModuleState>>{
  setTextures(state: MediaModuleState, textures: TextureMap[]) {
    state.textures = textures;
  },
  setAtmosphereTextures(state: MediaModuleState, textures: TextureMap[]) {
    state.atmosphereTextures = textures;
  },
  setBumpMaps(state: MediaModuleState, textures: TextureMap[]) {
    state.bumpMaps = textures;
  },
  setSpecularMaps(state: MediaModuleState, textures: TextureMap[]) {
    state.specularMaps = textures;
  },
};

export const media = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
