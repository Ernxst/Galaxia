<template>
  <base-builder :buttons="false"
                :data="data"
                :editing="editing"
                :simulation-id="simulationId"
                type="star"
                @back="$emit('back')"
                @next="$emit('next')">
    <text-form v-model="data"
               :type="type" />
    <celestial-form v-model="data"
                    :type="type" />
    <spherical-form v-if="spherical"
                    v-model="data"
                    :type="type" />
    <orbitable-form v-if="orbitable"
                    v-model="data"
                    :type="type" />
    <textured-form v-if="textured"
                   v-model="data"
                   :type="type" />
    <asteroid-form v-if="!notAsteroid"
                   v-model="data" />
  </base-builder>
</template>

<script lang="ts">
import BaseBuilder from "@/views/create/builders/base-builder.vue";
import AsteroidForm from "@/views/create/forms/asteroid-form.vue";
import CelestialForm from "@/views/create/forms/celestial-form.vue";
import OrbitableForm from "@/views/create/forms/orbitable-form.vue";
import SphericalForm from "@/views/create/forms/spherical-form.vue";
import TextForm from "@/views/create/forms/text-form.vue";
import TexturedForm from "@/views/create/forms/textured-form.vue";
import { CelestialBodyData, CelestialType } from "@/views/create/util/types";
import { computed, defineComponent, PropType } from "vue";


export default defineComponent({
  name: "celestial-builder",
  components: { AsteroidForm, OrbitableForm, TexturedForm, SphericalForm, CelestialForm, TextForm, BaseBuilder },
  emits: ["update:data", "back", "next"],
  props: {
    data: Object as PropType<CelestialBodyData>,
    editing: Boolean,
    type: String as PropType<CelestialType>,
    simulationId: { type: Number, required: true, }
  },
  setup(props,) {
    const notAsteroid = computed(() => props.type !== "asteroid belt");
    const spherical = computed(() => notAsteroid.value);
    const orbitable = computed(() => (notAsteroid.value && props.type !== "star"));
    const textured = computed(() => notAsteroid.value);
    return { spherical, orbitable, textured, notAsteroid };
  }
});
</script>

<style scoped>

</style>
