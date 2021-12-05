import { animateCamera, calcDuration } from "@/assets/gsap/index";
import { computeCentreAndSize } from "@/assets/three";
import CelestialBody from "@/components/three/celestial/base/celestial-body.vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";


export async function tourUniverse(models: Array<typeof CelestialBody>,
                                   camera: PerspectiveCamera, controls: OrbitControls) {
  for (const [i, model] of models.entries()) {
    const object: Mesh = model.mesh();
    const { centre, size } = computeCentreAndSize(object);
    const offset = new Vector3(0, 0, size.length());
    const duration = calcDuration(controls.target, object.position,
      camera.position, offset);
    await animateCamera({
      object: { position: centre, quaternion: object.quaternion },
      camera,
      controls,
      offset,
      duration,
      delay: i === 0 ? 0 : 1.25,
    });
    // TODO: Emit event signalling model is focused on, to open factfile
  }
}
