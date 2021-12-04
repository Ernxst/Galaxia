import AuthService, { AuthRequest } from "@/services/auth.service";
import { getTokenFromStorage, getUserIdFromStorage, removeJwtToken, setJwtToken } from "@/services/jwt.service";
import { ActionTree, Commit, GetterTree, MutationTree } from "vuex";


export interface AuthState {
  token: string | null;
  currentUsername: string;
  guestUsername: string;
}

const baseState = { guestUsername: "guest", currentUsername: "" };
const token = getTokenFromStorage();
const state: AuthState = token
  ? { token, ...baseState }
  : { token: null, ...baseState };

const getters = <GetterTree<AuthState, any>>{
  loggedIn: (): boolean => {
    return getUserIdFromStorage() !== undefined;
  },
  guestUsername: (state: AuthState): string => {
    return state.guestUsername;
  },
  currentUsername: (state: AuthState): string => {
    return state.currentUsername;
  }
};

const authenticate = async (commit: Commit, tokenPromise: Promise<string>, username: string) => {
  try {
    const token = await tokenPromise;
    commit("authSuccess", { token, username });
    return Promise.resolve(token);
  } catch (e) {
    commit("authFailure");
    return Promise.reject(e);
  }
};

const actions = <ActionTree<AuthState, any>>{
  async fetchGuestUsername({ commit }: { commit: Commit }) {
    return AuthService.guestUsername()
      .then((guestUsername: string) => {
        commit("setGuestUsername", guestUsername);
        return Promise.resolve("Success");
      })
      .catch((error: string) => {
        return Promise.reject(error);
      });
  },

  guestLogin({ commit, getters }: { commit: Commit; getters: any }) {
    const username = getters.guestUsername;
    const tokenPromise = AuthService.guestLogin(username);
    return authenticate(commit, tokenPromise, username);
  },

  login({ commit }: { commit: Commit }, user: AuthRequest) {
    const tokenPromise = AuthService.login(user);
    return authenticate(commit, tokenPromise, user.username);
  },

  register({ commit }: { commit: Commit }, user: AuthRequest) {
    const tokenPromise = AuthService.register(user);
    return authenticate(commit, tokenPromise, user.username);
  },

  async logout({ commit }: { commit: Commit }) {
    return AuthService.logout()
      .then((message: string) => {
        commit("logout");
        return Promise.resolve(message);
      })
      .catch((error: string) => {
        return Promise.reject(error);
      });
  },
};

const mutations = <MutationTree<AuthState>>{
  setGuestUsername(state: AuthState, guestUsername: string) {
    state.guestUsername = guestUsername;
  },
  authSuccess(state: AuthState, { token, username }: { token: string, username: string }) {
    setJwtToken(token);
    state.currentUsername = username;
    state.token = token;
  },
  authFailure(state: AuthState) {
    state.token = null;
  },
  logout(state: AuthState) {
    removeJwtToken();
    state.token = null;
  },
};

export const auth = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
