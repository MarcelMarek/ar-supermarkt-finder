import { Scene, Vector3, MeshBuilder, FreeCamera, Engine, WebXRPlaneDetector, Mesh, WebXRAnchorSystem } from "@babylonjs/core";
import { addPolygonForPlaneDetection, removePolygonForPlaneDetection, updatePolygonForPlaneDetection } from "./planeDetector";
import { addMeshForAnchorAddedObservable, removeMeshForAnchorRemovedObservable } from "./anchorSystem";
import { addDirectionalLight, addHemisphericLight } from "./light";
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
    console.log("anchors attached");
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
