import { State } from "@/store/store";
import { CelestialBodyData, CelestialType } from "@/views/create/util/types";
import { startCase } from "lodash-es";
import { computed, Ref, ref, watch } from "vue";
import { Store } from "vuex";


interface UseGroupBuilderParams {
  bodies: Ref<CelestialBodyData[]>;
  type: CelestialType;
  store: Store<State>;
  defaultBody: CelestialBodyData;
  simulationID: number,
}

export function useGroupBuilder({ bodies, type, store, defaultBody, simulationID }: UseGroupBuilderParams) {
  store.commit("simulation/setModelType", type);
  store.commit("simulation/setPreviewing", false);
  // TODO: Add existing bodies to bodiesSaved and ids (if editing)
  // Stores whether each body in bodies array has been saved in backend
  const bodiesSaved = ref<boolean[]>([]);
  // Stores id of each body in bodies array
  const ids = ref<number[]>([]);
  // Can only move onto next stage if all bodies have been saved
  const canContinue = computed(() => bodiesSaved.value.every(Boolean));

  const currentIndex = ref<number | null>(null);
  const currentBody = computed(() => currentIndex.value !== null ? bodies.value[currentIndex.value] : null);
  watch(currentBody, (newVal: CelestialBodyData | null) => {
    const previewing = !(newVal === null);
    const body = newVal === null ? defaultBody : newVal;
    store.commit("simulation/setPreviewing", previewing);
    store.commit("simulation/setModelToPreview", { model: body, type: type });
  }, { deep: true });

  function addBody() {
    const index = bodies.value.length - 1;
    bodies.value.push({ ...defaultBody, name: `My ${type} ${index + 1}` });
    bodiesSaved.value.push(false);
    ids.value.push(-1);
  }

  async function removeBody() {
    if (window.confirm(`Are you sure you'd like to remove this ${type} from the simulation? This action cannot be undone.`)) {
      if (currentIndex.value === null) return;
      const index = currentIndex.value;
      const id = ids.value[index];

      if (id && id !== -1) {
        try {
          const action = startCase(type).replace(" ", "");
          await store.dispatch(`builder/delete${action}`, { simulationID, id });
        } catch (e) {
          alert(e);
        }
      }

      bodies.value.splice(index, 1);
      bodiesSaved.value.splice(index, 1);
      ids.value.splice(index, 1);
      currentIndex.value = null;
    }
  }

  return { addBody, removeBody, canContinue, currentIndex, bodiesSaved, ids };
}
