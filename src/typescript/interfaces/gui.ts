import { AbstractMesh } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, StackPanel, TextBlock } from "babylonjs-gui";

export interface GUIInterface {
  guiPlane: AbstractMesh;
  advancedTexture: AdvancedDynamicTexture;
  panel: StackPanel;
  header: TextBlock;
  deskButton: Button;
  puzzleButton: Button;
}
