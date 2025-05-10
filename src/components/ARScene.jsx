import "mind-ar/dist/mindar-image.prod.js";
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import targetMind from "../assets/targets.mind?url";
import videoFile from "../assets/BigDomExperience.MP4?url";
import { useEffect } from "react";

function ARScene() {
  useEffect(() => {
    const sceneEl = document.querySelector("a-scene");
    const videoEl = document.querySelector("#dom-video");
    const targetEl = document.querySelector("#target-container");

    // Add a user interaction handler for mobile browsers
    const handleUserInteraction = () => {
      videoEl.muted = false;
      videoEl.volume = 1.0;
      videoEl.play().catch(console.error);
      console.log("User interaction - trying to play video");
    };

    // Add interaction listeners
    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });

    // AR system ready
    sceneEl.addEventListener("arReady", () => {
      console.log("AR is ready");
    });

    // Target found/lost events
    targetEl?.addEventListener("targetFound", () => {
      console.log("target found");

      // Create a forced user action to enable audio
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            videoEl.muted = false;
            videoEl.volume = 1.0;
            console.log("Video playing with audio");
          })
          .catch((error) => {
            console.error("Play error:", error);
            // Show a play button or message to user
            alert("Tap the screen to enable audio");
          });
      }
    });

    targetEl?.addEventListener("targetLost", () => {
      console.log("target lost");
      videoEl.pause();
    });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      targetEl?.removeEventListener("targetFound", () => {});
      targetEl?.removeEventListener("targetLost", () => {});
      sceneEl?.removeEventListener("arReady", () => {});
    };
  }, []);

  return (
    <a-scene
      mindar-image={`imageTargetSrc: ${targetMind}; autoStart: true; maxTrack: 1; warmupTolerance: 3; missTolerance: 3;`}
      color-space="sRGB"
      renderer="colorManagement: true, physicallyCorrectLights"
      embedded
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
    >
      <a-assets>
        <video
          id="dom-video"
          src={videoFile}
          preload="auto"
          loop
          crossOrigin="anonymous"
          playsInline
          autoPlay
          muted
        ></video>
      </a-assets>

      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
      <a-entity id="target-container" mindar-image-target="targetIndex: 0">
        <a-video
          src="#dom-video"
          position="0 0 0"
          height="0.552"
          width="1"
          rotation="0 0 0"
          material="shader: flat; transparent: true; alphaTest: 0.5"
        ></a-video>
      </a-entity>
    </a-scene>
  );
}

export default ARScene;
