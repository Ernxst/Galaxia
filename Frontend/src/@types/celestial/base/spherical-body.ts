import AtmosphereProps from "@/@types/celestial/atmosphere-props";
import { CelestialBody } from "@/@types/celestial/base/celestial-body";
import { Sphere } from "@/@types/three/sphere";


// TODO: Atmosphere should just be a string and use constants in components for geometry
export interface SphericalBody extends CelestialBody, Sphere {
  atmosphere?: AtmosphereProps;
  atmosphereTexture?: string;
}
