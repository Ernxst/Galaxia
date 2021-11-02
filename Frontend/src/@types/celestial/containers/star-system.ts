import { Planet } from "../planet";
import { Star } from "../star";

export interface StarSystem {
  name: string;
  star: Star;
  planets: Planet[];
}
