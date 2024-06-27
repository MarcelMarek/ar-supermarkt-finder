import { Vector3 } from "@babylonjs/core";

export interface GridInterface {
  gridLines: [Vector3, Vector3][];
  planeSize: Vector3;
  cellWidth: number;
  cellHeight: number;
  planeCenter: Vector3;
}
