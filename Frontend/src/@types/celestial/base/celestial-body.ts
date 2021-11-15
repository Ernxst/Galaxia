import { BaseObject } from "../../three/base-object";

export interface CelestialBody extends BaseObject {
  mass: number; // in kg
  meanVelocity: number; // in km/s
  dayLength: number; // in seconds
  axialTilt: number; // in degrees
  shortDescription: string;
}
