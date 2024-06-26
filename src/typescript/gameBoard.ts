import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

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

  const basePlaneRotation = plane.rotation;

  // Create planes in the middle of each cell
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cellCenter = new Vector3(
        planeCenter.x - planeSize.x / 2 + cellWidth / 2 + j * cellWidth,
        planeCenter.y,
        planeCenter.z - planeSize.z / 2 + cellHeight / 2 + i * cellHeight
      );

      const cellPlane = MeshBuilder.CreatePlane(`cellPlane_${i}_${j}`, { width: cellWidth * 0.95, height: cellHeight * 0.95 }, scene);
      cellPlane.position = cellCenter;

      // Apply the same rotation as the base plane to each cell plane
      cellPlane.rotation = basePlaneRotation.clone();
      cellPlane.rotation.x += Math.PI / 2; // 90 degrees in radians

      // Optional: Set a material to the cell plane for visual distinction
      const cellMaterial = new StandardMaterial(`cellMaterial_${i}_${j}`, scene);
      cellMaterial.diffuseColor = new Color3(1, 1, 1); // Random color for each cell
      cellPlane.material = cellMaterial;
    }
  }

  // Create lines mesh for the grid
  const lines = MeshBuilder.CreateLineSystem("gridLines", { lines: gridLines }, scene);
  lines.color = new Color3(0, 0, 0);
}

export function placeGameBoard(scene: Scene, plane: Mesh) {
  createGrid(scene, plane, 10, 10); // Create a 10x10 grid
}
