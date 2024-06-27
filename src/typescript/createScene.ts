import { Scene, Engine, WebXRPlaneDetector, Mesh } from "@babylonjs/core";
import { createLights } from "./light";
import { createGUI } from "./gui";
import { onMotionControllerInitObservable } from "./controller";
import { WebXRDefaultExperience } from "@babylonjs/core";
import { createHUD } from "./hud";
import { createCamera } from "./camera";
import { createXrPlanesObserver, getPlanes } from "./planeDetector";

export const createScene = async function (engine: Engine, canvas: HTMLCanvasElement) {
  const scene = new Scene(engine);

  createCamera(scene, canvas);
  createLights(scene);

  const xrHelper = (await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      requiredFeatures: ["plane-detection"],
      referenceSpaceType: "local-floor",
    },
    optionalFeatures: true,
  })) as WebXRDefaultExperience;

  // Hit-Test to search for walls
  const featuresManager = xrHelper.baseExperience.featuresManager;

  // Plane Detection
  const xrPlanes = featuresManager.enableFeature(WebXRPlaneDetector.Name, "latest") as WebXRPlaneDetector;
  const planes = getPlanes() as Mesh[];

  createXrPlanesObserver(scene, xrPlanes);

  xrHelper.baseExperience.sessionManager.onXRSessionInit.add(() => {
    planes.forEach((plane) => plane.dispose());
    while (planes.pop()) {
      /* empty */
    }
  });

  // Controller
  xrHelper.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add(() => {
      onMotionControllerInitObservable(scene, xrHelper, controller, controller.motionController);
    });
  });

  // GUI

  createGUI();
  createHUD(scene, xrHelper);

  return scene;
};
