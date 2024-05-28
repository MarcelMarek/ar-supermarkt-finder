import { AbstractMesh, IWebXRAnchor, Scene } from "@babylonjs/core";
import { getExampleRandomMesh } from "./products";

export function addMeshForAnchorAddedObservable(scene: Scene, anchor: IWebXRAnchor) {
  console.log("attaching", anchor);
  const cube = getExampleRandomMesh(scene);
  cube.isVisible = true;
  anchor.attachedNode = cube.clone("cubeClone", cube) as AbstractMesh;
  cube.isVisible = false;
}

export function removeMeshForAnchorRemovedObservable(anchor: any) {
  console.log("disposing", anchor);
  if (anchor) {
    anchor.attachedNode.isVisible = false;
    anchor.attachedNode.dispose();
  }
}
