import { AbstractMesh } from "@babylonjs/core";

export interface JigsawPieceInterface {
  name: string;
  mesh: AbstractMesh;
  positionInArray: number;
}
