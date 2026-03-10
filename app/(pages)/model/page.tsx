// "use client"
// import { useRef, useEffect, useState } from "react"
// import { useFrame, Canvas } from "@react-three/fiber"
// import { OrbitControls, useGLTF } from "@react-three/drei"
// import * as THREE from "three"

// function Confetti() {
//   const points = useRef<THREE.Points>(null!)
//   const count = 200
//   const life = useRef(0)

//   const positions = new Float32Array(count * 3)
//   const velocities = new Float32Array(count * 3)

//   for (let i = 0; i < count; i++) {
//     // start at center
//     positions[i * 3] = 0
//     positions[i * 3 + 1] = 0
//     positions[i * 3 + 2] = 0

//     // explosion direction
//     velocities[i * 3] = (Math.random() - 0.5) * 0.1
//     velocities[i * 3 + 1] = Math.random() * 0.15
//     velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1
//   }

//   useFrame(() => {
//     if (!points.current) return

//     life.current += 0.02

//     const pos = points.current.geometry.attributes.position
// function Confetti() {
//   const points = useRef<THREE.Points>(null!)
//   const count = 200

//   const positions = new Float32Array(count * 3)

//   for (let i = 0; i < count; i++) {
//     positions[i * 3] = (Math.random() - 0.5) * 2
//     positions[i * 3 + 1] = Math.random() * 2
//     positions[i * 3 + 2] = (Math.random() - 0.5) * 2
//   }

//   useFrame(() => {
//     if (points.current) {
//       points.current.rotation.y += 0.01
//       points.current.position.y -= 0.01
//     }
//   })

//   return (
//     <points ref={points}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           args={[positions, 3]}
//           count={count}
//           array={positions}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial color="hotpink" size={0.05} />
//     </points>
//   )
// }

//     for (let i = 0; i < count; i++) {
//       pos.array[i * 3] += velocities[i * 3]
//       pos.array[i * 3 + 1] += velocities[i * 3 + 1]
//       pos.array[i * 3 + 2] += velocities[i * 3 + 2]

//       // gravity effect
//       velocities[i * 3 + 1] -= 0.002
//     }

//     pos.needsUpdate = true

//     // fade out
//     const material = points.current.material as THREE.PointsMaterial
//     material.opacity = Math.max(1 - life.current, 0)

//     if (life.current > 1.5) {
//       points.current.visible = false
//     }
//   })

//   return (
//     <points ref={points}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           args={[positions, 3]}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         color="hotpink"
//         size={0.05}
//         transparent
//         opacity={1}
//       />
//     </points>
//   )
// }
// function Model() {
//   const { scene } = useGLTF("/models/Tortuga Poruga.glb")
//   const groupRef = useRef<THREE.Group>(null!)
//   const [scale, setScale] = useState(0)

//   // brighten materials
//   useEffect(() => {
//     scene.traverse((child: any) => {
//       if (child.isMesh && child.material) {
//         child.material.color.multiplyScalar(1.2)
//         child.material.needsUpdate = true
//       }
//     })
//   }, [scene])

//   // POP animation
//   useFrame(() => {
//     if (groupRef.current) {
//       groupRef.current.rotation.y += 0.01

//       if (scale < 1.5) {
//         const newScale = scale + 0.03
//         setScale(newScale)
//         groupRef.current.scale.set(newScale, newScale, newScale)
//       }
//     }
//   })

//   return (
//     <group ref={groupRef} scale={0}>
//       <primitive object={scene} />
//     </group>
//   )
// }

// export default function ModelViewer() {
//   const audioRef = useRef<HTMLAudioElement | null>(null)

//   useEffect(() => {
//     const playAudio = () => {
//       const audio = new Audio("/sounds/1.mp3")
//       audio.volume = 0.9

//       audio.play().catch((e) => {
//         console.log("Audio blocked:", e)
//       })

//       audioRef.current = audio

