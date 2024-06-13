import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector4 } from "@babylonjs/core";

function createMaterial(name: string, scene: Scene): StandardMaterial {
  const mat = new StandardMaterial(name, scene);
  const texture = new Texture("/assets/numbers.jpg", scene);
  mat.diffuseTexture = texture;
  return mat;
}

function createMesh(name: string, scene: Scene): Mesh {
  const height = 0.1;
  const width = 0.075;
  const depth = 0.025;

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

  const mesh = MeshBuilder.CreateBox(name, exampleRandomOptions, scene);
  mesh.material = createMaterial("ExampleMaterial", scene);
  return mesh;
}

export function getExampleRandomMesh(scene: Scene): Mesh {
  const exampleRandomMesh = createMesh("ExampleMesh", scene);
  return exampleRandomMesh;
}

function createJigsawMesh(): Mesh {
  const jigsawMesh = MeshBuilder.CreateBox("puzzlePart", { height: 0.15, width: 0.25, depth: 0.1 });
  var materialBox = new StandardMaterial("texture1");
  materialBox.diffuseColor = new Color3(0, 1, 0); //Green
  jigsawMesh.material = materialBox;
  return jigsawMesh;
}

export function getJigsawArray(): Array<Mesh> {
  const jigsawArray = [];
  for (let i = 0; i < 10; i++) {
    jigsawArray.push(createJigsawMesh());
  }
  return jigsawArray;
}
