import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { getJigsawPiecesArrayLength } from "./jigsaw";
import { GridInterface } from "./interfaces/grid";
import { placeJigsawPiecesOnPlanes } from "./actionManager";
import { JigsawPieceInterface } from "./interfaces/jigsaw";

function createGrid(scene: Scene, plane: Mesh, rows: number, cols: number) {
  const gridObjet = {} as GridInterface;
  gridObjet.gridLines = [];
  gridObjet.planeSize = plane.getBoundingInfo().boundingBox.extendSize.scale(2);
  gridObjet.cellWidth = gridObjet.planeSize.x / cols;
  gridObjet.cellHeight = gridObjet.planeSize.z / rows;
  gridObjet.planeCenter = plane.position; // Center of the plane

  // Vertical lines
  for (let i = 0; i <= cols; i++) {
    const xOffset = -gridObjet.planeSize.x / 2 + i * gridObjet.cellWidth;
    const start = new Vector3(gridObjet.planeCenter.x + xOffset, gridObjet.planeCenter.y, gridObjet.planeCenter.z - gridObjet.planeSize.z / 2);
    const end = new Vector3(gridObjet.planeCenter.x + xOffset, gridObjet.planeCenter.y, gridObjet.planeCenter.z + gridObjet.planeSize.z / 2);
    gridObjet.gridLines.push([start, end]);
  }

  // Horizontal lines
  for (let i = 0; i <= rows; i++) {
    const zOffset = -gridObjet.planeSize.z / 2 + i * gridObjet.cellHeight;
    const start = new Vector3(gridObjet.planeCenter.x - gridObjet.planeSize.x / 2, gridObjet.planeCenter.y, gridObjet.planeCenter.z + zOffset);
    const end = new Vector3(gridObjet.planeCenter.x + gridObjet.planeSize.x / 2, gridObjet.planeCenter.y, gridObjet.planeCenter.z + zOffset);
    gridObjet.gridLines.push([start, end]);
  }

  const basePlaneRotation = plane.rotation;

  // Create planes in the middle of each cell
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cellCenter = new Vector3(
        gridObjet.planeCenter.x - gridObjet.planeSize.x / 2 + gridObjet.cellWidth / 2 + j * gridObjet.cellWidth,
        gridObjet.planeCenter.y,
        gridObjet.planeCenter.z - gridObjet.planeSize.z / 2 + gridObjet.cellHeight / 2 + i * gridObjet.cellHeight
      );

      const cellPlane = {} as JigsawPieceInterface;
      cellPlane.name = `cellPlane_${i}_${j}`;
      cellPlane.mesh = MeshBuilder.CreatePlane(`cellPlane_${i}_${j}`, { width: gridObjet.cellWidth * 0.99, height: gridObjet.cellHeight * 0.99 }, scene);
      cellPlane.mesh.position = cellCenter;
      cellPlane.mesh.position.y += 0.05; // Slightly above the base plane

      // Apply the same rotation as the base plane to each cell plane
      cellPlane.mesh.rotation = basePlaneRotation.clone();
      cellPlane.mesh.rotation.x += Math.PI / 2; // 90 degrees in radians

      // Optional: Set a material to the cell plane for visual distinction
      const cellMaterial = new StandardMaterial(`cellMaterial_${i}_${j}`, scene);
      cellMaterial.diffuseColor = new Color3(1, 1, 1);
      cellPlane.mesh.material = cellMaterial;

      cellPlane.positionInArray = i * cols + j;

      cellPlane.mesh.isPickable = true;

      placeJigsawPiecesOnPlanes(scene, cellPlane); // @ActionManager
    }
  }

  // Create lines mesh for the grid
  const lines = MeshBuilder.CreateLineSystem("gridLines", { lines: gridObjet.gridLines }, scene);
  lines.color = new Color3(0, 0, 0);
}

export function placeGameBoard(scene: Scene, plane: Mesh) {
  const size = getJigsawPiecesArrayLength();
  createGrid(scene, plane, size / 2, size / 2); // Create a 10x10 grid
}
