<template>
  <div class="nav-item centred noselect">
    <div class="button-container centred">
      <button
        class="nav-button centred"
        @click="go"
        :class="following ? 'nav-button active centred' : 'nav-button centred'"
      >
        <div class="image centred">
          <img :alt="name" :src="icon" height="32" width="32"/>
        </div>
        <div class="content centred">
          <h3>{{ name }}</h3>
          <p>{{ isStar ? "star" : `${Math.round(distance * 1000) / 1000} AU` }}</p>
        </div>
      </button>
      <span
        class="toggler material-icons"
        @click="open = !open"
        :class="
          open ? 'toggler toggled material-icons' : 'toggler material-icons'
        "
        v-if="hasMoons"
      >expand_more</span
      >
    </div>
    <ul
      :class="open ? 'moon-container open centred' : 'moon-container centred'"
      v-if="hasMoons"
    >
      <li v-for="moon in Object.values(moons)" v-bind="moon">
        <nav-item
          :name="moon.name"
          :isStar="false"
          :isMoon="true"
          :icon="moon.texture"
          :distance="moon.semiMajor"
          @follow="$emit('follow', $event)"
          :ref="(el) => moonButtons.push(el)"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Moon } from "@/@types/celestial/moon";
import { defineComponent, PropType } from "vue";


export default defineComponent({
  name: "nav-item",
  props: {
    name: String,
    isStar: Boolean,
    isMoon: { type: Boolean, default: false },
    distance: { type: Number, default: 0 },
    icon: { type: String, default: "" },
    moons: {
      type: Object as PropType<{ [key: string]: Moon }>,
      default: {},
    },
  },
  emits: ["follow"],
  computed: {
    hasMoons() {
      for (const i in this.moons) return true;
      return false;
    },
  },
  data() {
    return {
      open: false,
      following: false,
      moonButtons: [],
    };
  },
  beforeUpdate() {
    this.moonButtons.length = 0;
  },
  methods: {
    go() {
      if (this.$parent.$parent.animating) return;
      this.$emit("follow", {
        name: this.name,
        isStar: this.isStar,
        isMoon: this.isMoon,
      });
      this.activate();
    },
    activate() {
      this.open = true;
      this.following = true;
      for (const button of this.moonButtons) button.deactivate();
    },
    deactivate() {
      this.following = false;
      for (const button of this.moonButtons) button.deactivate();
    },
  },
});
</script>

<style scoped>
.nav-item {
  flex-direction: column;
  align-items: flex-start;
  overflow-x: visible;
}

.button-container {
  justify-content: flex-start;
}

.nav-item * {
  transition: 0.25s ease-in-out all;
}

button {
  background: none;
  outline: none;
  border: none;
}

button {
  padding: 6px 12px;
  cursor: pointer;
  margin: 4px;
}

button:hover {
  background: rgba(255, 255, 255, 0.125);
}

button:hover .image {
  border-color: var(--main);
}

button:hover .content > * {
  color: var(--main);
}

.active {
  pointer-events: none;
  background: rgba(255, 255, 255, 0.125);
}

.active .image {
  border: 2px solid var(--main);
  transform: scale(1.15);
}

.active .content h3 {
  border-left: 36px solid var(--main);
  padding-left: 12px;
}

.active .content > * {
  color: var(--main);
  font-weight: 600;
}

.image {
  border-radius: 50%;
  border: 1px solid #FFF;
  overflow: hidden;
  width: 32px;
  height: 32px;
  position: relative;
}

.image img {
  border-radius: 50%;
  height: 100%;
}

.content {
  margin-left: 12px;
  flex-direction: column;
  align-items: flex-start;
}

.content > * {
  color: rgba(255, 255, 255, 0.67);
}

.content h3 {
  font-size: 14px;
  letter-spacing: 2px;
  margin: 0 0 4px;
  font-weight: 900;
  -webkit-text-stroke-width: thin;
  -webkit-text-stroke-color: var(--page-bg);
}

.content p {
  font-size: 8px;
  letter-spacing: 1px;
  margin: 0;
  white-space: nowrap;
}

.toggler {
  color: #FFF;
  cursor: pointer;
  margin-left: 12px;
  transition: 0.44s ease-in-out all;
}

.toggler.toggled {
  transform: rotate(180deg);
  color: var(--main);
}

.moon-container {
  flex-direction: column;
  align-items: flex-start;
  margin-left: 36px;
  overflow-y: hidden;
  max-height: 0;
  transition: 0.44s ease-in-out max-height;
  overflow-x: visible;
}

.moon-container.open {
  max-height: 100vh;
}
</style>
