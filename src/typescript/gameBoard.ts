import { Color3, Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { AppState } from "./gameStates";
import { getPlanes } from "./planeDetector";

function createGrid(scene: Scene, plane: Mesh, rows: number, cols: number) {
  const gridLines = [];
  const planeSize = plane.getBoundingInfo().boundingBox.extendSize.scale(2);
  const cellWidth = planeSize.x / cols;
  const cellHeight = planeSize.z / rows;
  const planeCenter = plane.position; // Center of the plane

  // Vertical lines
  for (let i = 0; i <= cols; i++) {
    const xOffset = -planeSize.x / 2 + i * cellWidth;
    const start = new Vector3(planeCenter.x + xOffset, planeCenter.y, planeCenter.z - planeSize.z / 2);
    const end = new Vector3(planeCenter.x + xOffset, planeCenter.y, planeCenter.z + planeSize.z / 2);
    gridLines.push([start, end]);
  }

  // Horizontal lines
  for (let i = 0; i <= rows; i++) {
    const zOffset = -planeSize.z / 2 + i * cellHeight;
    const start = new Vector3(planeCenter.x - planeSize.x / 2, planeCenter.y, planeCenter.z + zOffset);
    const end = new Vector3(planeCenter.x + planeSize.x / 2, planeCenter.y, planeCenter.z + zOffset);
    gridLines.push([start, end]);
  }

  // Create lines mesh for the grid
  const lines = MeshBuilder.CreateLineSystem("gridLines", { lines: gridLines }, scene);
  lines.color = new Color3(0, 0, 0);
}

export function placeGameBoard(scene: Scene, plane: Mesh) {
  createGrid(scene, plane, 10, 10); // Create a 10x10 grid
}
