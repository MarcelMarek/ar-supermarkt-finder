import { Scene, Vector3, HemisphericLight, MeshBuilder, FreeCamera, WebXRHitTest, Quaternion, Engine, WebXRPlaneDetector, Mesh } from "@babylonjs/core";
import { addPolygonForPlaneDetection, removePolygonForPlaneDetection, updatePolygonForPlaneDetection } from "./planeDetector";

export var createScene = async function (engine: Engine, canvas: HTMLCanvasElement) {
  var scene = new Scene(engine);

  var camera = new FreeCamera("camera1", new Vector3(0, 1, -5), scene); // creates and positions a free camera (non-mesh)
  camera.setTarget(Vector3.Zero()); // targets the camera to scene origin
  camera.attachControl(canvas, true); // attaches the camera to the canvas

  var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene); // light, aiming 0,1,0 to the sky (non-mesh)
  light.intensity = 0.7; // Default intensity is 1. So dimmed little bit

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

  xrTest.onHitTestResultObservable.add((results) => {
    if (results.length) {
      marker.isVisible = true;
      const hitTest = results[0];
      hitTest.transformationMatrix.decompose(marker.scaling, marker.rotationQuaternion, marker.position);
    } else {
      marker.isVisible = false;
    }
  });

  // Plane Detection for shelves
  const xrPlanes = featuresManager.enableFeature(WebXRPlaneDetector.Name, "latest") as WebXRPlaneDetector;

  const planes: Mesh[] = [];

  xrPlanes.onPlaneAddedObservable.add((plane) => {
    // ... do what you want with the plane after it was added
    addPolygonForPlaneDetection(scene, planes, plane);
  });

  xrPlanes.onPlaneUpdatedObservable.add((plane) => {
    // ... do what you want with the plane after it was updated
    updatePolygonForPlaneDetection(scene, planes, plane);
  });

  xrPlanes.onPlaneRemovedObservable.add((plane) => {
    // ... do what you want with the plane after it was removed
    removePolygonForPlaneDetection(planes, plane);
  });

  xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
    planes.forEach((plane) => plane.dispose());
    while (planes.pop()) {}
  });

  return scene;
};
