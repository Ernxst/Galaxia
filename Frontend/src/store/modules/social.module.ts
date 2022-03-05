import SocialService from "@/services/social.service";
import { ActionTree, GetterTree, MutationTree } from "vuex";


export interface SocialModuleState {

}

const state: SocialModuleState = {};

const getters = <GetterTree<SocialModuleState, any>>{};


const actions = <ActionTree<SocialModuleState, any>>{
  async fetchComments({ commit }, simulationID: number) {
    try {
      return await SocialService.instance().fetchComments(simulationID);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  async fetchLikes({ commit }, simulationID: number) {
    try {
      return await SocialService.instance().fetchLikes(simulationID);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  async like({ commit }, { simulationID, username, }) {
    try {
      return await SocialService.instance().like(simulationID, username);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  async unlike({ commit }, { simulationID, username, }) {
    try {
      return await SocialService.instance().unlike(simulationID, username);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  async newComment({ commit }, { simulationID, username, comment }) {
    try {
      return await SocialService.instance().comment(simulationID, username, comment);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  async deleteComment({ commit }, { simulationID, commentID }) {
    try {
      return await SocialService.instance().uncomment(simulationID, commentID);
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

const mutations = <MutationTree<SocialModuleState>>{};

export const social = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
