import { AbstractMesh, MeshBuilder, ShadowGenerator, StandardMaterial, Texture, Vector4 } from "@babylonjs/core";

const height = 1;
const width = 0.75;
const depth = 0.25;

const mat = new StandardMaterial("mat");
const texture = new Texture("./assets/numbers.png");
mat.diffuseTexture = texture;

const columns = 6;
const rows = 1;
const faceUV = new Array(6);

for (let i = 0; i < 6; i++) {
  faceUV[i] = new Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
}

const exampleRandomOptions = {
  faceUV: faceUV,
  wrap: true,
  height: height,
  width: width,
  depth: depth,
};

export function getExampleRandomMesh(shadowGenerator: ShadowGenerator) {
  const exampleRandomMesh = MeshBuilder.CreateBox("box", exampleRandomOptions) as AbstractMesh;
  shadowGenerator.addShadowCaster(exampleRandomMesh, true);
  return exampleRandomMesh;
}
