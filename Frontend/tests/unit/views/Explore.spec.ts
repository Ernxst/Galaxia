import { key, store } from "@/store/store";
import Explore from "@/views/explore/Explore.vue";
import { mount } from "@vue/test-utils";
import { mockRouter } from "../../mocks/router.mock";
import { resetAuthServiceMock, setupAuthServiceMock, testUser } from "../../mocks/services/auth.service.mock";
import { resetSimulationServiceMock, setupSimulationServiceMock } from "../../mocks/services/simulation.service.mock";
import { addDivContainer } from "../../util/util";


const mockRoute = {
  name: "explore",
  path: `/${testUser.username}/explore`,
  params: {
    username: testUser.username
  }
};


describe("Explore.vue", () => {
  beforeAll(() => {
    setupAuthServiceMock();
    setupSimulationServiceMock();
  });

  afterAll(() => {
    resetAuthServiceMock();
    resetSimulationServiceMock();
  });

  const mountWrapper = () => {
    return mount(Explore, {
      props: { username: testUser.username },
      attachTo: addDivContainer(),
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
        },
        stubs: ['AppFooter'],
        plugins: [[store, key]]
      }
    });
  };

  it("mounted with correct template", () => {
    const wrapper = mountWrapper();
    wrapper.unmount();
  });

  it("navigates to select preset page on button click", async () => {
    const wrapper = mountWrapper();
    const button = wrapper.find("button");
    await button.trigger("click");
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "select-preset",
      params: {
        username: testUser.username
      }
    });
  });
});
