import { VTooltip } from "@/components/ui/widgets";
import { mount } from "@vue/test-utils";


const parentComponent = {
  components: { VTooltip },
  template: '<div><p>Some text</p>  <v-tooltip text="AAAA" ></v-tooltip> </div>',
};

describe("v-tooltip.vue", () => {
  it("hovering on parent element should show tooltip", async () => {
    const wrapper = mount(parentComponent);
    const tooltip = wrapper.findComponent(VTooltip);
    await wrapper.trigger("mouseenter");
    expect(tooltip.isVisible()).toBe(true);
    expect(tooltip.attributes()).toHaveProperty("data-show");
    wrapper.unmount();
  });

  it("moving mouse off of parent element should hide tooltip", async () => {
    const wrapper = mount(parentComponent);
    const tooltip = wrapper.findComponent(VTooltip);
    await wrapper.trigger("mouseenter");
    await wrapper.trigger("mouseleave");
    expect(tooltip.attributes()).not.toHaveProperty("data-show");
    wrapper.unmount();
  });

  it("modifying placement prop should update tooltip", async () => {
    const component = {
      components: { VTooltip },
      data() {
        return {
          side: "left"
        };
      },
      template: '<div><p>Some text</p>  <v-tooltip text="AAAA" :side="side" ></v-tooltip> </div>',
    };
    const wrapper = mount(component);
    const tooltip = wrapper.findComponent(VTooltip);
    await wrapper.setData({ side: "right" });
    const attributes = tooltip.attributes();
    expect(attributes).toHaveProperty("data-popper-placement");
    expect(attributes["data-popper-placement"]).toBe("right");
  });
});
