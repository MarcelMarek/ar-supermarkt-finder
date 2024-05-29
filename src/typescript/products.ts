import { MeshBuilder, Scene, StandardMaterial, Texture, Vector4 } from "@babylonjs/core";

function createMaterial(name: string, scene: Scene) {
  const mat = new StandardMaterial(name, scene);
  const texture = new Texture("/assets/numbers.jpg", scene);
  mat.diffuseTexture = texture;
  return mat;
}

function createMesh(name: string, scene: Scene) {
  const height = 1;
  const width = 0.75;
  const depth = 0.25;

  const columns = 6;
  const rows = 1;

  const faceUV = new Array(6);

  for (let i = 0; i < 6; i++) {
    faceUV[i] = new Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
  }

  const exampleRandomOptions = {
    faceUV: faceUV,
    wrap: true,
    // height: height,
    // width: width,
    // depth: depth,
  };

  const mesh = MeshBuilder.CreateBox(name, exampleRandomOptions, scene);
  mesh.material = createMaterial("ExampleMaterial", scene);
  return mesh;
}

export function getExampleRandomMesh(scene: Scene) {
  const exampleRandomMesh = createMesh("ExampleMesh", scene);
  return exampleRandomMesh;
}
