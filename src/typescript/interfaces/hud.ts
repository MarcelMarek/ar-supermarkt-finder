import { JigsawPieceInterface } from "./jigsaw";

export interface HUDInterface {
  manager: BABYLON.GUI.GUI3DManager;
  panel: BABYLON.GUI.StackPanel3D;
  currentIndex: number;
  amountOfPartsToShowInUi: number;
  partsToShowInUi: JigsawPieceInterface[];
  jigsawPartsInUi: BABYLON.GUI.MeshButton3D[];
  prevButton: BABYLON.GUI.Button3D;
  nextButton: BABYLON.GUI.Button3D;
}
