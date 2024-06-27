import { FreeCamera, Scene, Vector3 } from "@babylonjs/core";
import { CameraInterface } from "./interfaces/camera";

const camera = {} as CameraInterface;

export function createCamera(scene: Scene, canvas: HTMLCanvasElement) {
  camera.camera = new FreeCamera("camera1", new Vector3(0, 1, -5), scene);
  configCamera(scene, canvas);
}

function configCamera(scene: Scene, canvas: HTMLCanvasElement) {
  camera.camera.setTarget(Vector3.Zero());
  camera.camera.attachControl(canvas, true);
}
