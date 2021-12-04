import { MenuButton } from "@/views";
import { mount } from "@vue/test-utils";
import { addDivContainer } from "../../../util/util";


const defaultProps = {
  text: "Explore",
  subtitle: "Lorem ipsum dolor",
  description: "Lorem ipsum dolor",
  image: "some-image"
};

const duration = 1150;

describe("menu-button.vue", () => {
  afterEach(() => {
      jest.useRealTimers();
    }
  );

  // HTML
  it("correct template", async () => {
    const wrapper = mount(MenuButton, {
      props: defaultProps
    });

    const image = wrapper.find("img");
    expect(image.attributes().alt).toEqual(defaultProps.text);
    expect(image.attributes().src).toEqual(defaultProps.image);

    const subtitle = wrapper.find(".subtitle");
    expect(subtitle.text()).toEqual(defaultProps.subtitle);

    const header = wrapper.find("h2");
    expect(header.text()).toEqual(defaultProps.text);

    const description = wrapper.find("p");
    expect(description.text()).toEqual(defaultProps.description);

    await wrapper.setData({ ready: true });
    expect(wrapper.vm.infoText).toEqual(`Release to continue to ${defaultProps.text}`)
    wrapper.unmount();
  });

  // Public Interface
  it("holding the mouse down until the button is ready should emit a click event", async () => {
    const wrapper = mount(MenuButton, {
      props: defaultProps,
      attachTo: addDivContainer(),
    });

    jest.useFakeTimers();
    const button = wrapper.find("a");
    await button.trigger("mousedown");
    jest.advanceTimersByTime(duration + 125);

    expect(wrapper.vm.ready).toBe(true);
    expect(wrapper.emitted().click).toBeTruthy();
    wrapper.unmount();
  });

  it("releasing the mouse after the button is ready but before the click event is emitted should do nothing", async () => {
    const wrapper = mount(MenuButton, {
      props: defaultProps
    });

    jest.useFakeTimers();
    const button = wrapper.find("a");
    await button.trigger("mousedown");
    jest.advanceTimersByTime(duration);
    await button.trigger("mouseup");

    expect(wrapper.vm.ready).toBe(false);
    expect(wrapper.emitted().click).not.toBeDefined();
    wrapper.unmount();
  });

  it("holding the mouse down and releasing the button before it is ready should do nothing", async () => {
    const wrapper = mount(MenuButton, {
      props: defaultProps
    });

    jest.useFakeTimers();
    const button = wrapper.find("a");
    await button.trigger("mousedown");
    jest.advanceTimersByTime(duration / 2);
    await button.trigger("mouseup");

    expect(wrapper.vm.ready).toBe(false);
    expect(wrapper.emitted().click).not.toBeDefined();
    wrapper.unmount();
  });

});
