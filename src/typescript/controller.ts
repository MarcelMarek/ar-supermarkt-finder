import {
  Ray,
  WebXRAbstractMotionController,
  WebXRInputSource,
  Scene,
  CreateCylinder,
  MeshBuilder,
  AbstractMesh,
  StandardMaterial,
  Color3,
  WebXRPlaneDetector,
} from "@babylonjs/core";
import { getJigsawArray } from "./products";

function createRayFromController(controller: WebXRInputSource): Ray {
  const origin = controller.pointer.position;
  const direction = controller.pointer.forward;
  return new Ray(origin, direction, (length = 100));
}

export function onMotionControllerPlacePuzzleInitObservable(
  scene: Scene,
  controller: WebXRInputSource,
  motionController: WebXRAbstractMotionController,
  draggedPart: any
) {
  const jigsawPuzzleParts = getJigsawArray();

  if (motionController.handness === "right") {
    const xr_ids = motionController.getComponentIds();
    let triggerComponent = motionController.getComponent(xr_ids[0]);
    triggerComponent.onButtonStateChangedObservable.add(() => {
      const resultRay = createRayFromController(controller);
      const raycastHit = scene.pickWithRay(resultRay);

      if (triggerComponent.pressed) {
        // Start dragging a jigsaw puzzle part
        if (raycastHit && raycastHit.hit && raycastHit.pickedMesh && jigsawPuzzleParts.includes(raycastHit.pickedMesh)) {
          draggedPart = raycastHit.pickedMesh;
        }
      } else {
        // Place the dragged jigsaw puzzle part on a plane
        if (draggedPart && raycastHit && raycastHit.hit && raycastHit.pickedMesh && raycastHit.pickedMesh.name === "plane") {
          draggedPart.position = raycastHit.pickedPoint;
          draggedPart.position.y += 0.05;
          draggedPart = null;
        }
      }
    });
  }
  if (motionController.handness === "left") {
    const plane = MeshBuilder.CreatePlane("uiPlane", { height: 0.7, width: 1.4 }, scene);
    plane.parent = controller.pointer;
    plane.position.z += 0.2;

    jigsawPuzzleParts.forEach((part, index) => {
      part.parent = plane;
      part.position.x = -1;
      part.position.x = index * 0.3 - 0.5; // Replace partHeight with the height of a part
      if (index > 2) part.isVisible = false;
    });

    const arrowUp = CreateCylinder("arrowUp", { height: 0.1, diameterTop: 0.1, diameterBottom: 0, tessellation: 4 }, scene);
    const arrowDown = CreateCylinder("arrowDown", { height: 0.1, diameterTop: 0, diameterBottom: 0.1, tessellation: 4 }, scene);
    arrowUp.parent = plane;
    arrowDown.parent = plane;
    arrowUp.position.x = 0.75; // Position the arrow above the plane
    arrowDown.position.x = -0.75; // Position the arrow below the plane
  }
}

export function onMotionControllerSelectDeskInitObservable(
  scene: Scene,
  controller: WebXRInputSource,
  motionController: WebXRAbstractMotionController,
  planes: AbstractMesh[]
) {
  if (motionController.handness === "right") {
    const xr_ids = motionController.getComponentIds();
    let triggerComponent = motionController.getComponent(xr_ids[0]);
    triggerComponent.onButtonStateChangedObservable.add(() => {
      const resultRay = createRayFromController(controller);
      const raycastHit = scene.pickWithRay(resultRay);

      if (triggerComponent.pressed) {
        if (raycastHit && raycastHit.hit && raycastHit.pickedMesh && planes.includes(raycastHit.pickedMesh)) {
          planes.forEach((plane) => {
            if (plane !== raycastHit.pickedMesh) {
              plane.dispose();
            }
          });
        }
      }
    });
  }
}
