import SphericalForm from "@/views/create/builder/forms/spherical-form.vue";
import { mount } from "@vue/test-utils";
import { planetMock } from "../../../../mocks/types/planet.mock";


const parentComponent = {
  components: { SphericalForm },
  data() {
    return {
      planet: planetMock,
    };
  },
  template: `
    <div>
    <spherical-form v-model="planet"
                   :name="planet.name" />
    </div>`
};
describe("spherical-form.vue", () => {
  it("mounted", async () => {
    const wrapper = mount(parentComponent);
    wrapper.unmount();
  });
});
