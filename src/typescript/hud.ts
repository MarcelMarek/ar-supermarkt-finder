import { Scene, WebXRDefaultExperience } from "@babylonjs/core";
import { addControlsToPanel, getJigsawPiecesArray, getVisibleParts, transformJigsawPieceToMeshButton3D } from "./jigsaw";
import { getPrevNextButton } from "./gui";
import { HUDInterface } from "./interfaces/hud";

const hud = {} as HUDInterface;

export function createHUD(scene: Scene, xrHelper: WebXRDefaultExperience) {
  hud.manager = new BABYLON.GUI.GUI3DManager(scene);

  // Create a horizontal stack panel
  hud.panel = new BABYLON.GUI.StackPanel3D();
  hud.panel.isVertical = false;
  hud.panel.margin = 1.2;

  hud.manager.addControl(hud.panel);

  hud.currentIndex = 0;
  hud.amountOfPartsToShowInUi = 1;

  hud.partsToShowInUi = getVisibleParts(getJigsawPiecesArray(), hud.currentIndex, hud.amountOfPartsToShowInUi);

  hud.jigsawPartsInUi = hud.partsToShowInUi.map((part) => transformJigsawPieceToMeshButton3D(scene, xrHelper, part));

  hud.prevButton = getPrevNextButton(xrHelper, scene, "Previous", hud.panel, hud.currentIndex, hud.amountOfPartsToShowInUi);
  hud.nextButton = getPrevNextButton(xrHelper, scene, "Next", hud.panel, hud.currentIndex, hud.amountOfPartsToShowInUi);

  hud.panel.blockLayout = true;
  hud.panel.addControl(hud.prevButton);
  addControlsToPanel(hud.panel, hud.jigsawPartsInUi, hud.jigsawPartsInUi);
  hud.panel.addControl(hud.nextButton);
  hud.panel.blockLayout = false;

  hud.panel.linkToTransformNode(scene.activeCamera);
  hud.panel.position.addInPlaceFromFloats(0, -2, 6);
  hud.panel.scaling.x = 0.6;
  hud.panel.scaling.y = 0.6;

  xrHelper.baseExperience.sessionManager.onXRSessionInit.add(() => {
    hud.panel.linkToTransformNode(xrHelper.baseExperience.camera);
  });
}
