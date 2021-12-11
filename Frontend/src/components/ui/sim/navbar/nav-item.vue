<template>
  <div class="nav-item centred noselect">
    <div class="button-container centred">
      <button
        :class="following ? 'nav-button active centred' : 'nav-button centred'"
        class="nav-button centred"
        @click="go"
      >
        <div class="image centred">
          <img :alt="name"
               :src="icon"
               height="32"
               width="32" />
        </div>
        <div class="content centred">
          <h3>{{ name }}</h3>
          <p>{{ isStar ? "star" : `${Math.round(distance * 1000) / 1000} AU` }}</p>
        </div>
      </button>
      <span v-if="hasMoons"
            :class="open ? 'toggler toggled material-icons' : 'toggler material-icons'"
            class="toggler material-icons"
            @click="open = !open"
      >chevron_right</span
      >
    </div>
    <ul
      v-if="hasMoons"
      :class="open ? 'moon-container open centred' : 'moon-container centred'"
    >
      <li v-for="moon in Object.values(moons)"
          v-bind="moon">
        <nav-item
          :ref="(el) => moonButtons.push(el)"
          :distance="moon.semiMajor"
          :icon="moon.texture"
          :isMoon="true"
          :isStar="false"
          :name="moon.name"
          @follow="$emit('follow', $event)"
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
    },
    hasMoon(name: string): boolean {
      return this.moonButtons.find(moon => moon.name === name) !== undefined;
    },
    activateMoon(name: string) {
      this.deactivate();
      const component = this.moonButtons.find(moon => moon.name === name);
      component.activate();
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

.image:after {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: "";
  background: radial-gradient(circle at 50% 0px, #FFFFFF, rgba(255, 255, 255, 0) 58%);
  filter: blur(3px);
  border-radius: 50%;
}

.image img {
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
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
  color: var(--text-colour);
  cursor: pointer;
  margin-left: 4px;
  transition: 0.35s ease-in-out all;
}

.toggler:hover {
  color: var(--main);
}

.toggler.toggled {
  transform: rotate(90deg);
  color: var(--main);
}

.moon-container {
  flex-direction: column;
  align-items: flex-start;
  margin-left: 36px;
  overflow-y: hidden;
  max-height: 0;
  transition: 0.35s ease-in-out max-height;
}

.moon-container.open {
  max-height: 100vh;
}

@media (max-width: 480px) {
  .button-container {
    flex-direction: column;
  }

  button {
    flex-direction: column;
    padding: 12px 6px;
  }

  .active .content h3 {
    border-left: none;
    padding-left: 0;
  }

  .content h3 {
    -webkit-text-stroke: unset;
  }

  .content {
    margin-left: 0;
    margin-top: 16px;
  }

  .toggler {
    margin-left: 0;
    margin-top: 0;
  }

  .content p {
    text-align: center;
    width: 100%;
  }

  .moon-container {
    flex-direction: row;
    margin-left: 0;
    overflow-x: scroll;
    overflow-y: visible;
  }
}

@media (max-height: 480px) and (min-width: 480px) and (orientation: landscape) {
  .content h3 {
    font-size: 12px;
    letter-spacing: 1px;
  }
}
</style>
