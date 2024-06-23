import {
  Scene,
  Vector3,
  MeshBuilder,
  FreeCamera,
  Engine,
  WebXRPlaneDetector,
  Mesh,
  WebXRAnchorSystem,
  AbstractMesh,
  WebXRExperienceHelper,
} from "@babylonjs/core";
import { addPolygonForPlaneDetection, removePolygonForPlaneDetection, updatePolygonForPlaneDetection } from "./planeDetector";
import { addMeshForAnchorAddedObservable, removeMeshForAnchorRemovedObservable } from "./anchorSystem";
import { addDirectionalLight, addHemisphericLight } from "./light";
import { configGUIButton, configGUIHeader } from "./gui";
import { AdvancedDynamicTexture, Button, StackPanel, TextBlock } from "babylonjs-gui";
import { onMotionControllerInitObservable, onMotionControllerPlacePuzzleInitObservable, onMotionControllerSelectDeskInitObservable } from "./controller";

export var createScene = async function (engine: Engine, canvas: HTMLCanvasElement) {
  let isSelectingDesk = false;
  let isStartingGame = false;

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

  // Plane Detection
  const xrPlanes = featuresManager.enableFeature(WebXRPlaneDetector.Name, "latest") as WebXRPlaneDetector;

  const planes: Mesh[] = [];

  xrPlanes.onPlaneAddedObservable.add((plane) => {
    addPolygonForPlaneDetection(scene, planes, plane);
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

  // Controller

  xr.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add((motionController) => {
      onMotionControllerInitObservable(scene, xr, controller, motionController);
    });
  });

  if (isSelectingDesk) {
    xr.input.onControllerAddedObservable.add((controller) => {
      controller.onMotionControllerInitObservable.add((motionController) => {
        onMotionControllerSelectDeskInitObservable(scene, controller, motionController, planes);
      });
    });
  }

  if (isStartingGame) {
    xr.input.onControllerAddedObservable.add((controller) => {
      controller.onMotionControllerInitObservable.add((motionController) => {
        onMotionControllerPlacePuzzleInitObservable(scene, controller, motionController);
      });
    });
  }

  // GUI
  var guiPlane = MeshBuilder.CreatePlane("plane", {}) as AbstractMesh;
  guiPlane.position = new Vector3(0.4, 1.4, 0.4);
  var advancedTexture = AdvancedDynamicTexture.CreateForMesh(guiPlane) as AdvancedDynamicTexture;
  const panel = new StackPanel();
  advancedTexture.addControl(panel);
  const header = new TextBlock();
  const deskButton = Button.CreateSimpleButton("onoff", "Wählen sie einen Tisch");
  const puzzleButton = Button.CreateSimpleButton("onoff", "Starten Sie das Puzzle");

  configGUIHeader(header);
  configGUIButton(deskButton, "Wählen sie einen Tisch");
  configGUIButton(puzzleButton, "Starten Sie das Puzzle");

  deskButton.onPointerClickObservable.add(() => {
    isSelectingDesk = true;
  });

  puzzleButton.onPointerClickObservable.add(() => {
    isStartingGame = true;
  });

  panel.addControl(header);
  panel.addControl(deskButton);
  panel.addControl(puzzleButton);

  return scene;
};
