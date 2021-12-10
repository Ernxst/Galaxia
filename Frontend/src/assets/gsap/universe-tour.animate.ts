import { animateCamera, calcDuration } from "@/assets/gsap/index";
import { getOffset } from "@/assets/three";
import CelestialBody from "@/components/three/celestial/base/celestial-body.vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";


export async function tourUniverse(models: Array<typeof CelestialBody>,
                                   camera: PerspectiveCamera, controls: OrbitControls) {
  const origin = new Vector3();
  for (const [i, model] of models.entries()) {
    const object: Mesh = model.mesh();
    const { centre, offset, quaternion } = getOffset(object);
    const duration = calcDuration(controls.target, object.position,
      camera.position, offset);
    const toOrigin = !centre.equals(origin);
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
