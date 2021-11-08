import { SphericalBody } from "@/@types/celestial/base/spherical-body";
import { OrbittingBody } from "./base/orbitting-body";


export interface Moon extends OrbittingBody, SphericalBody {
}
