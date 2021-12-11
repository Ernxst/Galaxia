import { animateCamera, calcDuration } from "@/assets/gsap/index";
import { getOffset } from "@/assets/three";
import CelestialBody from "@/components/three/celestial/base/celestial-body.vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";


function shouldReturnToOrigin(target: Vector3, currentTarget: Vector3, origin: Vector3): boolean {
  if (!target.equals(origin)) return currentTarget.distanceTo(target) > 2.5;
  return false;
}

export async function tourUniverse(models: Array<typeof CelestialBody>,
                                   camera: PerspectiveCamera, controls: OrbitControls) {
  const origin = new Vector3();
  let currentTarget = origin.clone();

  for (const [i, model] of models.entries()) {
    const object: Mesh = model.mesh();
    const { centre, offset, quaternion } = getOffset(object);
    const toOrigin = shouldReturnToOrigin(centre, currentTarget, origin);
    currentTarget = centre;

    const duration = calcDuration(controls.target, object.position,
      camera.position, offset);
    await animateCamera({
      object: { position: centre, quaternion: quaternion },
      camera,
      controls,
      offset,
      duration: toOrigin ? duration * 2 : duration,
      delay: i === 0 ? 0 : 1.25,
    }, toOrigin);
    // TODO: Emit event signalling model is focused on, to open factfile
  }
}
