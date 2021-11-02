import { Vector3 } from "three/src/math/Vector3";

export interface BaseObject {
  name: string;
  initialPosition?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
}
