import {
  WebXRAbstractMotionController,
  WebXRInputSource,
  Scene,
  AbstractMesh,
  WebXRDefaultExperience,
  Color3,
  WebXRControllerComponent,
} from "@babylonjs/core";

export function onMotionControllerInitObservable(
  scene: Scene,
  xrHelper: WebXRDefaultExperience,
  controller: WebXRInputSource,
  motionController: WebXRAbstractMotionController
) {
  const xr_ids = motionController.getComponentIds();
  const triggerComponent = motionController.getComponent(xr_ids[0]); // xr-standard-trigger

  triggerComponent.onButtonStateChangedObservable.add(() => {
    if (triggerComponent.changes.pressed) {
      handleMeshHighlighting(triggerComponent, scene, xrHelper, controller);
    }
  });
}

function handleMeshHighlighting(triggerComponent: WebXRControllerComponent, scene: Scene, xrHelper: WebXRDefaultExperience, controller: WebXRInputSource) {
  let mesh = scene.meshUnderPointer;
  console.log(mesh && mesh.name);

  if (xrHelper.pointerSelection.getMeshUnderPointer) {
    mesh = xrHelper.pointerSelection.getMeshUnderPointer(controller.uniqueId);
  }
  console.log(mesh && mesh.name);

  if (triggerComponent.pressed) {
    highlightMesh(mesh);
  } else {
    removeMeshHighlight(mesh);
  }
}

function highlightMesh(mesh: AbstractMesh) {
  if (mesh) {
    mesh.renderOutline = true;
    mesh.outlineColor = Color3.Red(); // Set the outline color to red
    mesh.outlineWidth = 0.02; // Set the outline width
  }
}

function removeMeshHighlight(mesh: AbstractMesh) {
  if (mesh) {
    mesh.renderOutline = false;
  }
}
