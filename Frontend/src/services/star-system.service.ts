import { StarSystem } from "@/@types/celestial/containers/star-system";
import { EARTH_MASS, SOLAR_MASS } from "@/assets/util/celestial.constants";

// TODO: Store in backend
export const solarSystem: StarSystem = {
  name: "Solar System",
  star: {
    name: "Sun",
    radius: 696_340,
    mass: SOLAR_MASS,
    meanVelocity: 220,
    axialTilt: 7.25,
    dayLength: 0,
    texture: "",
  },
  planets: [
    {
      name: "Mercury",
      radius: 2439.7,
      mass: 3.3e23,
      semiMajor: 0.387,
      semiMinor: 0.3787,
      eccentricity: 0.205,
      inclination: 3.38,
      orbitalPeriod: 87.9691,
      meanVelocity: 47,
      axialTilt: 0.034,
      dayLength: 5067000,
      texture: "",
    },
    {
      name: "Venus",
      radius: 6051.8,
      mass: 4.87e24,
      semiMajor: 0.723,
      semiMinor: 0.72298,
      eccentricity: 0.006772,
      inclination: 3.86,
      orbitalPeriod: 224.701,
      meanVelocity: 35.02,
      axialTilt: 10087200,
      dayLength: 2.64,
      texture: "",
    },
    {
      name: "Earth",
      radius: 6371,
      mass: EARTH_MASS,
      semiMajor: 1,
      semiMinor: 0.99986,
      eccentricity: 0.167,
      inclination: 7.155,
      orbitalPeriod: 365.25,
      meanVelocity: 29.78,
      axialTilt: 23.44,
      dayLength: 86400,
      texture: "",
      moons: [
        {
          name: "Moon",
          radius: 1737.4,
          mass: 7.34767309e22,
          semiMajor: 2.5832e-3,
          semiMinor: 0.00256554454,
          eccentricity: 0.0549,
          inclination: 1.543,
          orbitalPeriod: 27,
          meanVelocity: 1.02,
          axialTilt: 1.5,
          dayLength: 2551392,
          texture: "",
        },
      ],
    },
    {
      name: "Mars",
      radius: 3389.5,
      mass: 6.42e23,
      semiMajor: 1.524,
      semiMinor: 1.5174,
      eccentricity: 0.0934,
      inclination: 5.65,
      orbitalPeriod: 686.98,
      meanVelocity: 24.07,
      axialTilt: 25.19,
      dayLength: 88620,
      texture: "",
    },
    {
      name: "Jupiter",
      radius: 69911,
      mass: 1.9e27,
      semiMajor: 5.2044,
      semiMinor: 5.1982,
      eccentricity: 0.0489,
      inclination: 6.09,
      orbitalPeriod: 4332.59,
      meanVelocity: 13.06,
      axialTilt: 3.13,
      dayLength: 35760,
      texture: "",
    },
    {
      name: "Saturn",
      radius: 58232,
      mass: 5.68e26,
      semiMajor: 9.5826,
      semiMinor: 9.5673,
      eccentricity: 0.0565,
      inclination: 5.51,
      orbitalPeriod: 10759.22,
      meanVelocity: 9.68,
      axialTilt: 26.73,
      dayLength: 38520,
      texture: "",
    },
    {
      name: "Uranus",
      radius: 25362,
      mass: 8.68e25,
      semiMajor: 19.2185,
      semiMinor: 19.1977,
      eccentricity: 0.046381,
      inclination: 6.48,
      orbitalPeriod: 30688.5,
      meanVelocity: 6.8,
      axialTilt: 97.77,
      dayLength: 62040,
      texture: "",
    },
    {
      name: "Neptune",
      radius: 24622,
      mass: 1.02e26,
      semiMajor: 30.07,
      semiMinor: 30.1087,
      eccentricity: 0.008678,
      inclination: 6.43,
      orbitalPeriod: 60195,
      meanVelocity: 5.43,
      axialTilt: 28.32,
      dayLength: 57960,
      texture: "",
    },
  ],
};
