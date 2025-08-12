'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import CustomBox from './CustomBox'

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [3, 3, 3], fov: 75 }}
        className="bg-gray-900"
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <CustomBox />
        <OrbitControls enableDamping={false} enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}