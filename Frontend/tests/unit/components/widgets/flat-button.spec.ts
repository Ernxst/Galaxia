import { FlatButton } from "@/components/ui/widgets";
import { mount } from "@vue/test-utils";


const defaultProps = {
  text: "",
  bg: "var(--main)",
  type: "button"
};

describe("flat-button.vue", () => {
  // HTML
  it("component mounted with correct template", () => {
    const wrapper = mount(FlatButton, {
      props: defaultProps
    });
    const flatButton = wrapper.find("button");
    const text = wrapper.find("button span");
    expect(flatButton.attributes().type).toEqual(defaultProps.type);
    expect(flatButton.attributes().style).toContain(defaultProps.bg);
    expect(text.text()).toEqual(defaultProps.text);
    wrapper.unmount();
  });

  // Public Interface
  it("emits click event on click", async () => {
    const wrapper = mount(FlatButton, {
      props: defaultProps
    });
    const button = wrapper.find("button");
    await button.trigger("click");
    expect(wrapper.emitted().click).toBeTruthy();
    wrapper.unmount();
  });

  it("emits click event on enter key press if focused", async () => {
    const wrapper = mount(FlatButton, {
      props: defaultProps
    });
    const button = wrapper.find("button");
    await button.trigger("focusin");
    await button.trigger("keyup.enter");
    expect(wrapper.emitted().click).toBeTruthy();
    wrapper.unmount();
  });

  it("emits mouseenter event on mouseenter", async () => {
    const wrapper = mount(FlatButton, {
      props: defaultProps
    });
    const button = wrapper.find("button");
    await button.trigger("mouseenter");
    expect(wrapper.emitted().mouseenter).toBeTruthy();
    expect(wrapper.vm.mouseEntered).toBe(true);
    wrapper.unmount();
  });

  it("emits mouseleave event on mouseleave", async () => {
    const wrapper = mount(FlatButton, {
      props: defaultProps
    });
    const button = wrapper.find("button");
    await button.trigger("mouseleave");
    expect(wrapper.emitted().mouseleave).toBeTruthy();
    expect(wrapper.vm.mouseEntered).toBe(false);
    wrapper.unmount();
  });

  it("can programmatically disable", async () => {
    const wrapper = mount(FlatButton, {
      props: defaultProps
    });
    await wrapper.vm.disable();
    const button = wrapper.find("button");
    expect(wrapper.vm.disabled).toBe(true);
    expect(button.attributes()["data-disabled"]).toEqual("true");
    wrapper.unmount();
  });

  it("can programmatically enable", async () => {
    const wrapper = mount(FlatButton, {
      props: defaultProps
    });
    await wrapper.vm.enable();
    const button = wrapper.find("button");
    expect(wrapper.vm.disabled).toBe(false);
    expect(button.attributes()["data-disabled"]).toEqual("false");
    wrapper.unmount();
  });
});
