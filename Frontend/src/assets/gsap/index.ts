import { CAM_FOCUS_DURATION_SCALE, MAX_CAM_FOCUS_DURATION, MIN_CAM_FOCUS_DURATION } from "@/assets/gsap/gsap.constants";
import { Vector3 } from "three/src/math/Vector3";


export function calcDuration(
  current: Vector3,
  target: Vector3,
  camPos: Vector3,
  offset: Vector3
): number {
  const targetCamPos = new Vector3(
    target.x + offset.x,
    target.y + offset.y,
    target.z + offset.z
  );

  const objectDist = current.distanceTo(target);
  const camDist = camPos.distanceTo(targetCamPos);
  const duration =
    MIN_CAM_FOCUS_DURATION +
    objectDist / CAM_FOCUS_DURATION_SCALE +
    camDist / CAM_FOCUS_DURATION_SCALE;
  return Math.min(duration, MAX_CAM_FOCUS_DURATION);
}

export { animateZoom } from "./zoom.animate";
export { animateCamera } from "./camera.animate";
