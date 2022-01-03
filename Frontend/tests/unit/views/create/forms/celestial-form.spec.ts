import CelestialForm from "@/views/create/builder/forms/celestial-form.vue";
import { mount } from "@vue/test-utils";
import { planetMock } from "../../../../mocks/types/planet.mock";


const parentComponent = {
  components: { CelestialForm },
  data() {
    return {
      planet: planetMock,
    };
  },
  template: `
    <div>
    <celestial-form v-model="planet"
                    :name="planet.name" />
    </div>`
};
describe("celestial-form.vue", () => {
  it("mounted", async () => {
    const wrapper = mount(parentComponent);
    wrapper.unmount();
  });
});
