import {
  Scene,
  Vector3,
  MeshBuilder,
  FreeCamera,
  WebXRHitTest,
  Quaternion,
  Engine,
  WebXRPlaneDetector,
  Mesh,
  WebXRAnchorSystem,
  DirectionalLight,
  WebXRState,
} from "@babylonjs/core";
import { addPolygonForPlaneDetection, removePolygonForPlaneDetection, updatePolygonForPlaneDetection } from "./planeDetector";

import { addMeshForAnchorAddedObservable, removeMeshForAnchorRemovedObservable } from "./anchorSystem";
import { addDirectionalLight, addHemisphericLight } from "./light";

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

  const xrTest = featuresManager.enableFeature(WebXRHitTest, "latest") as WebXRHitTest;

  const marker = MeshBuilder.CreateTorus("marker", { diameter: 0.15, thickness: 0.05 }); // torus to see if horizontal or vertical wall
  marker.isVisible = false;
  marker.rotationQuaternion = new Quaternion(); // for smooth and stable rotation calculations

  let hitTest;

  xrTest.onHitTestResultObservable.add((results) => {
    if (results.length) {
      marker.isVisible = true;
      hitTest = results[0];
      hitTest.transformationMatrix.decompose(marker.scaling, marker.rotationQuaternion, marker.position);
    } else {
      marker.isVisible = false;
    }
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

  const anchors = featuresManager.enableFeature(WebXRAnchorSystem.Name, "latest") as WebXRAnchorSystem;

  if (anchors) {
    console.log("anchors attached");
    anchors.onAnchorAddedObservable.add((anchor) => {
      addMeshForAnchorAddedObservable(scene, anchor);
    });

    anchors.onAnchorRemovedObservable.add((anchor) => {
      removeMeshForAnchorRemovedObservable(anchor);
    });
  }

  scene.onPointerDown = (evt, pickInfo) => {
    if (hitTest && anchors && xr.baseExperience.state === WebXRState.IN_XR) {
      anchors.addAnchorPointUsingHitTestResultAsync(hitTest);
    }
  };

  return scene;
};
