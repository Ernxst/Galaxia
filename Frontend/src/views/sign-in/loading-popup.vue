<template>
  <teleport to="body">
    <div class="abs overlay" />
    <div class="popup centred">
      <content-container v-bind="$attrs"
                         :glow="true"
                         :visible="visible">
        <template v-slot:header>
          <h1>{{ text }}</h1>
        </template>
        <template v-slot:content>
          <div class="content centred">
            <div class="loader">
              <svg id="circle"
                   xmlns="http://www.w3.org/2000/svg"
                   xmlns:xlink="http://www.w3.org/1999/xlink"
                   x="0px"
                   y="0px"
                   width="100px"
                   height="100px"
                   viewBox="0 0 50 50"
                   style="enable-background:new 0 0 50 50;"
                   xml:space="preserve">
  <path fill="#000"
        d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
    <animateTransform attributeType="xml"
                      attributeName="transform"
                      type="rotate"
                      from="0 25 25"
                      to="360 25 25"
                      dur="0.6s"
                      repeatCount="indefinite" />
    </path>
  </svg>
            </div>
            <p>Please wait</p>
          </div>
        </template>

      </content-container>
    </div>
  </teleport>
</template>

<script lang="ts">
import ContentContainer from "@/components/ui/widgets/content-container.vue";
import { defineComponent } from "vue";


export default defineComponent({
  name: "loading-popup",
  components: { ContentContainer },
  props: {
    visible: { type: Boolean, default: true },
    text: { type: String, default: "Authenticating" },
  },
});
</script>

<style scoped>
.overlay {
  position: fixed;
  z-index: 13;
  background: var(--page-bg);
  opacity: .33;
}

.popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  max-width: 90%;
  max-height: 90vh;
  min-width: fit-content;
  width: fit-content;
  z-index: 14;
  background: var(--page-bg);
}

h1 {
  margin: 0;
  letter-spacing: 4px;
  font-size: 6vw;
}

.content {
  flex-direction: column;
}

.loader {
  height: 100px;
  width: 20%;
  text-align: center;
  padding: 1em;
  margin: 0 auto 1em;
  display: inline-block;
  vertical-align: top;
}

svg path, svg rect {
  fill: var(--text-colour);
}

@media (min-width: 480px) {
  h1 {
    font-size: 32px;
  }
}
</style>
