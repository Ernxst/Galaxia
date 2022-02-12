import { State } from "@/store/store";
import { validateCelestialBody } from "@/views/create/util/simulation-validator";
import { CelestialBodyData, CelestialType } from "@/views/create/util/types";
import { scaleParams } from "@/views/create/util/util";
import { nextTick } from "@vue/runtime-core";
import { startCase } from "lodash-es";
import { Ref } from "vue";
import { Store } from "vuex";


export interface UseSubmitParams {
  data: Ref<CelestialBodyData>,
  type: CelestialType,
  simulationID: number,
  planetID?: number,
  bodyID: Ref<number | null>,
  saving: Ref<boolean>,
  store: Store<State>;
  emit: any;
  isGroup?: Boolean;
  onAfterCreate?: Function;
  onAfterSave?: Function;
}

interface BuilderDispatchPayload {
  simulationID: number,
  data: CelestialBodyData,
  id?: number | null;
  planetID?: number;
}

export async function useSubmit({
                                  data, type, simulationID, planetID,
                                  bodyID, saving, store, emit, isGroup,
                                  onAfterCreate = () => {
                                  },
                                  onAfterSave = () => {
                                  }
                                }: UseSubmitParams) {
  function validate() {
    const validationResponse = store.getters["simulation/validSimulation"];
    const bodyResponse = validateCelestialBody(data.value, type);

    for (const message of [validationResponse, bodyResponse]) {
      if (message !== true) {
        alert(message);
        return false;
      }
    }

    return true;
  }

  if (!validate()) return;

  try {
    saving.value = true;
    const payload: BuilderDispatchPayload = {
      simulationID: simulationID,
      data: scaleParams<CelestialBodyData>({ ...data.value }, type)
    };
    if (planetID) payload.planetID = planetID;
    const action = startCase(type).replace(" ", "");

    if (!bodyID.value || bodyID.value === -1) {
      const id = await store.dispatch(`builder/create${action}`, payload);
      data.value.id = id;
      if (!isGroup) bodyID.value = id;
      onAfterCreate(id);
    } else
      await store.dispatch(`builder/update${action}`, { ...payload, id: bodyID.value });

    saving.value = false;
    await nextTick(() => onAfterSave());
    // onAfterSave();
    if (!isGroup) emit("next");
  } catch (e) {
    saving.value = false;
    alert(e);
  }
}
