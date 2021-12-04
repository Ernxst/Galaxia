import { Checkbox } from "@/components/ui/widgets";
import { mount } from "@vue/test-utils";


const defaultProps = {
  id: "selector",
  name: "selector",
  modelValue: false,
  label: "Selector",
  required: true,
};
const parentComponent = {
  components: { Checkbox },
  data() {
    return {
      selected: false
    };
  },
  template: '<div> <checkbox v-model="selected" id="aaa"></checkbox> </div>',
};

describe("checkbox.vue", () => {
  // HTML
  it("component mounted with correct template", () => {
    const wrapper = mount(Checkbox, {
      props: { ...defaultProps }
    });
    const checkbox = wrapper.find("input");
    const checkboxAttrs = checkbox.attributes();
    expect(checkboxAttrs.id).toEqual(defaultProps.id);
    expect(checkboxAttrs.name).toEqual(defaultProps.name);
    wrapper.unmount();
  });

  it("no label mounted if 'label' property undefined", () => {
    const { label, ...props } = defaultProps;
    const wrapper = mount(Checkbox, {
      props
    });
    expect(wrapper.find("label").exists()).toBe(false);
    wrapper.unmount();
  });

  // Public Interface
  it("clicking checkbox updates parent v-model", async () => {
    const wrapper = mount(parentComponent);
    const checkboxComponent = wrapper.findComponent(Checkbox);
    const checkboxEl = wrapper.find("input");

    await checkboxEl.trigger("input");
    expect(wrapper.vm.selected).toEqual(true);
    expect(checkboxComponent.emitted()["update:modelValue"]).toBeTruthy();
    wrapper.unmount();
  });

  it("externally modifying v-model value updates the checkbox value", async () => {
    const wrapper = mount(parentComponent);
    const checkboxEl = wrapper.find("input");
    const newValue = true;
    await wrapper.setData({ selected: newValue });
    expect(checkboxEl.element.value).toEqual(newValue.toString());
    wrapper.unmount();
  });

  it("can toggle with the enter key if focused", async () => {
    const wrapper = mount(parentComponent, {
      attachTo: document.body
    });
    const checkboxComponent = wrapper.findComponent(Checkbox);

    const container = wrapper.find(".icon-container");
    await container.trigger("focusin");

    await container.trigger("keyup.enter");
    expect(wrapper.vm.selected).toEqual(true);
    expect(checkboxComponent.emitted()["update:modelValue"]).toBeTruthy();
    wrapper.unmount();
  });
});
