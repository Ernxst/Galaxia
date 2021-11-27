<template>
  <section class="factfile-stats centred">
    <table>
      <tbody>
      <tr v-for="[field, value] in Object.entries($props)"
          :set="show = shouldShow(field, value)">
        <td v-if="show"
            class="field">{{ toSentenceCase(field) }}
        </td>
        <td v-if="show"
            class="value">
          <strong>{{ formatValue(field, value) }}<sup v-if="hasSuperscript(field)">{{
              getSuperscript(value)
            }}</sup>{{ unit(field) }}</strong>
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "factfile-stats",
  props: {
    radius: Number, // in km
    mass: Number, // in kg
    meanVelocity: Number, // in km/s
    dayLength: Number, // in seconds
    axialTilt: Number, // in degrees
    inclination: Number, // Degrees
    orbitalPeriod: Number, // Earth Days
    eccentricity: Number,
    semiMajor: Number, // AU
    semiMinor: Number, // AU
    luminosity: Number, // J/s
  },
  methods: {
    shouldShow(field: string, value: number | undefined) {
      if (field === "dayLength" && value === 0) return false;
      return value !== undefined;
    },
    toSentenceCase(text: string): string {
      const result = text.replace(/([A-Z])/g, " $1");
      return result.charAt(0).toUpperCase() + result.slice(1);
    },
    formatValue(field: string, value: number): number | string {
      switch (field) {
        case "dayLength":
          return Number(value / 3600).toPrecision(3); // Convert into Earth hours
        case "mass":
        case "luminosity":
          const str = value.toExponential().toString();
          const index = str.toLowerCase().indexOf("e");
          return str.slice(0, index) + " × 10";
      }
      if (value > 1_000_00) return Number(value).toPrecision(3);
      return value;
    },
    hasSuperscript(field: string): boolean {
      return field === "mass" || field === "luminosity";
    },
    getSuperscript(value: number) {
      const valueStr = value.toString();
      return valueStr.slice(valueStr.toLowerCase().indexOf("+") + 1);
    },
    unit(field: string): string {
      const units: { [key: string]: string } = {
        radius: " km",
        mass: " kg",
        semiMajor: " AU",
        semiMinor: " AU",
        orbitalPeriod: " Earth Days",
        inclination: "°",
        axialTilt: "°",
        dayLength: " Earth Hours",
        meanVelocity: " km/s",
        luminosity: " J/s",
      };
      return units[field] ? units[field] : "";
    },
  }
});
</script>

<style scoped>
.factfile-stats {
  flex-direction: column;
  margin-top: 16px;
  margin-bottom: 16px;
}

.factfile-stats, table {
  width: 100%;
}

.field {
  white-space: nowrap;
}

.field, .value {
  font-size: 9px;
  vertical-align: top;
}

.value {
  font-weight: 900;
  text-align: right;
  color: var(--main);
}

@media (min-width: 480px) {
  .field, .value {
    font-size: 10px;
  }
}
</style>
