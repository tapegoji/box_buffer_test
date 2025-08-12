'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei'
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
        <OrbitControls enableDamping={false} enablePan={true} enableZoom={true} enableRotate={true} makeDefault />
        <GizmoHelper
          alignment="bottom-right"
          margin={[80, 80]}
        >
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="white" />
        </GizmoHelper>
      </Canvas>
    </div>
  )
}