import { DirectionalLight, HemisphericLight, Scene, Vector3 } from "@babylonjs/core";
import { LightsInterface } from "./interfaces/light";

const lights = {} as LightsInterface;

export function createLights(scene: Scene) {
  lights.light1 = new HemisphericLight("HemisphericLight", new Vector3(0, 1, 0), scene);
  lights.light2 = new DirectionalLight("DirectionalLight", new Vector3(0, -1, -0.5), scene);
}
