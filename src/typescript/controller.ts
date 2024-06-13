import { Ray, WebXRInputSource } from "@babylonjs/core";

export function createRayFromController(controller: WebXRInputSource): Ray {
  const origin = controller.pointer.position;
  const direction = controller.pointer.forward;
  return new Ray(origin, direction, (length = 100));
}
