import { Button, Control, TextBlock } from "babylonjs-gui";

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

export function getPrevNextButton(buttonText: string) {
  const button = new BABYLON.GUI.Button3D(buttonText);
  var text1 = new BABYLON.GUI.TextBlock();
  text1.text = buttonText;
  text1.color = "white";
  text1.fontSize = 24;
  button.content = text1;
  return button;
}
