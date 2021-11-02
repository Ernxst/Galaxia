import { gsap } from "gsap";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { ZOOM_DURATION } from "./gsap.constants";

export default function (finalZoom: number, camera: PerspectiveCamera) {
  const anim = { zoom: camera.zoom };
  gsap.to(anim, {
    zoom: finalZoom,
    duration: ZOOM_DURATION,
    onUpdate() {
      camera.zoom = anim.zoom;
      camera.updateProjectionMatrix();
    },
    onComplete() {
      camera.updateProjectionMatrix();
    },
  });
}
