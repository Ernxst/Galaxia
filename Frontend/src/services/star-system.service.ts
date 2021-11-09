import { StarSystem } from "@/@types/celestial/containers/star-system";
import { EARTH_MASS, SOLAR_MASS } from "@/assets/util/celestial.constants";
import { ATMOSPHERE_OPACITY, ATMOSPHERE_SCALE } from "@/assets/util/sim.constants";


const kuiperBeltBase = {
  depth: 1,
  mass: 0,
  meanVelocity: 0,
  dayLength: 1_000_000,
  maxSize: 3000,
};

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
    luminosity: 3e27,
    texture:
      "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/sun%2Fsun.webp?alt=media&token=addfe03f-ecd7-4d25-b30f-2b0dceefd61c",
    atmosphere: {
      scale: ATMOSPHERE_SCALE,
      texture: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/sun%2Fsun-shell.webp?alt=media&token=0bfb38bb-cab3-444b-9c4d-34fa0c7faf4b",
      opacity: ATMOSPHERE_OPACITY,
    }
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
      texture:
        "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/mercury%2Fmercury.webp?alt=media&token=dbc3c54f-8adf-4d0b-b23f-19b783e3405f",
      bumpMap: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/mercury%2Fmercury-bump-map.webp?alt=media&token=071732ca-6f75-4cc3-bf27-dc641c58f725",
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
      texture:
        "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/venus%2Fvenus.webp?alt=media&token=5c329833-5897-47d8-ba54-81296b653af4",
      bumpMap: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/venus%2Fvenus-bump-map.webp?alt=media&token=410380bd-ca78-40aa-8319-e021dd9bb0f0",
      atmosphere: {
        scale: ATMOSPHERE_SCALE,
        texture: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/venus%2Fvenus-shell.webp?alt=media&token=c6a56979-e64d-4984-9c9f-3fdff907d8b6",
        opacity: ATMOSPHERE_OPACITY
      },
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
      texture:
        "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/earth%2Fearth.webp?alt=media&token=ac1c0e2f-612a-4264-8f5a-57534ad83bd5",
      bumpMap: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/earth%2Fearth-bump-map.webp?alt=media&token=c23b2b96-5ad7-4b3d-8c74-7937276ed70d",
      specularMap: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/earth%2Fearth-specular-map.webp?alt=media&token=15119bf9-8ac1-4643-9b18-fd9d706d7239",
      atmosphere: {
        scale: ATMOSPHERE_SCALE,
        texture: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/earth%2Fearth-shell.webp?alt=media&token=a1fe9b61-7d24-4498-b4d0-915be58bb743",
        opacity: ATMOSPHERE_OPACITY
      },
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
          texture:
            "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/moon%2Fmoon.webp?alt=media&token=ff210133-ac5f-4f1c-bb93-59632d9c2471",
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
      texture:
        "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/mars%2Fmars.webp?alt=media&token=8a79998b-7d3e-4524-bfbf-4407735aeccf",
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
      texture:
        "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/jupiter%2Fjupiter.webp?alt=media&token=1db48894-992c-49e6-b763-fbc50e83e031",
      bumpMap: "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/mars%2Fmars-bump-map.webp?alt=media&token=f33241c9-fa1a-448d-b060-514cdc43614c"
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
      texture:
        "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/saturn%2Fsaturn.webp?alt=media&token=cb1458a4-0e30-48f0-b5a5-ec51548723d0",
      ring: {
        tilt: 0,
        texture: "https://i.postimg.cc/zz7Gr430/saturn-rings-top.png",
        innerRadius: 66900,
        outerRadius: 136775,
        circular: false,
      }
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
      texture:
        "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/uranus%2Furanus.webp?alt=media&token=34248914-8684-4432-9004-f12201c645c1",
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
      texture:
        "https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/neptune%2Fneptune.webp?alt=media&token=7bc8f1a0-957f-4bc1-a659-ae73f0287311",
    },
  ],
  asteroidBelts: [
    {
      name: "Asteroid Belt",
      numOfAsteroids: 10_000,
      depth: 1,
      innerSemiMajor: 2.06,
      innerEccentricity: 0.33,
      outerSemiMajor: 3.27,
      outerEccentricity: 0.33,
      mass: 2.39e21,
      meanVelocity: 0,
      dayLength: 1_000_000,
      inclination: 20,
    },
    {
      name: "Kuiper Belt: Dynamically Cold",
      ...kuiperBeltBase,
      numOfAsteroids: 145_000,
      innerSemiMajor: 30,
      innerEccentricity: 0.1,
      outerSemiMajor: 55,
      outerEccentricity: 0.1,
      inclination: 10,
      maxSize: 3000,
    },
    {
      name: "Kuiper Belt: Dynamically Holt",
      ...kuiperBeltBase,
      numOfAsteroids: 5_000,
      innerSemiMajor: 30,
      innerEccentricity: 0.1,
      outerSemiMajor: 55,
      outerEccentricity: 0.1,
      inclination: 30,
      maxSize: 3000,
    },
  ],
};
