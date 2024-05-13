import { AbstractMesh, IWebXRAnchor, MeshBuilder, Scene, ShadowGenerator } from "@babylonjs/core";

export function addMeshForAnchorAddedObservable(scene: Scene, anchor: IWebXRAnchor, shadowGenerator: ShadowGenerator) {
  console.log("attaching", anchor);
  const cube = MeshBuilder.CreateBox("cube", {}, scene);
  cube.isVisible = true;
  anchor.attachedNode = cube.clone("cubeClone") as AbstractMesh;
  if (anchor.attachedNode) {
    shadowGenerator.addShadowCaster(anchor.attachedNode as AbstractMesh, true);
  }
  cube.isVisible = false;
}

export function removeMeshForAnchorRemovedObservable(anchor: any) {
  console.log("disposing", anchor);
  if (anchor) {
    anchor.attachedNode.isVisible = false;
    anchor.attachedNode.dispose();
  }
}
