"use client";

import React, { useEffect, useState, useRef } from "react";
// import Loading from "@/components/layout/Loading";
// import CustomButton from "../ui/Button";
// import { useTranslations } from "next-intl";

const AScene = (props: any) => React.createElement("a-scene", props);
const ACamera = (props: any) => React.createElement("a-camera", props);
const AEntity = (props: any) => React.createElement("a-entity", props);
const ACircle = (props: any) => React.createElement("a-circle", props);
const ARing = (props: any) => React.createElement("a-ring", props);

const Marker = React.forwardRef((_, ref: any) => (
  <AEntity ref={ref} position="0 -0.9 -2">
    <ARing
      radius-inner="0.3"
      radius-outer="0.4"
      color="#4F46E5"
      opacity="0.8"
      rotation="-90 0 0"
    />
    <ACircle
      radius="0.3"
      color="#10B981"
      opacity="0.5"
      rotation="-90 0 0"
    />
  </AEntity>
));

const Avatar = ({
  position,
  isPlaying,
  deviceOrientation,
}: {
  position: { x: number; y: number; z: number };
  isPlaying: boolean;
  deviceOrientation: { alpha: number; beta: number; gamma: number };
}) => {
  const avatarRef = useRef<any>(null);

  useEffect(() => {
    if (avatarRef.current) {
      const entity = avatarRef.current;
      const mesh = entity.getObject3D("mesh");

      if (mesh) {
        mesh.traverse((obj: any) => {
          obj.frustumCulled = false;
        });
      } else {
        entity.addEventListener("model-loaded", (evt: any) => {
          evt.detail.model.traverse((obj: any) => {
            obj.frustumCulled = false;
          });
        });
      }
    }
  }, []);

  return (
    <AEntity
      ref={avatarRef}
      position={`${position.x} ${position.y} ${position.z}`}
      rotation={`-10 ${deviceOrientation.alpha} 0`}
      scale="1 1 1"
    >
      <AEntity
        gltf-model="url(/models/Avatar1.glb)"
        animation-mixer={
          isPlaying
            ? "clip: *; loop: repeat; timeScale: 1"
            : "clip: *; loop: repeat; timeScale: 0"
        }
      />
    </AEntity>
  );
};

