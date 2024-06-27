import { DirectionalLight, HemisphericLight, Scene, Vector3 } from "@babylonjs/core";
import { LightsInterface } from "./interfaces/light";

const lights = {} as LightsInterface;

export function createLights(scene: Scene) {
  lights.light1 = addHemisphericLight(scene);
  lights.light2 = addDirectionalLight(scene);
}

function addHemisphericLight(scene: Scene) {
  const light = new HemisphericLight("HemisphericLight", new Vector3(0, 1, 0), scene);
  return light;
}

function addDirectionalLight(scene: Scene) {
  const light = new DirectionalLight("DirectionalLight", new Vector3(0, -1, -0.5), scene);
  light.position = new Vector3(0, 5, -5);
  return light;
}