//       window.removeEventListener("click", playAudio)
//     }

//     window.addEventListener("click", playAudio)

//     return () => window.removeEventListener("click", playAudio)
//   }, [])

//   return (
//     <div style={{ height: "100vh" }}>
//       <Canvas camera={{ position: [0, 0, 5] }}>
//         <ambientLight intensity={1.5} />
//         <directionalLight position={[5, 5, 5]} intensity={1.5} />
//         <pointLight position={[-5, 5, 5]} intensity={1} />
//         <Model />
//         <Confetti />
//         <OrbitControls />
//       </Canvas>
//     </div>
//   )
// }


"use client";

import React, { useEffect, useState, useRef } from "react";

const AScene = (props: any) => React.createElement("a-scene", props);
const ACamera = (props: any) => React.createElement("a-camera", props);
const AEntity = (props: any) => React.createElement("a-entity", props);
const ACircle = (props: any) => React.createElement("a-circle", props);
const ARing = (props: any) => React.createElement("a-ring", props);

/* ---------------- MARKER ---------------- */

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

/* ---------------- CONFETTI ---------------- */

const Confetti = ({ position }: any) => {
    const ref = useRef<any>(null);

    useEffect(() => {
        const THREE = (window as any).AFRAME?.THREE;
        if (!THREE || !ref.current) return;

        const count = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities: any[] = [];

        for (let i = 0; i < count; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;

            velocities.push(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    Math.random() * 0.15,
                    (Math.random() - 0.5) * 0.1
                )
            );
        }

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );

        const material = new THREE.PointsMaterial({
            color: "hotpink",
            size: 0.05,
            transparent: true,
            opacity: 1,
        });

        const points = new THREE.Points(geometry, material);
        ref.current.object3D.add(points);

        let life = 0;

        const animate = () => {
            life += 0.02;

            const pos = geometry.attributes.position;

            for (let i = 0; i < count; i++) {
                pos.array[i * 3] += velocities[i].x;
                pos.array[i * 3 + 1] += velocities[i].y;
                pos.array[i * 3 + 2] += velocities[i].z;

                velocities[i].y -= 0.002;
            }

            pos.needsUpdate = true;
            material.opacity = Math.max(1 - life, 0);

            if (life < 1.5) {
                requestAnimationFrame(animate);
            } else {
                points.visible = false;
            }
        };

        animate();
    }, []);

    return (
        <AEntity
            ref={ref}
            position={`${position.x} ${position.y} ${position.z}`}
        />
    );
};

/* ---------------- AVATAR ---------------- */

const Avatar = ({ position, isPlaying, deviceOrientation }: any) => {
    const avatarRef = useRef<any>(null);
    const modelRef = useRef<any>(null);

    useEffect(() => {
        if (!avatarRef.current || !modelRef.current) return;

        const container = avatarRef.current;
        const model = modelRef.current;

        // POP scale animation (spawn effect)
        container.setAttribute(
            "animation__scale",
            "property: scale; from: 0 0 0; to: 0.7 0.7 0.7; dur: 600; easing: easeOutBack"
        );

        // 🔄 rotate around its OWN axis
        model.setAttribute(
            "animation__rotate",
            "property: rotation; from: 0 0 0; to: 0 360 0; loop: true; dur: 8000; easing: linear"
        );
    }, []);

    return (
        <AEntity
            ref={avatarRef}
            position={`${position.x} ${position.y} ${position.z}`}
            scale="0 0 0"
        >
            <AEntity
                ref={modelRef}
                gltf-model="url(/models/Tortuga Poruga.glb)"
                animation-mixer={
                    isPlaying
                        ? "clip: *; loop: repeat; timeScale: 1"
                        : "clip: *; loop: repeat; timeScale: 0"
                }
            />
        </AEntity>
    );
};
/* ---------------- PAGE ---------------- */

