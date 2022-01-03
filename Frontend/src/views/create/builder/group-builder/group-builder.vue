<template>
  <div class="group-builder centred">
    <ul class="existing-bodies">
      <li v-for="(_, index) in modelValue"
          :key="index"
          :active="currentIndex === index">
        <group-item :active="currentIndex === index"
                    v-model="modelValue[index]"
                    :type="type"
                    :simulation-i-d="simulationID"
                    @needs-save="items[index] = $event"
                    @saved="ids[index] = $event"
                    @click="currentIndex = index === currentIndex ? null : index"
                    @remove="remove" />
      </li>
    </ul>
    <div class="info-container centred">
      <custom-button v-if="modelValue.length < maxBodies"
                     class="btn"
                     @click="addBody">
        <span class="material-icons shaded-circle centred">add</span>
        <v-tooltip :text="`Add a new ${type} to the simulation`" />
      </custom-button>
      <p v-else
         class="info">You can only add <strong>{{ maxBodies }}</strong> {{ type }}s to the simulation. You will have to
        remove one before you can add anymore.</p>
    </div>
    <div class="buttons">
      <flat-button text="Back"
                   @click="$emit('back')" />
      <div>
        <flat-button bg="var(--green)"
                     text="Next"
                     @click="$emit('next')"
                     :data-disabled="!canContinue" />
        <v-tooltip v-if="!canContinue"
                   side="top"
                   :text="`You still have unsaved ${type}s. Please click 'Save' (or 'Update') on all ${type}s before continuing.`" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CustomButton from "@/components/ui/widgets/buttons/custom-button.vue";
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import VTooltip from "@/components/ui/widgets/v-tooltip.vue";
import { useStore } from "@/store/store";
import GroupItem from "@/views/create/builder/group-builder/group-item.vue";
import { AsteroidBeltData, MoonData, PlanetData } from "@/views/create/util/types";
import { defaultAsteroidBelt, defaultMoon, defaultPlanet } from "@/views/create/util/util";
import { startCase } from "lodash-es";
import { computed, defineComponent, PropType, ref, toRefs, watch } from "vue";


export default defineComponent({
  name: "group-builder",
  components: { FlatButton, GroupItem, VTooltip, CustomButton },
  emits: ["update:modelValue", "back", "next", "preview", "remove", "close"],
  props: {
    simulationID: Number,
    modelValue: Object as PropType<PlanetData[] | MoonData[] | AsteroidBeltData[]>,
    type: String as PropType<"planet" | "moon" | "asteroid belt">
  },
  setup(props, { emit }) {
    const maxBodies = computed(() => {
      switch (props.type) {
        case "planet":
          return 8;
        case "moon":
          return 4;
        case "asteroid belt":
          return 3;
      }
    });
    const defaultBody = computed(() => {
      switch (props.type) {
        case "planet":
          return defaultPlanet;
        case "moon":
          return defaultMoon;
        case "asteroid belt":
          return defaultAsteroidBelt;
      }
    });

    const { modelValue } = toRefs(props);
    const currentIndex = ref<number | null>(null);
    const currentBody = computed(() => (currentIndex.value ? modelValue.value[currentIndex.value] : null));
    watch(currentIndex, (newVal) => {
      if (newVal !== null) emit("preview", modelValue.value[newVal]);
      else emit("close");
    });

    function addBody() {
      const index = modelValue.value.length - 1;
      const body = { ...defaultBody.value };
      body.name = `My ${props.type} ${index + 1}`;
      modelValue.value.push(body);
      items.value.push(false);
      ids.value.push(-1);
    }

    const store = useStore();

    async function remove() {
      if (window.confirm(`Are you sure you'd like to remove this ${props.type} from the simulation? This action cannot be undone.`)) {
        const index = currentIndex.value;
        const id = ids.value[index];

        if (id !== -1) {
          try {
            const action = startCase(props.type).replace(" ", "");
            const payload = {
              simulationID: props.simulationID,
              id: id,
            };
            await store.dispatch(`builder/delete${action}`, payload);
          } catch (e) {
            alert(e);
          }
        }
        modelValue.value.splice(index, 1);
        items.value.splice(index, 1);
        ids.value.splice(index, 1);
        emit("remove");
        currentIndex.value = null;
      }
    }

    const items = ref<boolean[]>([]);
    const ids = ref<number[]>([]);
    const canContinue = computed(() => items.value.every(Boolean));

    return { currentIndex, currentBody, maxBodies, items, ids, canContinue, addBody, remove };
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

.buttons {
  display: grid;
  grid-gap: 16px;
  width: 100%;
}

.info-container {
  width: 100%;
  margin-bottom: 16px;
  flex-direction: column;
  justify-content: space-between;
}

.btn {
  margin: auto;
}

.material-icons {
  background: var(--green);
  padding: 8px;
  color: var(--text-colour);
  border-radius: 50%;
  box-shadow: 0 0 12px var(--page-bg);
  transition: .167s ease-in-out filter;
}

.material-icons:hover {
  filter: brightness(1.1);
}

.info {
  text-align: center;
  width: 100%;
  color: var(--text-colour);
  font-size: 11px;
  margin: 0;
}

.info strong {
  color: var(--main);
}
</style>
