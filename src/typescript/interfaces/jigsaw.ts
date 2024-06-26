import { AbstractMesh, Vector3 } from "@babylonjs/core";

export interface JigsawPiece {
  name: string;
  mesh: AbstractMesh;
  correctPosition: Vector3;
}
