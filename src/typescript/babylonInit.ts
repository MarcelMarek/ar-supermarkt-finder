import { Engine, WebGPUEngine } from "@babylonjs/core";
import { createScene } from "./createScene";

export const babylonInit = async (): Promise<void> => {
  const engineType = location.search.split("engine=")[1]?.split("&")[0] || "webgl";
  // Get the canvas element
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  // Generate the BABYLON 3D engine
  let engine: Engine;
  if (engineType === "webgpu") {
    const webGPUSupported = await WebGPUEngine.IsSupportedAsync;
    if (webGPUSupported) {
      // You can decide which WebGPU extensions to load when creating the engine. I am loading all of them
      await import("@babylonjs/core/Engines/WebGPU/Extensions/");
      const webgpu = (engine = new WebGPUEngine(canvas, {
        adaptToDeviceRatio: true,
        antialias: true,
      }));
      await webgpu.initAsync();
      engine = webgpu;
    } else {
      engine = new Engine(canvas, true);
    }
  } else {
    engine = new Engine(canvas, true);
  }

  // Create the scene
  const scene = await createScene(engine, canvas);

  // JUST FOR TESTING. Not needed for anything else
  (window as any).scene = scene;

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });
};
