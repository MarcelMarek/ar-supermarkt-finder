import { AdvancedDynamicTexture, Button, Control, StackPanel, TextBlock } from "babylonjs-gui";
import { addControlsToPanel, getJigsawPiecesArray, getVisibleParts, transformJigsawPieceToMeshButton3D } from "./jigsaw";
import { AbstractMesh, MeshBuilder, Scene, Vector3, WebXRDefaultExperience } from "@babylonjs/core";
import { GUIInterface } from "./interfaces/gui";
import { AppState, changeState } from "./gameStates";

const gui = {} as GUIInterface;

export function createGUI() {
  gui.guiPlane = MeshBuilder.CreatePlane("plane", {}) as AbstractMesh;
  configGuiPlane();
  gui.advancedTexture = AdvancedDynamicTexture.CreateForMesh(gui.guiPlane) as AdvancedDynamicTexture;
  gui.panel = new StackPanel();
  gui.advancedTexture.addControl(gui.panel);
  gui.header = new TextBlock();
  gui.deskButton = Button.CreateSimpleButton("onoff", "Wählen sie einen Tisch");
  gui.puzzleButton = Button.CreateSimpleButton("onoff", "Starten Sie das Puzzle");
  configGUIHeader(gui.header);
  configGUIButton(gui.deskButton, "Wählen sie einen Tisch");
  configGUIButton(gui.puzzleButton, "Starten Sie das Puzzle");

  gui.deskButton.onPointerClickObservable.add(() => {
    changeState(AppState.DESK_SELECT);
    gui.deskButton.textBlock.text = "Ausgewählt";
  });

  gui.puzzleButton.onPointerClickObservable.add(() => {
    changeState(AppState.GAME);
  });

  gui.panel.addControl(gui.header);
  gui.panel.addControl(gui.deskButton);
  gui.panel.addControl(gui.puzzleButton);
}

export function configGuiPlane() {
  gui.guiPlane.position = new Vector3(0.4, 1.4, 0.4);
}

export function configGUIHeader(header: TextBlock) {
  header.text = "Puzzle Game";
  header.height = "100px";
  header.color = "white";
  header.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  header.fontSize = "120";
}

export function configGUIButton(button: Button, buttonText: string) {
  button.background = "green";
  button.textBlock.text = buttonText;
  button.width = 0.5;
  button.height = "150px";
  button.color = "white";
  button.background = "green";
  button.fontSize = 60;
}

export function getPrevNextButton(
  xrHelper: WebXRDefaultExperience,
  scene: Scene,
  buttonText: string,
  panel: BABYLON.GUI.StackPanel3D,
  currentIndex: number,
  amountOfPartsToShowInUi: number
) {
  const button = new BABYLON.GUI.Button3D(buttonText);
  const text1 = new BABYLON.GUI.TextBlock();
  text1.text = buttonText;
  text1.color = "white";
  text1.fontSize = 48;
  button.content = text1;

  switch (buttonText) {
    case "Previous":
      // Logic for previous button
      button.onPointerClickObservable.add(() => {
        const allJigsawPieces = getJigsawPiecesArray();
        const oldPartsToShowInUi = getVisibleParts(allJigsawPieces, currentIndex, amountOfPartsToShowInUi);
        currentIndex = currentIndex - 1 < 0 ? currentIndex - 1 : currentIndex;
        const partsToShowInUi = getVisibleParts(getJigsawPiecesArray(), currentIndex, amountOfPartsToShowInUi);

        const oldJigsawPartsInUi = oldPartsToShowInUi.map((part) => transformJigsawPieceToMeshButton3D(scene, xrHelper, part));

        const jigsawPartsInUi = partsToShowInUi.map((part) => transformJigsawPieceToMeshButton3D(scene, xrHelper, part));

        addControlsToPanel(panel, oldJigsawPartsInUi, jigsawPartsInUi);
      });
      break;
    case "Next":
      // Logic for next button
      button.onPointerClickObservable.add(() => {
        const allJigsawPieces = getJigsawPiecesArray();
        const oldPartsToShowInUi = getVisibleParts(allJigsawPieces, currentIndex, amountOfPartsToShowInUi);
        currentIndex = currentIndex + 1 < allJigsawPieces.length ? currentIndex + 1 : currentIndex;
        const partsToShowInUi = getVisibleParts(allJigsawPieces, currentIndex, amountOfPartsToShowInUi);

        const oldJigsawPartsInUi = oldPartsToShowInUi.map((part) => transformJigsawPieceToMeshButton3D(scene, xrHelper, part));
        const jigsawPartsInUi = partsToShowInUi.map((part) => transformJigsawPieceToMeshButton3D(scene, xrHelper, part));

        addControlsToPanel(panel, oldJigsawPartsInUi, jigsawPartsInUi);
      });
      break;
    default:
      console.error("Invalid button type");
  }

  return button;
}
