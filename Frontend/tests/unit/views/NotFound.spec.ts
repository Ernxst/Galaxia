import router from "@/router/router";
import { key, store } from "@/store/store";
import { App, NotFound } from "@/views";
import { flushPromises, mount } from "@vue/test-utils";
import { jwtToken, resetAuthServiceMock, setupAuthServiceMock, testUser } from "../../mocks/services/auth.service.mock";
import { addDivContainer } from "../../util/util";


describe("NotFound.vue", () => {
  beforeAll(() => {
    setupAuthServiceMock();
  });

  afterAll(() => {
    resetAuthServiceMock();
  });

  const mountWrapper = async () => {
    await router.push("/login");
    await router.isReady();

    const app = mount(App,
      {
        attachTo: addDivContainer(),
        global: {
          plugins: [[store, key], router]
        }
      });

    await store.commit("auth/authSuccess", { token: jwtToken, username: testUser.username });
    await router.push({ path: `/${testUser.username}/path` });
    return app.findComponent(NotFound);
  };

  it("resizes content on window resize", async () => {
    const wrapper = await mountWrapper();
    const spy = spyOn(wrapper.vm, "resize");
    window.dispatchEvent(new Event("resize"));
    await flushPromises();
    expect(spy).toHaveBeenCalled();
  });
});
