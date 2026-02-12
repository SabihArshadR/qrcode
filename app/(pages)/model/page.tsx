"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"

function Model() {
  const { scene } = useGLTF("/models/model.glb")
  return <primitive object={scene} scale={1.5} />
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
