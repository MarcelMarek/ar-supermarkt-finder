import {
  AbstractMesh,
  Color3,
  CreatePlane,
  Mesh,
  MeshBuilder,
  Quaternion,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
  WebXRDefaultExperience,
  WebXRInputSource,
} from "@babylonjs/core";
import { JigsawPieceInterface } from "./interfaces/jigsaw";
import { shuffleArray } from "./helper";

let jigsawPieceOnController = null as Mesh;

function setJigsawPieceOnController(jigsawPiece: Mesh) {
  jigsawPieceOnController = jigsawPiece;
}

export function getJigsawPieceOnController() {
  return jigsawPieceOnController;
}

function createJigsawMesh(name: string, position: Vector3): JigsawPieceInterface {
  const jigsawMesh = MeshBuilder.CreateBox(name, { height: 0.15, width: 0.25, depth: 0.1 }) as AbstractMesh;
  const materialBox = new StandardMaterial("texture1");
  materialBox.diffuseColor = new Color3(0, 1, 0); // Green
  jigsawMesh.material = materialBox;
  jigsawMesh.position = position; // Set initial position (will be randomized later)
  return { name: name, mesh: jigsawMesh, correctPosition: position };
}

export function getJigsawPiecesArray(): Array<JigsawPieceInterface> {
  const jigsawArray: JigsawPieceInterface[] = [];
  const gridSize = Math.sqrt(10); // For example, for 10 parts
  for (let i = 0; i < 3; i++) {
    // Calculate grid position based on index
    const position = new Vector3((i % gridSize) * 0.3, 0, Math.floor(i / gridSize) * 0.3);
    jigsawArray.push(createJigsawMesh(`image_${i + 1}`, position));
  }
  return shuffleArray(jigsawArray); // Randomize the array
}

export const getJigsawPiecesArrayLength = () => getJigsawPiecesArray().length;

export function addControlsToPanel(
  panel: BABYLON.GUI.StackPanel3D,
  oldJigsawPartsInUi: BABYLON.GUI.MeshButton3D[],
  newJigsawPartsInUi: BABYLON.GUI.MeshButton3D[]
) {
  oldJigsawPartsInUi.forEach((part) => {
    if (panel.containsControl(part)) {
      panel.removeControl(part);
    }
  });
  newJigsawPartsInUi.forEach((part) => {
    if (panel.containsControl(part)) {
      return;
    } else {
      panel.addControl(part);
    }
  });
}

export function updateVisibleParts(jigsawParts: JigsawPieceInterface[], currentIndex: number, visiblePartsCount: number) {
  jigsawParts.forEach((part, index) => {
    part.mesh.isVisible = index >= currentIndex && index < currentIndex + visiblePartsCount;
  });
}

export function getVisibleParts(jigsawParts: JigsawPieceInterface[], currentIndex: number, visiblePartsCount: number) {
  return jigsawParts.slice(currentIndex, currentIndex + visiblePartsCount);
}

export function transformJigsawPieceToMeshButton3D(scene: Scene, xrHelper: WebXRDefaultExperience, part: JigsawPieceInterface) {
  const imageUrl = `../assets/${part.name}.jpg`;
  const plane = CreatePlane(`plane_${part.name}`, { width: 1.0, height: 1.0 }, scene);

  // Create a material and assign the texture to it
  const material = new StandardMaterial(`material_${part.name}`, scene);
  material.diffuseTexture = new Texture(imageUrl, scene);
  // Apply the material to the plane
  plane.material = material;

  // Create the MeshButton3D with the plane
  const button = new BABYLON.GUI.MeshButton3D(plane, `button_${part.name}`);
  button.pointerDownAnimation = () => {
    // Clone the plane mesh
    const clonedPlane = plane.clone(`clone_${part.name}`);
    stickJigsawPieceToController(xrHelper.input.controllers[0], clonedPlane);
  };

  return button;
}

function stickJigsawPieceToController(controller: WebXRInputSource, jigsawPiece: Mesh) {
  jigsawPiece.showBoundingBox = true;
  jigsawPiece.setParent(controller.motionController.rootMesh);
  jigsawPiece.position = Vector3.ZeroReadOnly;
  jigsawPiece.rotationQuaternion = Quaternion.Identity();
  if (controller.inputSource.handedness[0] === "l") {
    jigsawPiece.locallyTranslate(new Vector3(-0.6, 0, 0));
    setJigsawPieceOnController(jigsawPiece);
  } else {
    jigsawPiece.locallyTranslate(new Vector3(0.6, 0, 0));
    setJigsawPieceOnController(jigsawPiece);
  }
}
