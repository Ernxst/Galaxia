import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Object3D } from "three/src/core/Object3D";
import { Box3 } from "three/src/math/Box3";
import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";

export function getScreenPos(
  object: Object3D,
  camera: PerspectiveCamera
): Vector2 {
  const pos: Vector3 = object.position.clone();
  camera.updateMatrixWorld();
  pos.project(camera);
  return new Vector2(pos.x, pos.y);
}

export function computeCentreAndSize(object: Object3D): {
  centre: Vector3;
  size: Vector3;
} {
  const boundingBox = new Box3().setFromObject(object);
  const centre = boundingBox.getCenter(new Vector3());
  const size = boundingBox.getSize(new Vector3());
  return { centre, size };
}
