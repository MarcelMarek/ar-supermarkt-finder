import { AbstractMesh, Color3, CreatePlane, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { JigsawPart } from "./interfaces/jigsaw";
import { shuffleArray } from "./helper";
import { getPrevNextButton } from "./gui";

function createJigsawMesh(name: string, position: Vector3): JigsawPart {
  const jigsawMesh = MeshBuilder.CreateBox(name, { height: 0.15, width: 0.25, depth: 0.1 }) as AbstractMesh;
  var materialBox = new StandardMaterial("texture1");
  materialBox.diffuseColor = new Color3(0, 1, 0); // Green
  jigsawMesh.material = materialBox;
  jigsawMesh.position = position; // Set initial position (will be randomized later)
  return { name: name, mesh: jigsawMesh, correctPosition: position };
}

export function getJigsawPartsArray(): Array<JigsawPart> {
  const jigsawArray: JigsawPart[] = [];
  const gridSize = Math.sqrt(10); // For example, for 10 parts
  for (let i = 0; i < 3; i++) {
    // Calculate grid position based on index
    const position = new Vector3((i % gridSize) * 0.3, 0, Math.floor(i / gridSize) * 0.3);
    jigsawArray.push(createJigsawMesh(`image_${i + 1}`, position));
  }
  return shuffleArray(jigsawArray); // Randomize the array
}

export function loadJigsawGameUI(scene: any, xrHelper: any) {
  var manager = new BABYLON.GUI.GUI3DManager(scene);

  // Create a horizontal stack panel
  var panel = new BABYLON.GUI.StackPanel3D();
  panel.margin = 0.5;

  manager.addControl(panel);

  const visibleParts = getVisibleParts(getJigsawPartsArray(), 0, 3);

  const prevButton = getPrevNextButton("Previous");
  panel.addControl(prevButton);

  addJigsawPartsToUI(scene, panel, visibleParts[0]);
  addJigsawPartsToUI(scene, panel, visibleParts[1]);
  addJigsawPartsToUI(scene, panel, visibleParts[2]);

  const nextButton = getPrevNextButton("Next");
  panel.addControl(nextButton);

  panel.linkToTransformNode(scene.activeCamera);
  panel.position.addInPlaceFromFloats(0, -2, 6);
  panel.scaling.x = 0.6;
  panel.scaling.y = 0.6;

  xrHelper.baseExperience.sessionManager.onXRSessionInit.add(() => {
    panel.linkToTransformNode(xrHelper.baseExperience.camera);
  });
}

export function updateVisibleParts(jigsawParts: JigsawPart[], currentIndex: number, visiblePartsCount: number) {
  jigsawParts.forEach((part, index) => {
    part.mesh.isVisible = index >= currentIndex && index < currentIndex + visiblePartsCount;
  });
}

function getVisibleParts(jigsawParts: JigsawPart[], currentIndex: number, visiblePartsCount: number) {
  return jigsawParts.slice(currentIndex, currentIndex + visiblePartsCount);
}

export function addJigsawPartsToUI(scene: Scene, panel: any, part: JigsawPart) {
  const imageUrl = `../assets/${part.name}.jpg`;
  let plane = CreatePlane(`button_${part.name}`, { width: 1.25, height: 1.25 }, scene);

  // Create a material and assign the texture to it
  let material = new StandardMaterial(`material_${part.name}`, scene);
  material.diffuseTexture = new Texture(imageUrl, scene);
  // Apply the material to the plane
  plane.material = material;

  // Create the MeshButton3D with the plane
  let button = new BABYLON.GUI.MeshButton3D(plane, `button_${part.name}`);

  panel.addControl(button);
}
