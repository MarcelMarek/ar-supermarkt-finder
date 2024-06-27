import { AbstractMesh, Vector3 } from "@babylonjs/core";

export interface JigsawPieceInterface {
  name: string;
  mesh: AbstractMesh;
  correctPosition: Vector3;
}