const Page = ({ setShowARView, handleClose, audioUrl }: any) => {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);

    const [avatarPos, setAvatarPos] = useState<any>(null);
    const [isPlayingState, setIsPlayingState] = useState(false);

    const markerRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [deviceOrientation, setDeviceOrientation] = useState({
        alpha: 0,
        beta: 0,
        gamma: 0,
    });

    /* ---------------- CAMERA PERMISSION ---------------- */

    useEffect(() => {
        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach((track) => track.stop());

                setPermissionGranted(true);
                window.addEventListener("deviceorientation", handleOrientation);
            } catch {
                setPermissionGranted(false);
            }
        })();

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, []);

    const handleOrientation = (event: DeviceOrientationEvent) => {
        setDeviceOrientation({
            alpha: event.alpha || 0,
            beta: event.beta || 0,
            gamma: event.gamma || 0,
        });
    };

    /* ---------------- AVATAR AUDIO ---------------- */

    const startAnimationAndAudio = async () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(audioUrl);
        }

        try {
            await audioRef.current.play();
            setIsPlayingState(true);
        } catch { }
    };

    /* ---------------- PLACE AVATAR ---------------- */

    const placeAvatar = () => {
        if (!markerRef.current) return;

        const THREE = (window as any).AFRAME?.THREE;

        const worldPos = new THREE.Vector3();
        markerRef.current.object3D.getWorldPosition(worldPos);

        const pos = {
            x: worldPos.x,
            y: worldPos.y + 0.7,
            z: worldPos.z,
        };

        setAvatarPos(pos);

        // 🎉 celebration sound
        const sfx = new Audio("/sounds/1.mp3");
        sfx.volume = 0.9;
        sfx.play().catch(() => { });

        startAnimationAndAudio();
    };

    /* ---------------- LOAD AFRAME ---------------- */

    useEffect(() => {
        if (!permissionGranted) return;

        const loadScript = (src: string) =>
            new Promise<void>((resolve) => {
                if (document.querySelector(`script[src="${src}"]`)) return resolve();

                const s = document.createElement("script");
                s.src = src;
                s.onload = () => resolve();

                document.head.appendChild(s);
            });

        const loadAll = async () => {
            await loadScript("https://aframe.io/releases/1.3.0/aframe.min.js");
            await loadScript(
                "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar.js"
            );
            await loadScript(
                "https://cdn.jsdelivr.net/npm/aframe-extras@6.1.1/dist/aframe-extras.min.js"
            );

            setScriptsLoaded(true);
        };

        loadAll();
    }, [permissionGranted]);

    if (!permissionGranted) {
        return (
            <div className="flex h-screen items-center justify-center">
                Camera permission required
            </div>
        );
    }

    if (!scriptsLoaded) {
        return <div className="h-screen bg-black" />;
    }

    return (
  <div className="w-full h-screen relative overflow-hidden">
    <AScene
      embedded
      vr-mode-ui="enabled: false"
      arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
      renderer="antialias: true; alpha: true;"
    >
      <AEntity light="type: ambient; intensity: 1.6" />
      <AEntity light="type: directional; intensity: 1.5" position="0 5 5" />

      {/* Standard AR Camera */}
      <AEntity camera="" />

      {/* If you want the marker to be 'found' in the real world, 
          it shouldn't be a child of the camera. */}
      {!avatarPos && <Marker ref={markerRef} />}

      {avatarPos && (
        <>
          <Avatar
            position={avatarPos}
            isPlaying={isPlayingState}
            deviceOrientation={deviceOrientation}
          />
          <Confetti position={avatarPos} />
        </>
      )}
    </AScene>

    {/* UI Overlay */}
    {!avatarPos && (
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-[999]">
        <button
          onClick={placeAvatar}
          className="px-6 py-3 w-[300px] bg-blue-600 text-white rounded-xl shadow-lg pointer-events-auto"
        >
          Place Avatar
        </button>
      </div>
    )}
  </div>
);
};

export default Page;