'use client'

import { useRef, useMemo, useState } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export default function CustomBox() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hoveredFace, setHoveredFace] = useState<number>(-1)
  
  // Face names mapping
  const FACE_NAMES = ['FRONT', 'RIGHT', 'BACK', 'LEFT', 'TOP', 'BOTTOM']

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    
    // Face naming convention with clear organization
    const FACES = {
      FRONT: 'front',    // Positive Z direction
      RIGHT: 'right',    // Positive X direction  
      BACK: 'back',      // Negative Z direction
      LEFT: 'left',      // Negative X direction
      TOP: 'top',        // Positive Y direction
      BOTTOM: 'bottom'   // Negative Y direction
    }
    
    // Organize vertices by named faces for clarity
    const faceVertices = {
      [FACES.FRONT]: [
        // Triangle 1
        { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0] }, // bottom-left
        { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0] }, // bottom-right  
        { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1] }, // top-left
        // Triangle 2
        { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1] }, // top-left
        { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0] }, // bottom-right
        { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1] }, // top-right
      ],
      
      [FACES.RIGHT]: [
        { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0] },
        { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0] },
        { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1] },
        
        { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1] },
        { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0] },
        { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1] },
      ],
      
      [FACES.BACK]: [
        { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0] },
        { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0] },
        { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1] },
        
        { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1] },
        { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0] },
        { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1] },
      ],
      
      [FACES.LEFT]: [
        { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0] },
        { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0] },
        { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1] },
        
        { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1] },
        { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0] },
        { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 1] },
      ],
      
      [FACES.TOP]: [
        { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0] },
        { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0] },
        { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1] },
        
        { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1] },
        { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0] },
        { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1] },
      ],
      
      [FACES.BOTTOM]: [
        { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 0] },
        { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0] },
        { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1] },
        
        { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1] },
        { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0] },
        { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 1] },
      ]
    }
    
    // Convert to flat arrays for BufferGeometry
    const positions: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const colors: number[] = []
    
    // Process each named face in order
    Object.values(faceVertices).forEach(vertices => {
      vertices.forEach(vertex => {
        positions.push(...vertex.pos)
        normals.push(...vertex.norm)
        uvs.push(...vertex.uv)
        colors.push(0.8, 0.8, 0.8) // Default gray color
      })
    })
    
    // Create the geometry with our organized data
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
    
    return geo
  }, [])

  const updateColors = (faceIndex: number) => {
    const colors = geometry.getAttribute('color')
    
    for (let i = 0; i < 6; i++) {
      const r = faceIndex === i ? 1 : 0.8
      const g = faceIndex === i ? 0 : 0.8  
      const b = faceIndex === i ? 0 : 0.8
      
      // Each face has 6 vertices (2 triangles * 3 vertices)
      for (let j = 0; j < 6; j++) {
        const vertexIndex = i * 6 + j
        colors.setXYZ(vertexIndex, r, g, b)
      }
    }
    colors.needsUpdate = true
  }

  const handlePointerMove = (event: { intersections: Array<{ faceIndex: number }> }) => {
    if (event.intersections.length > 0) {
      const faceIndex = Math.floor(event.intersections[0].faceIndex / 2)
      if (faceIndex !== hoveredFace) {
        setHoveredFace(faceIndex)
        updateColors(faceIndex)
      }
    }
  }

  const handlePointerLeave = () => {
    setHoveredFace(-1)
    updateColors(-1)
  }

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <meshStandardMaterial vertexColors />
      </mesh>
      
      {hoveredFace !== -1 && (
        <Html position={[0, 3, 0]} center>
          <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded text-lg font-bold">
            {FACE_NAMES[hoveredFace]}
          </div>
        </Html>
      )}
    </>
  )
}