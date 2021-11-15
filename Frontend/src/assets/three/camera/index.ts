import { animateZoom } from "@/assets/gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { ROLL_FACTOR, ROTATE_FACTOR, ZOOM_FACTOR } from "./camera.constants";


export function rotate(camera: PerspectiveCamera, radians: number) {
  camera.position.y *= Math.sin(radians) * ROTATE_FACTOR;
  camera.position.z *= Math.cos(radians) * ROTATE_FACTOR;
}

export function tilt(camera: PerspectiveCamera, radians: number) {
  camera.rotation.z += Math.cos(radians) * ROLL_FACTOR;
}

export function setZoom(camera: PerspectiveCamera, zoom: number) {
  const finalZoom = zoom * ZOOM_FACTOR;
  animateZoom(finalZoom, camera);
}

export function zoomIn(camera: PerspectiveCamera, times: number) {
  const finalZoom = camera.zoom + times * ZOOM_FACTOR;
  animateZoom(finalZoom, camera);
}

export function zoomOut(camera: PerspectiveCamera, times: number) {
  const finalZoom = camera.zoom - times * ZOOM_FACTOR;
  animateZoom(finalZoom, camera);
}

export function moveUp(camera: PerspectiveCamera, delta: number) {
  camera.position.y += delta;
}

export function moveDown(camera: PerspectiveCamera, delta: number) {
  camera.position.y -= delta;
}

export function moveLeft(camera: PerspectiveCamera, delta: number) {
  camera.position.x -= delta;
}

export function moveRight(camera: PerspectiveCamera, delta: number) {
  camera.position.x += delta;
}

export function panUp(orbitControls: OrbitControls, delta: number) {
  orbitControls.target.y += delta;
}

export function panDown(orbitControls: OrbitControls, delta: number) {
  orbitControls.target.y -= delta;
}

export function panLeft(orbitControls: OrbitControls, delta: number) {
  orbitControls.target.x -= delta;
}

export function panRight(orbitControls: OrbitControls, delta: number) {
  orbitControls.target.x += delta;
}
