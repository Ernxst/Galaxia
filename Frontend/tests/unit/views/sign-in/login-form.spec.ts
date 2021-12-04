import { LoginForm } from "@/views";
import { mount } from "@vue/test-utils";


describe("login-form.vue", () => {
  it("can modify form data by modifying v-model values", async () => {
    const wrapper = mount(LoginForm);
    const usernameInput = wrapper.find("input#username");
    const inputEl = usernameInput.element as HTMLInputElement;

    await wrapper.setData({ username: "Ernest" });
    expect(inputEl.value).toEqual("Ernest");

    await wrapper.setData({ username: "" });
    expect(inputEl.value).toEqual("");
    wrapper.unmount();
  });

  it("can toggle password visibility", async () => {
    const wrapper = mount(LoginForm);
    await wrapper.setData({ showPassword: true });

    const checkbox = wrapper.find("input#show-password");
    const checkboxEl = checkbox.element as HTMLInputElement;
    expect(checkboxEl.value).toEqual("true");

    const passwordInput = wrapper.find("#password");
    expect(passwordInput.attributes().type).toEqual("text");
    wrapper.unmount();
  });

  it("form submitted with correct data", async () => {
    const wrapper = mount(LoginForm);
    const form = {
      username: "Ernest",
      password: "12345"
    };

    await wrapper.setData({ ...form });
    await wrapper.vm.submit("login");
    expect(wrapper.vm.showPassword).toBe(false);
    expect(wrapper.emitted().login[0]).toEqual([form]);
    wrapper.unmount();
  });

  describe("when filling out the form ", () => {
    const div = document.createElement("div");
    div.id = "app";
    document.body.appendChild(div);
    const wrapper = mount(LoginForm, { attachTo: div });

    it("login event emitted on click", async () => {
      const button = wrapper.find("button");
      await button.trigger("click");
      expect(wrapper.emitted().login).toBeTruthy();
      expect(wrapper.emitted().login.length).toBe(1);
    });

    it("pressing enter submits login form", async () => {
      await wrapper.trigger("keyup.enter");
      expect(wrapper.emitted().login).toBeTruthy();
      expect(wrapper.emitted().login.length).toBe(1);
    });
  });


  it("register event emitted on register button click", async () => {
    const wrapper = mount(LoginForm);
    const buttonComponent = wrapper.findComponent({ ref: "register" });
    const button = buttonComponent.find("button");
    await button.trigger("click");
    expect(wrapper.emitted().register).toBeTruthy();
    expect(wrapper.emitted().register.length).toBe(1);
    wrapper.unmount();
  });

  it("guest login event emitted on guest login button click", async () => {
    const wrapper = mount(LoginForm);
    const buttonComponent = wrapper.findComponent({ ref: "guest" });
    const button = buttonComponent.find("button");
    await button.trigger("click");
    expect(wrapper.emitted().guestLogin).toBeTruthy();
    expect(wrapper.emitted().guestLogin.length).toBe(1);
    wrapper.unmount();
  });

  it("can programmatically focus", async () => {
    const wrapper = mount(LoginForm, {
      attachTo: document.body
    });
    await wrapper.vm.focus();
    expect(wrapper.vm.password).toEqual("");
    const usernameInput = wrapper.find("#username");
    expect(usernameInput.element).toBe(document.activeElement);
    wrapper.unmount();
  });
});
