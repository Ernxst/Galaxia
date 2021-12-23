<template>
  <div :empty="modelValue === ''"
       class="text-input">
    <label v-if="label"
           :for="id"
           class="noselect">{{ label }}<strong v-if="required">*</strong></label>
    <div :focused="focused"
         class="input-container">
      <component :is="multiline ? 'textarea' : 'input'"
                 :id="id"
                 ref="input"
                 :autocomplete="autocomplete"
                 :name="name"
                 :placeholder="placeholder"
                 :type="type"
                 :value="modelValue"
                 :maxlength="maxlength"
                 @focusin="focused = true"
                 @focusout="focused = false"
                 :rows="rows"
                 @input="onKeyPress"
                 @keyup.enter="$emit('submit', $event)"></component>
      <div class="icon-container centred">
        <span class="delete-icon material-icons centred"
              @click="$emit('update:modelValue', '')">close</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { regExpEscape } from "@/assets/util/app.util";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "text-input",
  emits: ["update:modelValue", "submit"],
  props: {
    id: { type: String },
    name: { type: String, required: false },
    modelValue: String,
    label: String,
    required: { type: Boolean, default: false },
    type: { type: String, default: "text" },
    placeholder: { type: String, default: "" },
    autocomplete: { type: String, default: "off" },
    ignoreKeys: {
      type: Object as PropType<string[]>, default: [";", "\[", "\]", "\{", "\}", "\(", "\)", '"', "£", "\.", "-",
        "$", "%", "^", "&", "\*", "_", "+", "=", "|", "\\", "\/", "~", "`", ":", "!", "±", "§",]
    },
    maxlength: { type: Number, default: 255 },
    rows: { type: Number, default: 10 },
    noSpaces: { type: Boolean, default: false },
    multiline: { type: Boolean, default: false }
  },
  data() {
    return {
      focused: false
    };
  },
  beforeCreate() {
    if (this.noSpaces) this.ignoreKeys.push(" ");
  },
  methods: {
    focus() {
      this.focused = true;
      this.$refs.input.focus();
    },
    onKeyPress(event: InputEvent) {
      event.target.value = event.target.value.slice(0, this.maxlength);
      // Prevent user from copying and pasting unwanted keys into input
      // Uses a regex as str.replaceAll() not implemented on all browsers
      for (const char of this.ignoreKeys) {
        const regex = new RegExp(regExpEscape(char), "g");
        event.target.value = event.target.value.replace(regex, "");
      }
      event.preventDefault();
      this.$emit("update:modelValue", event.target.value);
    }
  }
});
</script>

<style scoped>
.text-input {
  display: grid;
  grid-row-gap: 6px;
}

label, input, textarea {
  font-size: 13px;
}

strong {
  color: var(--red);
}

.input-container {
  display: grid;
  grid-template-columns: 3fr auto;
  grid-column-gap: 6px;
  padding-right: 6px;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(3px);
  border: 1px solid var(--main);
  border-left-width: 12px;
  border-radius: var(--button-radius);
  transition-timing-function: ease;
  transition-duration: .2s;
  transition-property: border-left-width, border-color;
}

.input-container[focused=true] {
  border-left-width: 24px;
  border-color: var(--accent);
}

input, textarea {
  outline: none;
  border: none;
  text-transform: none;
  background: none;
  padding: 10px 12px;
  letter-spacing: 1px;
  color: var(--text-colour);
}

.icon-container {
  border: 1px solid var(--red);
  cursor: pointer;
  padding: 2px;
  opacity: 0;
  transition: .25s ease opacity;
  margin: 6px 0;
  height: min-content;
}

.icon-container:hover {
  filter: brightness(1.33);
}

.delete-icon {
  background: var(--red);
  color: var(--page-bg);
}

.text-input[empty=false] .icon-container {
  opacity: 1;
}
</style>
