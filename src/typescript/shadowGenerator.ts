import { DirectionalLight, Scene, ShadowGenerator, Vector3 } from "@babylonjs/core";

export function createShadowGenerator(scene: Scene) {
  const light = new DirectionalLight("dir01", new Vector3(-1, -2, -1), scene);
  const shadowGenerator = new ShadowGenerator(1024, light);
  return shadowGenerator;
}
