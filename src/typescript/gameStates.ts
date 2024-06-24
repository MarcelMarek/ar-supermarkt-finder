export enum AppState {
  MENU,
  DESK_SELECT,
  GAME,
  GAME_OVER,
}

let currentState: AppState = AppState.MENU;

// Example of changing the state
export function changeState(newState: AppState) {
  currentState = newState;
  console.log(`State changed to: ${AppState[newState]}`);
}

export function getCurrentGameState() {
  return currentState;
}
