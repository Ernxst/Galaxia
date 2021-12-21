import { StarSystem } from "@/@types/celestial/containers/star-system";
import { Carousel, CarouselButton } from "@/components/ui/widgets";
import { mount } from "@vue/test-utils";
import { presetSimulationArray } from "../../../mocks/types/simulation.mock";
import { addDivContainer } from "../../../util/util";


describe("carousel.vue", () => {
  const defaultProps = {
    simulations: presetSimulationArray(3)
  };

  const mountWrapper = (props: { simulations: StarSystem[] }) => {
    return mount(Carousel, {
      attachTo: addDivContainer(),
      props: props,
      global: {
        stubs: ['RendererController']
      }
    });
  };

  it("component mounted with correct template", () => {
    const wrapper = mountWrapper(defaultProps);
    const indicators = wrapper.findAll(".indicators li");
    const length = defaultProps.simulations.length;
    expect(indicators).toHaveLength(length);
    wrapper.unmount();
  });

  it("should not show indicators and buttons if only 1 item is provided", () => {
    const props = { simulations: presetSimulationArray(1) };
    const wrapper = mountWrapper(props);
    const buttons = wrapper.findAllComponents(CarouselButton);
    expect(buttons).toHaveLength(0);
    const indicators = wrapper.findAll(".indicators li");
    expect(indicators).toHaveLength(0);
    wrapper.unmount();
  });

  it("clicking left button should move carousel left", async () => {
    const wrapper = mountWrapper(defaultProps);
    await wrapper.setData({ index: 1 });
    const button = wrapper.findComponent(CarouselButton);
    await button.trigger("click");
    expect(wrapper.vm.index).toEqual(0);
    wrapper.unmount();
  });

  it("clicking right button should move carousel right", async () => {
    const wrapper = mountWrapper(defaultProps);
    const buttons = wrapper.findAllComponents(CarouselButton);
    await buttons[1].trigger("click");
    expect(wrapper.vm.index).toEqual(1);
    wrapper.unmount();
  });

  it("clicking indicator should move carousel to the corresponding item", async () => {
    const wrapper = mountWrapper(defaultProps);
    const indicators = wrapper.findAll(".indicators li");
    await indicators[1].trigger("click");
    expect(wrapper.vm.index).toEqual(1);
    wrapper.unmount();
  });

  it("clicking select button should emit a click event with a simulation ID", async () => {
    const wrapper = mountWrapper(defaultProps);
    const button = wrapper.find(".slot-container button");
    await button.trigger("click");
    expect(wrapper.emitted().click[0]).toEqual([0]);
    wrapper.unmount();
  });

  it("should navigate left on left arrow key press", async () => {
    const wrapper = mountWrapper(defaultProps);
    await wrapper.setData({ index: 1 });
    await wrapper.trigger("keyup", { key: 'ArrowLeft' });
    expect(wrapper.vm.index).toEqual(0);
    wrapper.unmount();
  });

  it("should navigate right on right arrow key press", async () => {
    const wrapper = mountWrapper(defaultProps);
    await wrapper.trigger("keyup", { key: 'ArrowRight' });
    expect(wrapper.vm.index).toEqual(1);
    wrapper.unmount();
  });

  it("should select 2nd item if 2 key pressed", async () => {
    const wrapper = mountWrapper(defaultProps);
    await wrapper.trigger("keyup", { key: '2' });
    expect(wrapper.vm.index).toEqual(1);
    wrapper.unmount();
  });

  it("should wrap around to 0 if index > the number of items", async () => {
    const wrapper = mountWrapper(defaultProps);
    await wrapper.setData({ index: 2 });
    const buttons = wrapper.findAllComponents(CarouselButton);
    await buttons[1].trigger("click");
    expect(wrapper.vm.index).toEqual(0);
    wrapper.unmount();
  });

  it("should wrap around to the end if the index < 0", async () => {
    const wrapper = mountWrapper(defaultProps);
    const button = wrapper.findComponent(CarouselButton);
    await button.trigger("click");
    const index = defaultProps.simulations.length - 1;
    expect(wrapper.vm.index).toEqual(index);
    wrapper.unmount();
  });

  it("should do nothing if number pressed > number of items", async () => {
    const wrapper = mountWrapper(defaultProps);
    await wrapper.trigger("keyup", { key: '8' });
    expect(wrapper.vm.index).toEqual(0);
    wrapper.unmount();
  });

  it("should do nothing if the key pressed was not an arrow or number key", async () => {
    const wrapper = mountWrapper(defaultProps);
    await wrapper.trigger("keyup", { key: 'a' });
    expect(wrapper.vm.index).toEqual(0);
    wrapper.unmount();
  });
});
