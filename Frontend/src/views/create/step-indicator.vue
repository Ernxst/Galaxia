<template>
  <div :data-end="step === numOfSteps - 1"
       class="decorated">
              <span class="centred">Step <strong>{{ step + 1 }}</strong> of <strong>{{
                  numOfSteps
                }}</strong><br><strong>{{ title }}</strong></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "step-indicator",
  props: {
    numOfSteps: { type: Number, required: true },
    step: { type: Number, required: true },
    title: { type: String, required: true }
  }
});
</script>

<style scoped>
.decorated {
  height: fit-content;
  position: sticky;
  bottom: 0;
  backdrop-filter: blur(4px);
}

.decorated span {
  font-size: 10px;
}

.decorated > span {
  flex-direction: column;
}

strong {
  color: var(--main);
}

.decorated[data-end=true] > span:before, .decorated[data-end=true] > span:after {
  border-color: var(--green);
}

.decorated[data-end=true] strong {
  color: var(--green);
}
</style>
