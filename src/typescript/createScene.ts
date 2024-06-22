import { Scene, Vector3, MeshBuilder, FreeCamera, Engine, WebXRPlaneDetector, Mesh, WebXRAnchorSystem, CreateCylinder } from "@babylonjs/core";
import { addPolygonForPlaneDetection, removePolygonForPlaneDetection, updatePolygonForPlaneDetection } from "./planeDetector";
import { addMeshForAnchorAddedObservable, removeMeshForAnchorRemovedObservable } from "./anchorSystem";
import { addDirectionalLight, addHemisphericLight } from "./light";
import { getJigsawArray } from "./products";
import { createRayFromController } from "./controller";
import { configHeader, configStartButton } from "./gui";
import { AdvancedDynamicTexture, Button, StackPanel, TextBlock } from "babylonjs-gui";

export var createScene = async function (engine: Engine, canvas: HTMLCanvasElement) {
  var scene = new Scene(engine);

  var camera = new FreeCamera("camera1", new Vector3(0, 1, -5), scene); // creates and positions a free camera (non-mesh)
  camera.setTarget(Vector3.Zero()); // targets the camera to scene origin
  camera.attachControl(canvas, true); // attaches the camera to the canvas

  addDirectionalLight(scene);
  addHemisphericLight(scene);

  var xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      requiredFeatures: ["plane-detection"],
      referenceSpaceType: "local-floor",
    },
    optionalFeatures: true,
  });

  // Hit-Test to search for walls
  const featuresManager = xr.baseExperience.featuresManager;
  xr.input.onControllerAddedObservable.add((controller) => {
    let draggedPart = null;
    const jigsawPuzzleParts = getJigsawArray();

    controller.onMotionControllerInitObservable.add((motionController) => {
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
        // Add a plane to the left controller
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
    });
  });

  // Plane Detection
  const xrPlanes = featuresManager.enableFeature(WebXRPlaneDetector.Name, "latest") as WebXRPlaneDetector;

  const planes: Mesh[] = [];

  xrPlanes.onPlaneAddedObservable.add((plane) => {
    addPolygonForPlaneDetection(scene, planes, plane);
  });

  xrPlanes.onPlaneUpdatedObservable.add((plane) => {
    updatePolygonForPlaneDetection(scene, planes, plane);
  });

  xrPlanes.onPlaneRemovedObservable.add((plane) => {
    removePolygonForPlaneDetection(planes, plane);
  });

  xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
    planes.forEach((plane) => plane.dispose());
    while (planes.pop()) {}
  });

  // Anchors

  const anchors = featuresManager.enableFeature(WebXRAnchorSystem.Name, "latest", {
    doNotRemoveAnchorsOnSessionEnded: true,
  }) as WebXRAnchorSystem;

  if (anchors) {
    anchors.onAnchorAddedObservable.add((anchor) => {
      addMeshForAnchorAddedObservable(scene, anchor);
    });

    anchors.onAnchorRemovedObservable.add((anchor) => {
      removeMeshForAnchorRemovedObservable(anchor);
    });
  }

  // GUI
  var plane = MeshBuilder.CreatePlane("plane", {}) as Mesh;
  plane.position = new Vector3(0.4, 1.4, 0.4);
  var advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane) as AdvancedDynamicTexture;
  const panel = new StackPanel();
  advancedTexture.addControl(panel);
  const header = new TextBlock();
  const deskButton = Button.CreateSimpleButton("onoff", "Wählen sie einen Tisch");

  configHeader(header);
  configStartButton(deskButton);

  panel.addControl(header);
  panel.addControl(deskButton);

  return scene;
};
