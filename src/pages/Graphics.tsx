import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

const DungeonModel = () => {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1, -5]}>
        <boxGeometry args={[10, 4, 0.5]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <mesh position={[0, 1, 5]}>
        <boxGeometry args={[10, 4, 0.5]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <mesh position={[-5, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 4, 0.5]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <mesh position={[5, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 4, 0.5]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* Pillars */}
      <mesh position={[-4, 2, -4]}>
        <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh position={[4, 2, -4]}>
        <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh position={[-4, 2, 4]}>
        <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh position={[4, 2, 4]}>
        <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {/* Torches */}
      <mesh position={[-4, 2, -4]}>
        <pointLight intensity={1} distance={5} color="#ff9900" />
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ff9900" emissive="#ff9900" emissiveIntensity={1} />
      </mesh>
      <mesh position={[4, 2, -4]}>
        <pointLight intensity={1} distance={5} color="#ff9900" />
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ff9900" emissive="#ff9900" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-4, 2, 4]}>
        <pointLight intensity={1} distance={5} color="#ff9900" />
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ff9900" emissive="#ff9900" emissiveIntensity={1} />
      </mesh>
      <mesh position={[4, 2, 4]}>
        <pointLight intensity={1} distance={5} color="#ff9900" />
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ff9900" emissive="#ff9900" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

const Graphics = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="section-title">Graphics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-medieval text-dungeon-accent mb-4">3D Technology</h2>
          <p className="text-dungeon-text mb-6">
            Chacol utilizes cutting-edge 3D graphics powered by Three.js and React Three Fiber.
            Experience stunning visuals, realistic lighting, and immersive environments that bring
            the world of Chacol to life.
          </p>
          <div className="space-y-4">
            <div className="bg-dungeon-light p-4 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Real-time Lighting</h3>
              <p className="text-dungeon-text">
                Dynamic lighting system that creates atmospheric and moody dungeon environments.
              </p>
            </div>
            <div className="bg-dungeon-light p-4 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">High-quality Textures</h3>
              <p className="text-dungeon-text">
                Detailed textures and materials that enhance the visual depth of the game world.
              </p>
            </div>
            <div className="bg-dungeon-light p-4 rounded-lg">
              <h3 className="text-xl text-dungeon-accent mb-2">Particle Effects</h3>
              <p className="text-dungeon-text">
                Stunning visual effects for spells, abilities, and environmental elements.
              </p>
            </div>
          </div>
        </div>
        <div className="h-[500px]">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 2, 8]} />
            <Suspense fallback={null}>
              <Environment preset="night" />
              <ambientLight intensity={0.2} />
              <DungeonModel />
              <OrbitControls 
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={15}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  )
}

export default Graphics 