import { Button, Control, TextBlock } from "babylonjs-gui";

export function configHeader(header: TextBlock) {
  header.text = "Puzzle Game";
  header.height = "100px";
  header.color = "white";
  header.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  header.fontSize = "120";
}

export function configStartButton(startButton: Button) {
  startButton.background = "green";
  startButton.textBlock.text = "Wählen sie einen Tisch";
  startButton.width = 0.5;
  startButton.height = "80px";
  startButton.color = "white";
  startButton.background = "green";
  startButton.fontSize = 60;
}
