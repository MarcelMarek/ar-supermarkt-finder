import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { babylonInit } from "./typescript/babylonInit";

class App {
  constructor() {
    // Register a render loop to repeatedly render the scene
    babylonInit().then(() => {
      // scene started rendering, everything is initialized
    });
  }
}
new App();
