import { Scene, Vector3, MeshBuilder, FreeCamera, Engine, WebXRPlaneDetector, Mesh, WebXRAnchorSystem, AbstractMesh } from "@babylonjs/core";
import { addPolygonForPlaneDetection, removePolygonForPlaneDetection, updatePolygonForPlaneDetection } from "./planeDetector";
import { addMeshForAnchorAddedObservable, removeMeshForAnchorRemovedObservable } from "./anchorSystem";
import { addDirectionalLight, addHemisphericLight } from "./light";
import { configGUIButton, configGUIHeader } from "./gui";
import { AdvancedDynamicTexture, Button, StackPanel, TextBlock } from "babylonjs-gui";
import { onMotionControllerInitObservable, setupGameControllerInteractions } from "./controller";
import { AppState, changeState, getCurrentGameState } from "./gameStates";
import { getJigsawArray } from "./products";

export var createScene = async function (engine: Engine, canvas: HTMLCanvasElement) {
  let currentState: AppState = getCurrentGameState();
  var scene = new Scene(engine);

  var camera = new FreeCamera("camera1", new Vector3(0, 1, -5), scene); // creates and positions a free camera (non-mesh)
  camera.setTarget(Vector3.Zero()); // targets the camera to scene origin
  camera.attachControl(canvas, true); // attaches the camera to the canvas

  addDirectionalLight(scene);
  addHemisphericLight(scene);

  var xrHelper = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      requiredFeatures: ["plane-detection"],
      referenceSpaceType: "local-floor",
    },
    optionalFeatures: true,
  });

  // Hit-Test to search for walls
  const featuresManager = xrHelper.baseExperience.featuresManager;

  // Plane Detection
  const xrPlanes = featuresManager.enableFeature(WebXRPlaneDetector.Name, "latest") as WebXRPlaneDetector;

  const planes: Mesh[] = [];

  xrPlanes.onPlaneAddedObservable.add((plane) => {
    addPolygonForPlaneDetection(scene, planes, plane);
  });

  xrPlanes.onPlaneRemovedObservable.add((plane) => {
    removePolygonForPlaneDetection(planes, plane);
  });

  xrHelper.baseExperience.sessionManager.onXRSessionInit.add(() => {
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

  xrHelper.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add((motionController) => {
      onMotionControllerInitObservable(scene, xrHelper, controller, controller.motionController);
    });
  });

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
    changeState(AppState.DESK_SELECT);
    deskButton.textBlock.text = "Ausgewählt";
  });

  puzzleButton.onPointerClickObservable.add(() => {
    changeState(AppState.GAME);
    const controllers = xrHelper.input.controllers;
    controllers.forEach((controller) => {
      setupGameControllerInteractions(scene, controller, getJigsawArray());
    });
  });

  panel.addControl(header);
  panel.addControl(deskButton);
  panel.addControl(puzzleButton);

  return scene;
};
