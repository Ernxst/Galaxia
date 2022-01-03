import OrbitableForm from "@/views/create/builder/forms/orbitable-form.vue";
import { mount } from "@vue/test-utils";
import { planetMock } from "../../../../mocks/types/planet.mock";


const parentComponent = {
  components: { OrbitableForm },
  data() {
    return {
      planet: planetMock,
    };
  },
  template: `
    <div>
    <orbitable-form v-model="planet"
                    :name="planet.name"
                    type="planet" />
    </div>`
};
describe("orbitable-form.vue", () => {
  it("updating semi major should update semi minor", async () => {
    const wrapper = mount(parentComponent);
    const updated = { ...planetMock };
    updated.semiMajor = 20;
    await wrapper.setData({ planet: updated });
    const { semiMinor, eccentricity } = wrapper.vm.planet;
    const expectedSemiMinor = updated.semiMajor * (1 - eccentricity ** 2) ** 0.5;
    expect(semiMinor).toEqual(expectedSemiMinor);
  });

  it("updating eccentricity should update semi minor", async () => {
    const wrapper = mount(parentComponent);
    const updated = { ...planetMock };
    updated.eccentricity = 0.5;
    await wrapper.setData({ planet: updated });
    const { semiMinor, semiMajor } = wrapper.vm.planet;
    const expectedSemiMinor = semiMajor * (1 - updated.eccentricity ** 2) ** 0.5;
    expect(semiMinor).toEqual(expectedSemiMinor);
  });
});
