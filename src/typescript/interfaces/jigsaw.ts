import { AbstractMesh, Vector3 } from "@babylonjs/core";

export interface JigsawPart {
  name: string;
  mesh: AbstractMesh;
  correctPosition: Vector3;
}
