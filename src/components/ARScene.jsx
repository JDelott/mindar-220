import "mind-ar/dist/mindar-image.prod.js";
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import targetMind from "../assets/targets.mind?url";
import videoFile from "../assets/BOP.mp4?url";
import { useEffect } from "react";

function ARScene() {
  useEffect(() => {
    const sceneEl = document.querySelector("a-scene");
    const videoEl = document.querySelector("#bop-video");
    const targetEl = document.querySelector("#target-container");

    // Initial audio setup
    const setupAudio = async () => {
      try {
        await videoEl.play();
        videoEl.volume = 1.0;
        videoEl.muted = false;
      } catch (error) {
        console.error("Audio setup failed:", error);
      }
    };

    // AR system ready
    sceneEl.addEventListener("arReady", () => {
      console.log("AR is ready");
      setupAudio();
    });

    // AR system error
    sceneEl.addEventListener("arError", () => {
      console.log("AR failed to start");
    });

    // Target found/lost events
    targetEl?.addEventListener("targetFound", () => {
      console.log("target found");
      videoEl.volume = 1.0;
      videoEl.muted = false;
      videoEl.play().catch(console.error);
    });

    targetEl?.addEventListener("targetLost", () => {
      console.log("target lost");
      videoEl.pause();
    });

    return () => {
      targetEl?.removeEventListener("targetFound", () => {});
      targetEl?.removeEventListener("targetLost", () => {});
      sceneEl?.removeEventListener("arReady", () => {});
      sceneEl?.removeEventListener("arError", () => {});
    };
  }, []);

  return (
    <a-scene
      mindar-image={`imageTargetSrc: ${targetMind}; autoStart: true;`}
      color-space="sRGB"
      renderer="colorManagement: true, physicallyCorrectLights"
      embedded
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
    >
      <a-assets>
        <video
          id="bop-video"
          src={videoFile}
          preload="auto"
          loop
          crossOrigin="anonymous"
          playsInline
          autoPlay
        ></video>
      </a-assets>

      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
      <a-entity id="target-container" mindar-image-target="targetIndex: 0">
        <a-video
          src="#bop-video"
          position="0 0 0"
          height="0.552"
          width="1"
          rotation="0 0 0"
          material="shader: flat; transparent: true"
        ></a-video>
      </a-entity>
    </a-scene>
  );
}

export default ARScene;
