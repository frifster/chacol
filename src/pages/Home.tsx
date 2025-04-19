import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Link } from 'react-router-dom'

const DungeonScene = () => {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <Suspense fallback={null}>
        <Environment preset="night" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        <OrbitControls />
      </Suspense>
    </Canvas>
  )
}

const Home = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <DungeonScene />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-6xl md:text-8xl font-medieval text-dungeon-accent mb-6">
          Chacol
        </h1>
        <h2 className="text-2xl md:text-4xl font-medieval text-dungeon-text mb-8">
          The Dungeon Chronicles
        </h2>
        <p className="text-xl text-dungeon-text mb-12 max-w-2xl">
          Embark on an epic journey through mysterious dungeons, uncover ancient secrets,
          and face formidable challenges in this immersive 3D dungeon crawler.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link to="/download" className="btn-primary">
            Play Now
          </Link>
          <Link to="/about" className="btn-primary bg-opacity-50">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home 