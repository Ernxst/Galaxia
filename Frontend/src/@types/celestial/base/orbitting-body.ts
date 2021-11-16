import { CelestialBody } from "./celestial-body";


export interface OrbittingBody extends CelestialBody {
  inclination: number; // Degrees
  orbitalPeriod: number; // Earth Days
  eccentricity: number;
  semiMajor: number; // AU
  semiMinor: number; // AU
}
