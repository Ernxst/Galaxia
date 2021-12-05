<template>
  <teleport to="body">
    <div class="overlay" />
    <article class="popup centred">
      <h1>Authenticating</h1>
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
    </article>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "loading-popup",
  data() {
    return {
      visible: true
    };
  }
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  width: 30em;
  background: var(--main);
  box-shadow: 0 10px 20px rgba(var(--page-bg), 0.2);
  z-index: 14;
  padding: 48px 24px;
  flex-direction: column;
  border-radius: 4px;
}

h1 {
  margin-top: 0;
  margin-bottom: 8px;
  letter-spacing: 4px;
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

svg path,
svg rect {
  fill: var(--text-colour);
}
</style>
