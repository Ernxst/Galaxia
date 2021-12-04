import router from "@/router/router";
import { key, store } from "@/store/store";
import { App, Home, MenuButton } from "@/views";
import { flushPromises, mount } from "@vue/test-utils";
import {
  jwtToken,
  resetAuthServiceMock,
  setupAuthServiceMock,
  testUser
} from "../mocks/services/auth.service.mock";
import { addDivContainer } from "../util/util";


// TODO: Add tests for other pages when added
describe("Home.vue", () => {
  beforeAll(() => {
    setupAuthServiceMock();
  });

  afterAll(() => {
    resetAuthServiceMock();
  });

  const mountWrapper = async (username: string) => {
    await router.push("/login");
    await router.isReady();

    const app = mount(App,
      {
        attachTo: addDivContainer(),
        global: {
          plugins: [[store, key], router]
        }
      });

    await store.commit("auth/authSuccess", { token: jwtToken, username });
    await router.push({ name: "home", params: { username } });
    return app.findComponent(Home);
  };

  it("correct template", async () => {
    const wrapper = await mountWrapper(testUser.username);
    expect(wrapper.vm.isGuest).toBe(false);

    const subtitle = wrapper.find(".page-subtitle");
    const message = `Welcome to Galaxia, ${testUser.username}. You are currently at the main menu. Please choose an option below to continue.`;
    expect(subtitle.text()).toEqual(message);
  });

  it("correct template as guest", async () => {
    const wrapper = await mountWrapper("guest");
    expect(wrapper.vm.isGuest).toBe(true);

    const subtitle = wrapper.find(".page-subtitle");
    const message = "Welcome to Galaxia. You are currently using a guest account allowing you to create simulations. Please log into or register a new account to save and/or share any simulations. You are currently at the main menu. Please choose an option below to continue.";
    expect(subtitle.text()).toEqual(message);
  });

  it("clicking explore button should change page", async () => {
    const wrapper = await mountWrapper(testUser.username);
    const button = wrapper.findComponent(MenuButton);
    const routerSpy = spyOn(router, "push");

    await button.vm.$emit("click");
    await flushPromises();
    expect(routerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "simulate",
        params: {
          username: testUser.username,
          simulationID: expect.any(String)
        }
      }));
  });

  it("clicking logout button should log user out and change to sign in page.", async () => {
    const wrapper = await mountWrapper(testUser.username);
    const logoutBtn = wrapper.find("button");
    const storeSpy = spyOn(store, "dispatch");
    const routerSpy = spyOn(router, "push");

    await logoutBtn.trigger("click");
    await flushPromises();
    expect(storeSpy).toHaveBeenCalledWith("auth/logout");
    expect(routerSpy).toHaveBeenCalledWith({ name: "login" });
  });
});
