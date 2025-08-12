'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei'
import CustomGeometry from './AddGeometry'

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ 
          position: [5, 5, 5], // Adjusted for Z-up and box at z=5
          fov: 75,
          up: [0, 0, 1] // Z-up orientation like CAD systems
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <CustomGeometry key="box1" geometryId="box1" />
        <CustomGeometry key="box2" geometryId="box2" />
        <OrbitControls 
          enableDamping={false} 
          makeDefault
        />
        <GizmoHelper
          alignment="top-right"
          margin={[80, 80]}
          >
          <GizmoViewport 
            axisColors={['red', 'green', 'blue']} 
            labelColor="white"
            axisHeadScale={1}
          />
        </GizmoHelper>
      </Canvas>
    </div>
  )
}