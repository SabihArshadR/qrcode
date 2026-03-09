"use client"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import * as THREE from "three"

function Model() {
  const { scene } = useGLTF("/models/Tortuga Poruga.glb")
  const groupRef = useRef<THREE.Group>(undefined)

  // Example: rotate continuously
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.007
    }
  })

  return (
    <group ref={groupRef} scale={1.5} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  )
}

export default function ModelViewer() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <Model />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
