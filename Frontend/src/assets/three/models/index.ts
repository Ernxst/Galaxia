import { Asteroid } from "@/@types/celestial/asteroid";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { DodecahedronGeometry } from "three/src/geometries/DodecahedronGeometry";
import { Matrix4 } from "three/src/math/Matrix4";

export function createAsteroidGeometries(
  asteroids: Asteroid[]
): BufferGeometry[] {
  // TODO: Different levels of detail and size of geometries
  const geometries: BufferGeometry[] = [];
  const geometry = new DodecahedronGeometry();
  for (const asteroid of asteroids) {
    const geo = geometry.clone();

    const rotation = asteroid.rotation;
    if (rotation) {
      geo.rotateX(rotation.x);
      geo.rotateY(rotation.y);
      geo.rotateZ(rotation.z);
    }

    geo.scale(asteroid.size, asteroid.size, asteroid.size);
    const { x, y, z } = asteroid.scale;
    geo.scale(x, y, z);

    const position = asteroid.initialPosition;
    if (position) {
      geo.applyMatrix4(
        new Matrix4().makeTranslation(position.x, position.y, position.z)
      );
    }
    geometries.push(geo);
  }
  return geometries;
}
