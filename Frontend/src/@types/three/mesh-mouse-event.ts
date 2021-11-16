import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";


export interface MeshIntersectEvent {
  distance: number;
  face: {
    a: number;
    b: number;
    c: number;
    normal: Vector3;
    materialIndex: number;
  };
  faceIndex: number;
  object: Mesh;
  point: Vector3;
  uv: Vector2;
}

interface MouseEvt {
  type: string;
  component: { name: string; position: Vector3 };
  intersect: MeshIntersectEvent;
  over?: boolean;
}

type CustomPointerEvent = PointerEvent & MouseEvt;
export type MeshMouseEvent = MouseEvt | CustomPointerEvent;
