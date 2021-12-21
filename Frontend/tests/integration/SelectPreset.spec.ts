import router from "@/router/router";
import { key, store } from "@/store/store";
import { App } from "@/views";
import SelectPreset from "@/views/explore/SelectPreset.vue";
import { flushPromises, mount } from "@vue/test-utils";
import { mockRouter } from "../mocks/router.mock";
import { jwtToken, resetAuthServiceMock, setupAuthServiceMock, testUser } from "../mocks/services/auth.service.mock";
import { resetSimulationServiceMock, setupSimulationServiceMock } from "../mocks/services/simulation.service.mock";
import { addDivContainer } from "../util/util";


describe("Explore.vue", () => {
  beforeAll(() => {
    setupAuthServiceMock();
    setupSimulationServiceMock();
  });

  afterAll(() => {
    resetAuthServiceMock();
    resetSimulationServiceMock();
  });

  const mountWrapper = async () => {
    await router.push("/login");
    await router.isReady();

    const app = mount(App,
      {
        attachTo: addDivContainer(),
        global: {
          mocks: {
            $router: mockRouter
          },
          stubs: ["AppFooter", "RendererController"],
          plugins: [[store, key], router]
        }
      });

    const username = testUser.username;
    await store.commit("auth/authSuccess", { token: jwtToken, username });
    await router.push({ name: "select-preset", params: { username } });
    return app.findComponent(SelectPreset);
  };

  it("navigates to simulate page on select button click", async () => {
    const wrapper = await mountWrapper();
    const routerSpy = spyOn(router, "push");
    await flushPromises();

    const button = wrapper.find(".slot-container button");
    await button.trigger("click");

    expect(routerSpy).toHaveBeenCalledWith({
      name: "simulate",
      params: {
        username: testUser.username,
        simulationID: 0,
      }
    });
  });
});
