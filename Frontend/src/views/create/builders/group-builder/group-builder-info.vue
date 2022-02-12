<template>
  <div class="info-container centred">
    <custom-button v-if="numOfBodies < maxBodies"
                   class="btn"
                   @click="$emit('addBody')">
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
      <flat-button :data-disabled="!canContinue"
                   bg="var(--green)"
                   text="Next"
                   @click="$emit('next')" />
      <v-tooltip v-if="!canContinue"
                 :text="`You still have unsaved ${type}s. Please click 'Save' (or 'Update') on all ${type}s before continuing.`"
                 side="top" />
    </div>
  </div>
</template>

<script lang="ts">
import CustomButton from "@/components/ui/widgets/buttons/custom-button.vue";
import FlatButton from "@/components/ui/widgets/buttons/flat-button.vue";
import VTooltip from "@/components/ui/widgets/v-tooltip.vue";
import { CelestialType } from "@/views/create/util/types";
import GroupItem from "@/views/create/builder/group-builder/group-item.vue";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "group-builder-info",
  components: { FlatButton, GroupItem, VTooltip, CustomButton },
  emits: ["addBody", "back", "next"],
  props: {
    canContinue: Boolean,
    type: String as PropType<CelestialType>,
    maxBodies: Number,
    numOfBodies: Number,
  }
});
</script>

<style scoped>
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
