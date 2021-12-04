import { TextInput } from "@/components/ui/widgets";
import { mount } from "@vue/test-utils";


const defaultProps = {
  id: "username",
  name: "username-input",
  modelValue: "",
  label: "Username",
  required: true,
  type: "text",
  placeholder: "John Doe",
  autocomplete: "off",
  ignoreKeys: [] as string[],
  noSpaces: true,
};
const parentComponent = {
  components: { TextInput },
  data() {
    return {
      name: ""
    };
  },
  template: '<div> <text-input v-model="name" :ignore-keys="[`b`]"></text-input> </div>',
};

describe("text-input.vue", () => {
  // HTML
  it("component mounted with correct template", () => {
    const props = { ...defaultProps };
    props.noSpaces = false;
    const wrapper = mount(TextInput, {
      props
    });
    const input = wrapper.find("input");
    const inputAttrs = input.attributes();
    expect(inputAttrs.id).toEqual(props.id);
    expect(inputAttrs.placeholder).toEqual(props.placeholder);
    expect(inputAttrs.autocomplete).toEqual(props.autocomplete);
    expect(inputAttrs.type).toEqual(props.type);
    expect(inputAttrs.name).toEqual(props.name);
  });

  it("no label mounted if 'label' property undefined", () => {
    const { label, ...props } = defaultProps;
    const wrapper = mount(TextInput, {
      props
    });
    expect(wrapper.find("label").exists()).toBe(false);
    wrapper.unmount();
  });

  // Public Interface
  it("click focus", async () => {
    const wrapper = mount(TextInput, {
      props: defaultProps,
      attachTo: document.body
    });

    const inputEl = wrapper.find("input");
    await inputEl.trigger("focusin");

    const container = wrapper.find(".input-container");
    expect(container.attributes()["focused"]).toBe("true");
    wrapper.unmount();
  });

  it("programmatic focus", async () => {
    const wrapper = mount(TextInput, {
      props: defaultProps,
      attachTo: document.body
    });
    await wrapper.vm.focus();

    const container = wrapper.find(".input-container");
    expect(container.attributes()["focused"]).toBe("true");

    const inputEl = wrapper.find("input");
    expect(inputEl.element).toBe(document.activeElement);
    wrapper.unmount();
  });

  it("typing into input updates parent v-model", async () => {
    const wrapper = mount(parentComponent);
    const inputComponent = wrapper.findComponent(TextInput);
    const inputEl = wrapper.find("input");

    const newValue = "Ernest";
    await inputEl.setValue(newValue);

    expect(wrapper.vm.name).toEqual(newValue);
    expect(inputComponent.emitted()["update:modelValue"]).toBeTruthy();
    wrapper.unmount();
  });

  it("externally modifying v-model value updates the input value", async () => {
    const wrapper = mount(parentComponent);
    const inputEl = wrapper.find("input");
    const newValue = "Ernest";
    await wrapper.setData({ name: newValue });
    expect(inputEl.element.value).toEqual(newValue);
    wrapper.unmount();
  });

  it("shows close icon when text entered", async () => {
    const wrapper = mount(parentComponent);
    const inputContainer = wrapper.find(".text-input");
    await wrapper.setData({ name: "Ernest" });
    expect(inputContainer.attributes().empty).toBe("false");
    expect(wrapper.find(".icon-container").isVisible()).toBe(true);
    wrapper.unmount();
  });

  it("clicking close icon deletes text and updates external v-model", async () => {
    const wrapper = mount(parentComponent);
    const inputEl = wrapper.find("input");
    const closeBtn = wrapper.find(".delete-icon");
    await closeBtn.trigger("click");
    expect(wrapper.vm.name).toEqual("");
    expect(inputEl.element.value).toEqual("");
    wrapper.unmount();
  });

  it("doest not allow characters from ignore keys to be entered", async () => {
    const wrapper = mount(parentComponent);
    const newValue = "abc";
    const input = wrapper.find("input");
    await input.setValue(newValue);
    expect(input.element.value).toEqual("ac");
    wrapper.unmount();
  });

  it("emits submit event on enter key press", async () => {
    const wrapper = mount(TextInput, {
      props: defaultProps
    });
    const inputEl = wrapper.find("input");
    await inputEl.trigger("keyup.enter");
    expect(wrapper.emitted().submit).toBeTruthy();
    wrapper.unmount();
  });
});
