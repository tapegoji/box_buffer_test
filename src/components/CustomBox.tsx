'use client'

import { useRef, useMemo, useState } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// Face names mapping - moved outside component to avoid dependency issues
const FACE_NAMES = ['FRONT', 'RIGHT', 'BACK', 'LEFT', 'TOP', 'BOTTOM']

export default function CustomBox() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hoveredFace, setHoveredFace] = useState<number>(-1)
  const [selectedFaces, setSelectedFaces] = useState<Set<number>>(new Set())

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    
    // Organize vertices by named faces for clarity
    const faceVertices = {
      FRONT: [
        { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0] },
        { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0] },
        { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1] },
        { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1] },
        { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0] },
        { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1] },
      ],
      
      RIGHT: [
        { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0] },
        { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0] },
        { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1] },
        { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1] },
        { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0] },
        { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1] },
      ],
      
      BACK: [
        { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0] },
        { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0] },
        { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1] },
        { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1] },
        { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0] },
        { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1] },
      ],
      
      LEFT: [
        { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0] },
        { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0] },
        { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1] },
        { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1] },
        { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0] },
        { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 1] },
      ],
      
      TOP: [
        { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0] },
        { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0] },
        { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1] },
        { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1] },
        { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0] },
        { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1] },
      ],
      
      BOTTOM: [
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
    
    // Process each face in order and track vertex counts
    const faceNames = Object.keys(faceVertices) as Array<keyof typeof faceVertices>
    let vertexOffset = 0
    
    faceNames.forEach((faceName, materialIndex) => {
      const vertices = faceVertices[faceName]
      
      // Add vertices for this face
      vertices.forEach(vertex => {
        positions.push(...vertex.pos)
        normals.push(...vertex.norm)
        uvs.push(...vertex.uv)
      })
      
      // Add material group for this face (6 vertices per face)
      geo.addGroup(vertexOffset, vertices.length, materialIndex)
      vertexOffset += vertices.length
    })
    
    // Set geometry attributes
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
    
    return geo
  }, [])

  // Create materials array for face colors
  const materials = useMemo(() => {
    return FACE_NAMES.map((_, index) => 
      new THREE.MeshStandardMaterial({ 
        color: selectedFaces.has(index) || hoveredFace === index ? '#ff0000' : '#cccccc' 
      })
    )
  }, [hoveredFace, selectedFaces])

  const handlePointerMove = (event: { intersections: Array<{ face: { materialIndex: number } }> }) => {
    if (event.intersections.length > 0) {
      const materialIndex = event.intersections[0].face.materialIndex
      
      if (materialIndex !== hoveredFace) {
        setHoveredFace(materialIndex)
      }
    }
  }

  const handlePointerLeave = () => {
    setHoveredFace(-1)
  }

  const handleClick = (event: { intersections: Array<{ face: { materialIndex: number } }> }) => {
    if (event.intersections.length > 0) {
      const materialIndex = event.intersections[0].face.materialIndex
      
      setSelectedFaces(prev => {
        const newSet = new Set(prev)
        if (newSet.has(materialIndex)) {
          newSet.delete(materialIndex) // Deselect if already selected
        } else {
          newSet.add(materialIndex) // Select if not selected
        }
        return newSet
      })
    }
  }

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={materials}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      />
      
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