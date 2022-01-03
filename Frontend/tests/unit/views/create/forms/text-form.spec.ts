import TextForm from "@/views/create/builder/forms/text-form.vue";
import { mount } from "@vue/test-utils";
import { planetMock } from "../../../../mocks/types/planet.mock";


const parentComponent = {
  components: { TextForm },
  data() {
    return {
      planet: planetMock,
    };
  },
  template: `
    <div>
    <text-form v-model="planet"
                    :name="planet.name" />
    </div>`
};
describe("text-form.vue", () => {
  it("mounted", async () => {
    const wrapper = mount(parentComponent);
    wrapper.unmount();
  });
});
