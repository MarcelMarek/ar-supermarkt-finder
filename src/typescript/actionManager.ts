import { ActionManager, ExecuteCodeAction, IWebXRPlane, Mesh, Scene } from "@babylonjs/core";
import { AppState, getCurrentGameState } from "./gameStates";
import { getJigsawPieceOnController } from "./jigsaw";
import { getGameBoardCellIndex, placeGameBoard } from "./gameBoard";
import { getPlaneOnControllerIndex } from "./controller";

export function selectPlaneAsGameboard(scene: Scene, planes: Mesh[], plane: IWebXRPlane) {
  plane.mesh.actionManager = new ActionManager(scene);
  plane.mesh.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
      const currentState: AppState = getCurrentGameState();
      if (currentState === AppState.DESK_SELECT) {
        planes.forEach((_plane) => {
          if (_plane !== plane.mesh) {
            _plane.dispose();
          } else {
            placeGameBoard(scene, plane.mesh);
          }
        });
      }
    })
  );
}

export function placeJigsawPiecesOnPlanes(scene: Scene, cellPlane: Mesh) {
  cellPlane.actionManager = new ActionManager(scene);
  cellPlane.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
      if (AppState.GAME) {
        const gameBoardCellPointedAtId = getGameBoardCellIndex(cellPlane.name);
        const jigsawPieceOnController = getJigsawPieceOnController();
        const jigsawPieceOnControllerId = getPlaneOnControllerIndex(jigsawPieceOnController.name);
        if (jigsawPieceOnControllerId === gameBoardCellPointedAtId) {
          cellPlane.material = jigsawPieceOnController.material;
        }
      }
    })
  );
}
