<template>
  <div class="group-builder centred">
    <ul class="existing-bodies">
      <li v-for="(_, index) in bodies"
          :key="index">
        <celestial-group-item v-model:body="bodies[index]"
                              v-model:id="ids[index]"
                              v-model:saved="bodiesSaved[index]"
                              :active="currentIndex === index"
                              :simulation-id="simulationId"
                              :type="type"
                              @click="onClick(index)"
                              @remove-body="removeBody">
          <slot :data="bodies[index]"
                :index="index" />
        </celestial-group-item>
      </li>
    </ul>
    <group-builder-info :can-continue="canContinue"
                        :max-bodies="maxBodies"
                        :num-of-bodies="numOfBodies"
                        :type="type"
                        @back="$emit('back')"
                        @next="$emit('next')"
                        @add-body="addBody" />
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store/store";
import CelestialGroupItem from "@/views/create/builders/group-builder/celestial-group-item.vue";
import GroupBuilderInfo from "@/views/create/builders/group-builder/group-builder-info.vue";
import { useGroupBuilder } from "@/views/create/builders/group-builder/group-builder.composable";
import { CelestialBodyData, CelestialType } from "@/views/create/util/types";
import GroupItem from "@/views/create/builders/group-builder/celestial-group-item.vue";
import { computed, defineComponent, PropType, toRefs } from "vue";


export default defineComponent({
  name: "group-celestial-builder",
  components: { CelestialGroupItem, GroupItem, GroupBuilderInfo },
  emits: ["update:bodies", "back", "next"],
  props: {
    bodies: Array as PropType<CelestialBodyData[]>,
    type: String as PropType<CelestialType>,
    simulationId: { type: Number, required: true, },
    defaultBody: Object as PropType<CelestialBodyData>,
    maxBodies: Number,
  },
  setup(props) {
    const store = useStore();
    const { bodies, simulationId, type } = toRefs(props);
    const numOfBodies = computed(() => bodies.value.length);

    const { addBody, removeBody, canContinue, currentIndex, bodiesSaved, ids } = useGroupBuilder({
      bodies: bodies,
      type: type.value,
      store: store,
      defaultBody: props.defaultBody,
      simulationID: simulationId.value
    });

    function onClick(index: number) {
      currentIndex.value = index === currentIndex.value ? null : index;
    }

    return { ids, bodiesSaved, canContinue, currentIndex, numOfBodies, addBody, removeBody, onClick };
  }
});
</script>

<style scoped>
.group-builder {
  flex-direction: column;
}

.group-builder, ul, li {
  width: 100%;
}

ul {
  flex-direction: column;
  justify-content: space-between;
}
</style>
