<template>
  <Scene>
    <loader
      v-if="!assetsLoaded"
      :assets="assets"
      @assets-loaded="assetsLoaded = true"
    />

    <template v-else>
      <Galaxy
        ref="galaxy"
        name="Milky Way"
        @scene-loaded="$emit('loaded')"
      />
    </template>
  </Scene>
</template>

<script lang="ts">
  import { Scene } from "troisjs";
  import { defineComponent, ref } from "vue";
  import Galaxy from "../celestial/containers/galaxy.vue";
  import Loader from "./loader.vue";

  export default defineComponent({
    name: "AppScene",
    components: { Scene, Loader, Galaxy },
    emits: ["loaded"],
    created() {
      this.$store.dispatch("starSystem/fetchAllStarSystems");
    },
    setup() {
      // TODO: Fetch assets
      const assets = ref<string[]>([
        "https://images.unsplash.com/photo-1602614023179-25a315daf1a6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2940&q=80",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/mercury%2Fmercury.webp?alt=media&token=dbc3c54f-8adf-4d0b-b23f-19b783e3405f",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/earth%2Fearth-bump-map.webp?alt=media&token=c23b2b96-5ad7-4b3d-8c74-7937276ed70d",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/venus%2Fvenus.webp?alt=media&token=5c329833-5897-47d8-ba54-81296b653af4",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/mars%2Fmars.webp?alt=media&token=8a79998b-7d3e-4524-bfbf-4407735aeccf",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/jupiter%2Fjupiter.webp?alt=media&token=1db48894-992c-49e6-b763-fbc50e83e031",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/saturn%2Fsaturn.webp?alt=media&token=cb1458a4-0e30-48f0-b5a5-ec51548723d0",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/neptune%2Fneptune.webp?alt=media&token=7bc8f1a0-957f-4bc1-a659-ae73f0287311",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/uranus%2Furanus.webp?alt=media&token=34248914-8684-4432-9004-f12201c645c1",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/trappist-1a%2Ftrappist-1a.webp?alt=media&token=b3e7d499-6af5-4fb2-b32a-5bec1211369f",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/sun%2Fsun.webp?alt=media&token=addfe03f-ecd7-4d25-b30f-2b0dceefd61c",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/earth%2Fearth.webp?alt=media&token=ac1c0e2f-612a-4264-8f5a-57534ad83bd5",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/mercury%2Fmercury-bump-map.webp?alt=media&token=071732ca-6f75-4cc3-bf27-dc641c58f725",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/venus%2Fvenus-bump-map.webp?alt=media&token=410380bd-ca78-40aa-8319-e021dd9bb0f0",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/mars%2Fmars-bump-map.webp?alt=media&token=f33241c9-fa1a-448d-b060-514cdc43614c",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/earth%2Fearth-specular-map.webp?alt=media&token=15119bf9-8ac1-4643-9b18-fd9d706d7239",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/venus%2Fvenus-shell.webp?alt=media&token=c6a56979-e64d-4984-9c9f-3fdff907d8b6",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/earth%2Fearth-shell.webp?alt=media&token=a1fe9b61-7d24-4498-b4d0-915be58bb743",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/backgrounds%2Fbackground.webp?alt=media&token=39efde45-e0b1-4422-b3e7-3fa5d015430b",
        // "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/saturn%2Fsaturn-ring.webp?alt=media&token=76117245-5be7-4c23-aee1-f33696f0d256",
      ]);
      const assetsLoaded = ref(false);
      const galaxy = ref<typeof Galaxy>(null);

      function render(paused: boolean, speed: number) {
        if (!paused) galaxy.value.evolve(speed);
      }

      return {
        render,
        assets,
        assetsLoaded,
        galaxy,
      };
    },
  });
</script>

<style scoped></style>
