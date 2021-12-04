<template>
  <template v-if="showFooter">
    <footer>
      <nav class="links-container">
        <ul class="links centred">
          <li class="link centred">
            <span class="material-icons centred">chevron_right</span>
            <router-link aria-label="Return to homepage"
                         to="/">Galaxia
            </router-link>
          </li>
          <li class="link centred">
            <span class="material-icons centred">chevron_right</span>
            <a aria-label="LinkedIn Profile"
               href="https://www.linkedin.com/in/ernestjbadu/"
               rel="noopener"
               target="_blank">Ernest Nkansah-Badu</a>
          </li>
          <li class="link centred">
            <span class="material-icons centred">chevron_right</span>
            <a aria-label="GitHub Source Cide Repository"
               href="https://github.com/Ernxst/Galaxia"
               rel="noopener"
               target="_blank">View on GitHub</a>
          </li>
        </ul>
      </nav>
    </footer>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "app-footer",
  data() {
    return {
      showFooter: true,
    };
  },
  mounted() {
    this.showFooter = window.innerHeight > 640;
    window.addEventListener("resize", () => {
      this.showFooter = window.innerHeight > 640;
    });
  }
});
</script>

<style scoped>
footer {
  margin-top: auto;
  padding: 16px var(--page-padding);
  z-index: 1;
  backdrop-filter: blur(4px);
}

.links {
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.link > * {
  font-size: 11px;
  transition-duration: .2s;
  transition-timing-function: ease;
}

.link span {
  margin-right: 8px;
  color: var(--main);
  transition-property: margin-right;
}

.link a {
  font-weight: 400;
  letter-spacing: 2px;
  color: var(--text-colour);
  transition-property: color;
  text-shadow: 0 0 8px var(--page-bg);
}

.link:first-child > * {
  font-weight: 700;
}

.link:hover > * {
  color: var(--main);
}

.link:hover span {
  margin-right: 16px;
}

@media (max-height: 320px) and (min-width: 480px) and (orientation: landscape) {
  .link > * {
    font-size: 10px;
  }
}

@media (min-width: 768px) {
  footer {
    padding-top: 0;
  }

  .links {
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-column-gap: 16px;
  }
}
</style>
