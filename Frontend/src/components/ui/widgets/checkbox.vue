<template>
  <div :checked="modelValue === true"
       class="checkbox noselect">
    <label v-if="label"
           :for="id">{{ label }}<strong v-if="required">*</strong></label>
    <div class="icon-container"
         tabindex="0"
         @keyup.enter="onEnter">
      <input :id="id"
             ref="checkbox"
             :name="name"
             :value="modelValue"
             tabindex="0"
             type="checkbox"
             @input="$emit('update:modelValue', $event.target.value === 'false')">
      <span class="icon material-icons centred">check</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "checkbox",
  emits: ["update:modelValue"],
  props: {
    id: { type: String, required: true },
    name: { type: String, required: false },
    modelValue: Boolean,
    label: String,
    required: { type: Boolean, default: false },
  },
  methods: {
    // Allows the user to toggle the checkbox with the enter key (if focused)
    onEnter() {
      this.$refs.checkbox.value = (!(this.$refs.checkbox.value === "false")).toString();
      this.$emit("update:modelValue", this.$refs.checkbox.value === "false");
    }
  }
});
</script>

<style scoped>
.checkbox {
  cursor: pointer;
  display: grid;
  grid-template-columns: 10fr auto;
  grid-column-gap: 6px;
  outline-color: var(--main) !important;
}

label {
  font-size: 11px;
  letter-spacing: 3px;
}

label, input {
  cursor: pointer;
}

.icon-container {
  position: relative;
  height: min-content;
  border: 1px solid var(--main);
  padding: 2px;
}

input {
  border-radius: var(--button-radius);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  z-index: 1;
}

.icon {
  font-size: 13px;
  background: var(--main);
  color: var(--page-bg);
  opacity: 0;
}

.icon-container {
  transition: .2s ease transform;
}

.checkbox[checked=true] .icon {
  opacity: 1;
}

input:focus + .icon {
  filter: brightness(1.5);
}

.checkbox:focus-within .icon-container {
  transform: scale(1.25);
}
</style>
