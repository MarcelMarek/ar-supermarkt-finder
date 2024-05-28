import { AbstractMesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector4 } from "@babylonjs/core";

function createMaterial(scene: Scene) {
  const mat = new StandardMaterial("Material", scene);
  const texture = new Texture("./assets/numbers.png", scene);
  mat.diffuseTexture = texture;
  return mat;
}

function createMesh(scene: Scene) {
  const height = 1;
  const width = 0.75;
  const depth = 0.25;

  const mat = createMaterial(scene);

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

  return MeshBuilder.CreateBox("box", exampleRandomOptions, scene);
}

export function getExampleRandomMesh(scene: Scene) {
  const exampleRandomMesh = createMesh(scene);
  return exampleRandomMesh;
}
