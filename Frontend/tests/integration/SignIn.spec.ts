import { AuthRequest, AuthSuccessResponse } from "@/services/auth.service";
import { getTokenFromStorage } from "@/services/jwt.service";
import { key, store } from "@/store/store";
import SignIn from "@/views/sign-in/SignIn.vue";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";
import { ComponentPublicInstance } from "vue";
import { mockRouter } from "../mocks/router.mock";
import {
  authSuccessResponse,
  genericErrorRequest,
  genericErrorResponse,
  guestLoginRequest,
  invalidLoginRequest,
  invalidParametersResponse, resetAuthServiceMock, setupAuthServiceMock,
  validLoginRequest,
  wrongPasswordLoginRequest,
  wrongPasswordLoginResponse,
  wrongUsernameLoginRequest,
  wrongUsernameLoginResponse
} from "../mocks/services/auth.service.mock";
import { addDivContainer } from "../util/util";


const mockRoute = {
  name: "login",
  path: "/login",
};

describe("SignIn.vue - user authentication", () => {
  beforeAll(() => {
    setupAuthServiceMock();
  });

  afterAll(() => {
    resetAuthServiceMock();
  });

  const mountWrapper = () => {
    return mount(SignIn,
      {
        attachTo: addDivContainer(),
        global: {
          stubs: {
            AppFooter: true,
          },
          mocks: {
            $route: mockRoute,
            $router: mockRouter
          },
          plugins: [[store, key]]
        }
      });
  };

  const submitForm = async (wrapper: VueWrapper<ComponentPublicInstance>,
                            type: "login" | "register" | "guest", formData?: AuthRequest) => {
    const form = wrapper.findComponent({ ref: "form" });
    if (formData) await form.setData({ ...formData });
    const component = type === "login" ? form : form.findComponent({ ref: type });
    const button = component.find("button");
    await button.trigger("click");
  };

  const testValidAuth = async (type: "login" | "register" | "guest", payload: AuthRequest,
                               response: AuthSuccessResponse) => {
    const spy = jest.spyOn(mockRouter, "push");
    const wrapper = mountWrapper();
    await submitForm(wrapper, type, payload);
    await flushPromises();

    const username = payload.username;
    expect(store.getters["auth/currentUsername"]).toEqual(username);
    expect(store.getters["auth/loggedIn"]).toBe(true);
    expect(response.token).toEqual(getTokenFromStorage());

    expect(spy).toHaveBeenCalledWith({
      name: "home",
      params: { username }
    });

    wrapper.unmount();
  };

  it("can login", async () => {
    await testValidAuth("login", validLoginRequest, authSuccessResponse);
  });

  it("can register", async () => {
    await testValidAuth("register", validLoginRequest, authSuccessResponse);
  });

  it("can login as guest", async () => {
    await store.dispatch("auth/fetchGuestUsername");
    await testValidAuth("guest", guestLoginRequest, authSuccessResponse);
  });

  it("shows error message on invalid login parameters", async () => {
    const wrapper = mountWrapper();
    await submitForm(wrapper, "login", invalidLoginRequest);
    await flushPromises();
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(invalidParametersResponse.error);
    wrapper.unmount();
  });

  it("shows error message on wrong username ", async () => {
    const wrapper = mountWrapper();
    await submitForm(wrapper, "login", wrongUsernameLoginRequest);
    await flushPromises();
    expect(window.alert).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(window.alert).toHaveBeenCalledWith(wrongUsernameLoginResponse.errors.username[0]);
    wrapper.unmount();
  });

  it("shows error message on wrong password ", async () => {
    const wrapper = mountWrapper();
    await submitForm(wrapper, "login", wrongPasswordLoginRequest);
    await flushPromises();
    expect(window.alert).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(window.alert).toHaveBeenCalledWith(wrongPasswordLoginResponse.errors.password[0]);
    wrapper.unmount();
  });

  it("shows generic error if api not running", async () => {
    const wrapper = mountWrapper();
    await submitForm(wrapper, "login", genericErrorRequest);
    await flushPromises();
    expect(window.alert).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(window.alert).toHaveBeenCalledWith(genericErrorResponse.error);
    wrapper.unmount();
  });

  it("can logout", async () => {
    await testValidAuth("login", validLoginRequest, authSuccessResponse);
    await store.dispatch("auth/logout");
  })
});
