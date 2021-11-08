import { Planet } from "@/@types/celestial/planet";
import RingProps from "@/@types/celestial/ring-props";


export interface RingedPlanet extends Planet {
  ring: RingProps
}
