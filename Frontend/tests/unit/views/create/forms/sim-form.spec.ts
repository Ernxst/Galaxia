import SimForm from "@/views/create/builder/forms/sim-form.vue";
import { mount } from "@vue/test-utils";


const parentComponent = {
  components: { SimForm },
  data() {
    return {
      sim: { name: "", description: "" },
    };
  },
  template: `
    <div>
    <sim-form v-model="sim" />
    </div>`
};
describe("sim-form.vue", () => {
  it("mounted", async () => {
    const wrapper = mount(parentComponent);
    wrapper.unmount();
  });
});
