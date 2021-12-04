import { LoginForm, SignIn } from "@/views";
import { mount } from "@vue/test-utils";
import { mockRouter } from "../../../mocks/router.mock";


const mockRoute = {
  name: "login",
  path: "/login",
};

const authRequest = {
  username: "Ernest",
  password: "12345",
};

const $store = {
  dispatch: jest.fn(),
  getters: {
    "auth/loggedIn": false,
    "auth/currentUsername": authRequest.username
  }
};

$store.dispatch.mockReturnValue(
  new Promise((resolve, reject) => {
    resolve("jwt-token");
  }));

describe("SignIn.vue", () => {
  beforeEach(() => {
    $store.dispatch.mockReset();
  });

  it("should route to home page if user is already logged in", async () => {
    const mockStore = { ...$store };
    mockStore.getters["auth/loggedIn"] = true;

    const wrapper = mount(SignIn, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
          $store: mockStore,
        },
        stubs: {
          AppFooter: true
        }
      }
    });

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "home",
      params: { username: mockStore.getters["auth/currentUsername"] }
    });
    mockStore.getters["auth/loggedIn"] = false;
    wrapper.unmount();
  });

  it("should dispatch login action on login event", async () => {
    const wrapper = mount(SignIn, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
          $store,
        },
        stubs: {
          AppFooter: true
        }
      }
    });

    const form = wrapper.findComponent(LoginForm);
    form.vm.$emit("login", authRequest);
    expect($store.dispatch).toHaveBeenCalledTimes(1);
    expect($store.dispatch).toHaveBeenCalledWith("auth/login", authRequest);
    wrapper.unmount();
  });

  it("should dispatch register action on register event", async () => {
    const wrapper = mount(SignIn, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
          $store,
        },
        stubs: {
          AppFooter: true
        }
      }
    });

    const form = wrapper.findComponent(LoginForm);
    await form.vm.$emit("register", authRequest);
    expect($store.dispatch).toHaveBeenCalledTimes(1);
    expect($store.dispatch).toHaveBeenCalledWith("auth/register", authRequest);
    wrapper.unmount();
  });

  it("should dispatch guestLogin action on guestLogin event", async () => {
    const wrapper = mount(SignIn, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
          $store,
        },
        stubs: {
          AppFooter: true
        }
      }
    });

    const form = wrapper.findComponent(LoginForm);
    form.vm.$emit("guestLogin");
    expect($store.dispatch).toHaveBeenCalledTimes(1);
    expect($store.dispatch).toHaveBeenCalledWith("auth/guestLogin", undefined);
    wrapper.unmount();
  });

  it("should navigate to homepage on auth success", async () => {
    const wrapper = mount(SignIn, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
          $store,
        },
        stubs: {
          AppFooter: true
        }
      }
    });

    const form = wrapper.findComponent(LoginForm);
    await form.vm.$emit("login", authRequest);
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "home",
      params: { username: $store.getters["auth/currentUsername"] }
    });
    wrapper.unmount();
  });

  it("should show error message, clear password input and focus on username input on error", async () => {
    const mockStore = { ...$store };
    const errorMsg = "Error";
    mockStore.dispatch.mockReturnValue(
      new Promise((resolve, reject) => {
        reject(errorMsg);
      }));

    const wrapper = mount(SignIn, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
          $store: mockStore,
        },
        stubs: {
          AppFooter: true
        },
      }
    });

    const form = wrapper.findComponent(LoginForm);
    await form.setData({ ...authRequest });
    await form.vm.$emit("login", authRequest);

    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(errorMsg);
    // @ts-ignore
    expect(form.vm.password).toEqual("");
    wrapper.unmount();
  });
});
