"use client"
import { useRef, useEffect, useState } from "react"
import { useFrame, Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import * as THREE from "three"

function Confetti() {
  const points = useRef<THREE.Points>(null!)
  const count = 200
  const life = useRef(0)

  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    // start at center
    positions[i * 3] = 0
    positions[i * 3 + 1] = 0
    positions[i * 3 + 2] = 0

    // explosion direction
    velocities[i * 3] = (Math.random() - 0.5) * 0.1
    velocities[i * 3 + 1] = Math.random() * 0.15
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1
  }

  useFrame(() => {
    if (!points.current) return

    life.current += 0.02

    const pos = points.current.geometry.attributes.position
function Confetti() {
  const points = useRef<THREE.Points>(null!)
  const count = 200

  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2
    positions[i * 3 + 1] = Math.random() * 2
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2
  }

  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += 0.01
      points.current.position.y -= 0.01
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="hotpink" size={0.05} />
    </points>
  )
}

    for (let i = 0; i < count; i++) {
      pos.array[i * 3] += velocities[i * 3]
      pos.array[i * 3 + 1] += velocities[i * 3 + 1]
      pos.array[i * 3 + 2] += velocities[i * 3 + 2]

      // gravity effect
      velocities[i * 3 + 1] -= 0.002
    }

    pos.needsUpdate = true

    // fade out
    const material = points.current.material as THREE.PointsMaterial
    material.opacity = Math.max(1 - life.current, 0)

    if (life.current > 1.5) {
      points.current.visible = false
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="hotpink"
        size={0.05}
        transparent
        opacity={1}
      />
    </points>
  )
}
function Model() {
  const { scene } = useGLTF("/models/Tortuga Poruga.glb")
  const groupRef = useRef<THREE.Group>(null!)
  const [scale, setScale] = useState(0)

  // brighten materials
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.color.multiplyScalar(1.2)
        child.material.needsUpdate = true
      }
    })
  }, [scene])

  // POP animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01

      if (scale < 1.5) {
        const newScale = scale + 0.03
        setScale(newScale)
        groupRef.current.scale.set(newScale, newScale, newScale)
      }
    }
  })

  return (
    <group ref={groupRef} scale={0}>
      <primitive object={scene} />
    </group>
  )
}

export default function ModelViewer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const playAudio = () => {
      const audio = new Audio("/sounds/1.mp3")
      audio.volume = 0.9

      audio.play().catch((e) => {
        console.log("Audio blocked:", e)
      })

      audioRef.current = audio

      window.removeEventListener("click", playAudio)
    }

    window.addEventListener("click", playAudio)

    return () => window.removeEventListener("click", playAudio)
  }, [])

  return (
    <div style={{ height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, 5, 5]} intensity={1} />
        <Model />
        <Confetti />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
