import { Scene, Vector3, MeshBuilder, FreeCamera, Engine, WebXRPlaneDetector, Mesh, AbstractMesh } from "@babylonjs/core";
import { addXrPlanesObserver, getPlanes } from "./planeDetector";
import { addDirectionalLight, addHemisphericLight } from "./light";
import { configGUIButton, configGUIHeader } from "./gui";
import { AdvancedDynamicTexture, Button, StackPanel, TextBlock } from "babylonjs-gui";
import { onMotionControllerInitObservable } from "./controller";
import { AppState, changeState } from "./gameStates";
import { loadJigsawGameUI as loadJigsawGameHUD } from "./jigsaw";
import { WebXRDefaultExperience } from "@babylonjs/core";

export const createScene = async function (engine: Engine, canvas: HTMLCanvasElement) {
  const scene = new Scene(engine);

  const camera = new FreeCamera("camera1", new Vector3(0, 1, -5), scene); // creates and positions a free camera (non-mesh)
  camera.setTarget(Vector3.Zero()); // targets the camera to scene origin
  camera.attachControl(canvas, true); // attaches the camera to the canvas

  addDirectionalLight(scene);
  addHemisphericLight(scene);

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

  addXrPlanesObserver(xrHelper, scene, xrPlanes);

  xrHelper.baseExperience.sessionManager.onXRSessionInit.add(() => {
    planes.forEach((plane) => plane.dispose());
  });

  // Controller
  xrHelper.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add(() => {
      onMotionControllerInitObservable(scene, xrHelper, controller, controller.motionController);
    });
  });

  // GUI
  const guiPlane = MeshBuilder.CreatePlane("plane", {}) as AbstractMesh;
  guiPlane.position = new Vector3(0.4, 1.4, 0.4);
  const advancedTexture = AdvancedDynamicTexture.CreateForMesh(guiPlane) as AdvancedDynamicTexture;
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

  loadJigsawGameHUD(scene, xrHelper);
  puzzleButton.onPointerClickObservable.add(() => {
    changeState(AppState.GAME);
  });

  panel.addControl(header);
  panel.addControl(deskButton);
  panel.addControl(puzzleButton);

  return scene;
};
