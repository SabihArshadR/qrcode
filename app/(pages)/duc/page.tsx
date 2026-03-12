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
const AEntity = (props: any) => React.createElement("a-entity", props);

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

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

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
            if (life < 1.5) requestAnimationFrame(animate);
            else points.visible = false;
        };
        animate();
    }, []);

    return <AEntity ref={ref} position={`${position.x} ${position.y} ${position.z}`} />;
};

/* ---------------- AVATAR ---------------- */
const Avatar = ({ position, isPlaying }: any) => {
    const avatarRef = useRef<any>(null);
    const modelRef = useRef<any>(null);

    useEffect(() => {
        if (!avatarRef.current || !modelRef.current) return;
        
        avatarRef.current.setAttribute(
            "animation__scale",
            "property: scale; from: 0 0 0; to: 0.7 0.7 0.7; dur: 800; easing: easeOutBack"
        );

        modelRef.current.setAttribute(
            "animation__rotate",
            "property: rotation; from: 0 0 0; to: 0 360 0; loop: true; dur: 8000; easing: linear"
        );
    }, []);

    return (
        <AEntity ref={avatarRef} position={`${position.x} ${position.y} ${position.z}`} scale="0 0 0">
            <AEntity
                ref={modelRef}
                gltf-model="url(/models/Duc.glb)"
                animation-mixer={isPlaying ? "clip: *; loop: repeat; timeScale: 1" : "clip: *; loop: repeat; timeScale: 0"}
            />
        </AEntity>
    );
};

/* ---------------- PAGE ---------------- */
const Page = ({ audioUrl = "/sounds/main.mp3" }: any) => {
    const [status, setStatus] = useState<"idle" | "requesting" | "ready">("idle");
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const [avatarPos, setAvatarPos] = useState<any>(null);
    const [isPlayingState, setIsPlayingState] = useState(false);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleStart = async () => {
        setStatus("requesting");
        try {
            // Request camera only
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach((track) => track.stop());
            
            // Audio starts immediately because of this click
            if (audioUrl) {
                audioRef.current = new Audio(audioUrl);
                audioRef.current.play().catch(() => {});
                setIsPlayingState(true);
            }

            const sfx = new Audio("/sounds/1.mp3");
            sfx.volume = 0.9;
            sfx.play().catch(() => {});

            setStatus("ready");
            setAvatarPos({ x: 0, y: -0.1, z: -2 });
        } catch (err) {
            alert("Camera access is required for AR.");
            setStatus("idle");
        }
    };

    useEffect(() => {
        if (status !== "ready") return;

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
            await loadScript("https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar.js");
            await loadScript("https://cdn.jsdelivr.net/npm/aframe-extras@6.1.1/dist/aframe-extras.min.js");
            setScriptsLoaded(true);
        };

        loadAll();
    }, [status]);

    if (status !== "ready" || !scriptsLoaded) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-black text-white p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">AR Experience</h1>
                <p className="mb-8 opacity-80">Click below to enable camera and see the Avatar</p>
                <button
                    onClick={handleStart}
                    className="px-10 py-4 bg-pink-600 hover:bg-pink-500 rounded-full font-bold transition-all shadow-lg"
                >
                    {status === "requesting" ? "Loading..." : "START EXPERIENCE"}
                </button>
            </div>
        );
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
                <AEntity camera="" />

                {avatarPos && (
                    <>
                        <Avatar position={avatarPos} isPlaying={isPlayingState} />
                        <Confetti position={avatarPos} />
                    </>
                )}
            </AScene>
        </div>
    );
};

export default Page;