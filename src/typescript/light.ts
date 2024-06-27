import { DirectionalLight, HemisphericLight, Scene, Vector3 } from "@babylonjs/core";

export function addHemisphericLight(scene: Scene) {
  const light = new HemisphericLight("HemisphericLight", new Vector3(0, 1, 0), scene);
  return light;
}

export function addDirectionalLight(scene: Scene) {
  const light = new DirectionalLight("DirectionalLight", new Vector3(0, -1, -0.5), scene);
  light.position = new Vector3(0, 5, -5);
  return light;
}
