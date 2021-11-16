<template>
  <section class="factfile-stats centred">

  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "factfile-stats",
  props: {
    name: String,
    caption: String,
    type: String,
    description: String,

    mass: Number, // in kg
    meanVelocity: Number, // in km/s
    dayLength: Number, // in seconds
    axialTilt: Number, // in degrees
    shortDescription: String,

    inclination: Number, // Degrees
    orbitalPeriod: Number, // Earth Days
    eccentricity: Number,
    semiMajor: Number, // AU
    semiMinor: Number, // AU
  }
});
</script>

<style scoped>

</style>