const Page = ({ setShowARView, handleClose, audioUrl, linkLoad, from }: any) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
//   const t = useTranslations("gameText");

  const [avatarPos, setAvatarPos] = useState<{ x: number; y: number; z: number } | null>(null);
  const [isPlayingState, setIsPlayingState] = useState(false);
  const [showAudioPopup, setShowAudioPopup] = useState(false);
  const [audioCompleted, setAudioCompleted] = useState(false);

  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });

  const isPlayingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const markerRef = useRef<any>(null);
  const orientationHandlerRef = useRef<any>(null);
  const dracoInitializedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setPermissionGranted(true);

        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          // @ts-ignore
          typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
          try {
            // @ts-ignore
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === "granted") {
              startOrientationTracking();
            }
          } catch { }
        } else {
          startOrientationTracking();
        }
      } catch {
        setPermissionGranted(false);
      }
    })();

    return () => {
      if (orientationHandlerRef.current) {
        window.removeEventListener("deviceorientation", orientationHandlerRef.current);
      }
    };
  }, []);

  const startOrientationTracking = () => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      });
    };
    orientationHandlerRef.current = handleDeviceOrientation;
    window.addEventListener("deviceorientation", handleDeviceOrientation);
  };

  const isIOS = () => {
    return (
      typeof navigator !== "undefined" &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any).MSStream
    );
  };

  const startAnimationAndAudio = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.preload = "auto";
        audioRef.current.onended = () => {
          stopAnimationAndAudio();
          setAudioCompleted(true);
          setTimeout(() => handleBackFromAR(), 100);
        };
      }

      await audioRef.current.play(); // ✅ first time user taps Place, this runs fine
      isPlayingRef.current = true;
      setIsPlayingState(true);
    } catch (err) {
      console.log("Playback failed:", err);
      setShowAudioPopup(true);
    }
  };


  const stopAnimationAndAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    isPlayingRef.current = false;
    setIsPlayingState(false);
  };

  const handleBackFromAR = () => {
    stopAnimationAndAudio();
    setShowARView(false);
    handleClose();
  };

  const handleAllowAudio = () => {
    setShowAudioPopup(false);
    startAnimationAndAudio();
  };

  // useEffect(() => {
  //   const unlockAudio = async () => {
  //     if (!audioRef.current) {
  //       audioRef.current = new Audio(audioUrl);
  //       audioRef.current.preload = "auto";
  //       audioRef.current.onended = () => {
  //         stopAnimationAndAudio();
  //         setAudioCompleted(true);
  //         setTimeout(() => handleBackFromAR(), 100);
  //       };

  //       try {
  //         await audioRef.current.load();
  //       } catch { }
  //     }
  //   };

  //   window.addEventListener("touchstart", unlockAudio, { once: true });
  //   window.addEventListener("click", unlockAudio, { once: true });

  //   return () => {
  //     window.removeEventListener("touchstart", unlockAudio);
  //     window.removeEventListener("click", unlockAudio);
  //   };
  // }, [audioUrl]);

  const placeAvatar = () => {
    if (markerRef.current) {
      const worldPos = new (window as any).THREE.Vector3();
      markerRef.current.object3D.getWorldPosition(worldPos);
      setAvatarPos({ x: worldPos.x, y: worldPos.y + 0.3, z: worldPos.z });
      startAnimationAndAudio();
    }
  };

  useEffect(() => {
    if (!permissionGranted) return;
    if (!linkLoad) {
      setScriptsLoaded(true);
      return;
    }

    const scriptClass = "poi-page-script";
    const addedScripts: HTMLScriptElement[] = [];

    // Cleanup previous scripts AND components
    // document.querySelectorAll(`script[data-page-script="ar-page-script"]`).forEach((script) => script.remove());

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if ((window as any)._loadedScripts?.[src]) return resolve();
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) return resolve();

        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.classList.add(scriptClass);
        s.dataset.pageScript = scriptClass;
        s.onload = () => {
          (window as any)._loadedScripts = {
            ...(window as any)._loadedScripts,
            [src]: true,
          };
          resolve();
        };
        s.onerror = () => reject();
        document.head.appendChild(s);
        addedScripts.push(s);
      });

    const setupDracoLoader = () => {
      if (!(window as any).AFRAME || !(window as any).THREE || dracoInitializedRef.current) return;
      const AFRAME = (window as any).AFRAME;
      const THREE = (window as any).THREE;
      try {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
        dracoLoader.preload();
        if (AFRAME.components["gltf-model"]) {
          const originalUpdate = AFRAME.components["gltf-model"].Component.prototype.update;
          AFRAME.components["gltf-model"].Component.prototype.update = function (oldData: any) {
            if (!this.loader) this.loader = new THREE.GLTFLoader();
            if (!this.loader.dracoLoader) this.loader.setDRACOLoader(dracoLoader);
            if (originalUpdate) return originalUpdate.call(this, oldData);
          };
        }
        dracoInitializedRef.current = true;
      } catch { }
    };

    const loadAll = async () => {
      try {
        if (!(window as any).AFRAME) {
          await loadScript("https://aframe.io/releases/1.3.0/aframe.min.js");
        }
        await new Promise((resolve) => {
          const check = () => ((window as any).AFRAME ? resolve(true) : setTimeout(check, 50));
          check();
        });
        if (isIOS()) {
          await loadScript("https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar.js");
        } else {
          await loadScript("https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar-nft.min.js");
        }
        await loadScript("https://cdn.jsdelivr.net/npm/aframe-extras@6.1.1/dist/aframe-extras.min.js");
        if (!(window as any).THREE) {
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");
        }
        await loadScript("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js");
        setupDracoLoader();
        setScriptsLoaded(true);
      } catch {
        setScriptsLoaded(false);
      }
    };

    loadAll();
  }, [permissionGranted, linkLoad]);

  if (!permissionGranted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white w-full">
        <p>⚠️cameraPermission</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">
          try_again
        </button>
      </div>
    );
  }

//   if (!scriptsLoaded || !(window as any).AFRAME) return <Loading />;

  return (
    <div className="w-full h-screen relative">
      <AScene
        vr-mode-ui="enabled: false"
        embedded
        arjs="sourceType: webcam; videoTexture: true; facingMode: environment; debugUIEnabled: false"
        renderer="alpha: true; logarithmicDepthBuffer: true; precision: mediump;"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <AEntity light="type: ambient; color: #ffffff; intensity: 1.7" />
        <AEntity light="type: directional; color: #ffffff; intensity: 1.5" position="0 5 5" />

        <ACamera position="0 0 0" look-controls="touchEnabled: false">
          {!avatarPos && <Marker ref={markerRef} />}
        </ACamera>

        {avatarPos && <Avatar position={avatarPos} isPlaying={isPlayingState} deviceOrientation={deviceOrientation} />}
      </AScene>

      {!avatarPos && (
        <div className={`fixed bottom-10 w-full flex justify-center ${from == "intro" ?"left-0" :""}`} style={{ zIndex: 2147483646 }}>
          <button onClick={placeAvatar} className="px-6 py-3 !w-[300px] text-white rounded-xl shadow-lg">
        place
          </button>
        </div>
      )}

      {showAudioPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70" style={{ zIndex: 2147483647 }}>
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center gap-4">
            <p className="text-lg font-semibold text-center">🔊 audioPermission</p>
            <button onClick={handleAllowAudio} className="px-4 py-2 bg-blue-600 text-white rounded">
              audioAllow
            </button>
            <button onClick={() => setShowAudioPopup(false)} className="px-4 py-2 bg-gray-600 text-white rounded">
              Cancel 
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;