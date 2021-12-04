import { CircleButton } from "@/components/ui/widgets";
import { mount } from "@vue/test-utils";


const defaultProps = {
  radius: 16,
  ringScale: 0.8,
  text: "",
  bg: "var(--main)",
  type: "button"
};

describe("circle-button.vue", () => {
  // HTML
  it("component mounted with correct template", () => {
    const wrapper = mount(CircleButton, {
      props: defaultProps
    });
    const diameter = defaultProps.radius * 2;
    expect(wrapper.attributes().style).toContain(`--diameter: ${diameter}px`);
    expect(wrapper.attributes().style).toContain(`--ring-scale: ${defaultProps.ringScale}`);

    const button = wrapper.find("button");
    const text = wrapper.find("button span");
    expect(button.attributes().type).toEqual(defaultProps.type);
    expect(text.text()).toEqual(defaultProps.text);

    const circle = wrapper.find("circle");
    const circleAttrs = circle.attributes();
    const ringRadius = wrapper.vm.ringRadius.toString();
    expect(circleAttrs.cx).toEqual(ringRadius);
    expect(circleAttrs.cx).toEqual(ringRadius);
    expect(circleAttrs.cy).toEqual(ringRadius);
    expect(circleAttrs.transform).toEqual(`rotate(-90 ${ringRadius} ${ringRadius})`);
    wrapper.unmount();
  });

  // Public Interface
  it("sets data-mouse attribute to true on mouse enter", async () => {
    const wrapper = mount(CircleButton, {
      props: defaultProps
    });
    const button = wrapper.find("button");
    const svg = wrapper.find("svg");
    await button.trigger("mouseenter");
    expect(svg.attributes()["data-mouse"]).toEqual("true");
    wrapper.unmount();
  });

  it("sets data-mouse attribute to false on mouse leave", async () => {
    const wrapper = mount(CircleButton, {
      props: defaultProps
    });
    const button = wrapper.find("button");
    const svg = wrapper.find("svg");
    await button.trigger("mouseleave");
    expect(svg.attributes()["data-mouse"]).toEqual("false");
    wrapper.unmount();
  });
});
