import { BaseObject } from "../../three/base-object";


export interface CelestialBody extends BaseObject {
  id: number;
  mass: number; // in kg
  meanVelocity: number; // in km/s
  dayLength: number; // in seconds
  axialTilt: number; // in degrees
  caption: string;
  shortDescription: string;
  description: string;
  updatedAt: string;
  createdAt: string;
}
