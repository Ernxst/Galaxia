import { Slider } from "@/components/ui/widgets";
import { mount } from "@vue/test-utils";


const defaultProps = {
  id: "slider",
  min: 1,
  max: 75,
  name: "slider",
  orient: "horizontal",
  modelValue: 0,
  label: "slider",
  showLimits: true,
  step: 2,
};
const parentComponent = {
  components: { Slider },
  data() {
    return {
      value: 0
    };
  },
  template: '<div> <slider v-model="value" id="aaa"></slider> </div>',
};

describe("slider.vue", () => {
  // Template
  it("component mounted with correct template", () => {
    const props = { ...defaultProps };
    const wrapper = mount(Slider, {
      props
    });
    expect(wrapper.attributes()["data-orient"]).toEqual(defaultProps.orient);

    const label = wrapper.find("label");
    expect(label.text()).toEqual(props.label);

    const input = wrapper.find("input");
    const inputAttrs = input.attributes();
    expect(inputAttrs.id).toEqual(props.id);
    expect(inputAttrs.min).toEqual(props.min.toString());
    expect(inputAttrs.max).toEqual(props.max.toString());
    expect(inputAttrs.step).toEqual(props.step.toString());
    expect(inputAttrs.name).toEqual(props.name);

    const value = wrapper.find("p");
    expect(value.attributes().for).toEqual(props.id);
    expect(value.text()).toEqual(props.modelValue.toString());

    const min = wrapper.find("span:first-child");
    expect(min.text()).toEqual(props.min.toString());

    const max = wrapper.find("span:last-child");
    expect(max.text()).toEqual(props.max.toString());

    expect(wrapper.vm.range).toEqual(props.max - props.min);
    wrapper.unmount();
  });

  it("slider label not mounted if label prop is undefined", () => {
    const { label, ...props } = { ...defaultProps };
    const wrapper = mount(Slider, {
      props
    });
    expect(wrapper.find("label").exists()).toBe(false);
    wrapper.unmount();
  });

  it("limit labels not mounted when showLimit is false", () => {
    const props = { ...defaultProps };
    props.showLimits = false;
    const wrapper = mount(Slider, {
      props
    });
    expect(wrapper.find("span").exists()).toBe(false);
    wrapper.unmount();
  });

  // Public API
  it("updating slider value updates indicator", async () => {
    const wrapper = mount(parentComponent);
    const indicator = wrapper.find("p");
    const slider = wrapper.find("input");

    const newValue = 70;
    await slider.setValue(newValue);
    expect(indicator.text()).toEqual(newValue.toString());
    wrapper.unmount();
  });

  it("dragging slider updates parent v-model", async () => {
    const wrapper = mount(parentComponent);
    const inputComponent = wrapper.findComponent(Slider);
    const slider = wrapper.find("input");

    const newValue = 70;
    await slider.setValue(newValue);

    expect(wrapper.vm.value).toEqual(newValue);
    expect(inputComponent.emitted()["update:modelValue"]).toBeTruthy();
    wrapper.unmount();
  });

  it("externally modifying v-model value updates the slider value", async () => {
    const wrapper = mount(parentComponent);
    const inputEl = wrapper.find("input");
    const newValue = 30;
    await wrapper.setData({ value: newValue });
    expect(inputEl.element.value).toEqual(newValue.toString());
    wrapper.unmount();
  });

  it("calls update to slider position on window resize", async () => {
    const wrapper = mount(Slider, {
      props: defaultProps,
      attachTo: document.body
    });
    const spy = spyOn(wrapper.vm, "updateSliderPos");
    window.dispatchEvent(new Event("resize"));
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalled();
    wrapper.unmount();
  });
});
