import AsteroidForm from "@/views/create/builder/forms/asteroid-form.vue";
import { mount } from "@vue/test-utils";
import { asteroidBeltMock } from "../../../../mocks/types/asteroid-belt.mock";


const parentComponent = {
  components: { AsteroidForm },
  data() {
    return {
      asteroidBelt: asteroidBeltMock,
    };
  },
  template: `
    <div>
    <asteroid-form v-model="asteroidBelt"
                   :name="asteroidBelt.name" />
    </div>`
};
describe("asteroid-form.vue", () => {
  it("should not allow inner semi major to be greater than outer semi major", async () => {
    const wrapper = mount(parentComponent);
    const updated = { ...asteroidBeltMock };
    updated.innerSemiMajor = 28;
    await wrapper.setData({ asteroidBelt: updated });
    const { innerSemiMajor, outerSemiMajor } = wrapper.vm.asteroidBelt;
    expect(outerSemiMajor).toEqual(innerSemiMajor);
  });

  it("should not allow outer semi major to be less than inner semi major", async () => {
    const wrapper = mount(parentComponent);
    const updated = { ...asteroidBeltMock };
    updated.innerSemiMajor = 0.8;
    updated.outerSemiMajor = 0.6;
    await wrapper.setData({ asteroidBelt: updated });
    const { innerSemiMajor, outerSemiMajor } = wrapper.vm.asteroidBelt;
    expect(innerSemiMajor).toEqual(outerSemiMajor);
  });
});
