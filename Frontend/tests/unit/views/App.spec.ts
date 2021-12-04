import { key, store } from "@/store/store";
import { App } from "@/views";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { resetAuthServiceMock, setupAuthServiceMock } from "../../mocks/services/auth.service.mock";
import { addDivContainer } from "../../util/util";


const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/login", name: "component", component: App }]
});

describe("App.vue", () => {
  beforeAll(() => {
    setupAuthServiceMock();
  });

  afterAll(() => {
    resetAuthServiceMock();
  });

  const mountWrapper = async () => {
    await router.push("/login");
    await router.isReady();

    return shallowMount(App, {
      attachTo: addDivContainer(),
      global: {
        plugins: [[store, key], router]
      }
    });
  };

  it("scrolls to hash ID on route change", async () => {
    const wrapper = await mountWrapper();
    const scrollSpy = spyOn(window, "scrollTo");

    const app = document.getElementById("app");
    const elem = document.createElement("div");
    elem.id = "element";
    // @ts-ignore
    app.appendChild(elem);

    await wrapper.vm.$router.replace({
      path: "/login",
      hash: `#${elem.id}`
    });
    await wrapper.vm.$nextTick();
    await flushPromises();

    expect(scrollSpy).toHaveBeenCalled();
  });

  it("should abort if element with id does not exist", async () => {
    const wrapper = await mountWrapper();
    const spy = spyOn(wrapper.vm, "scrollToId");
    const scrollSpy = spyOn(window, "scrollTo");

    await wrapper.vm.$router.replace({
      path: "/login",
      hash: "#some-id"
    });
    await flushPromises();

    expect(spy).toHaveBeenCalledWith("some-id");
    expect(scrollSpy).not.toHaveBeenCalled();
  });
});
