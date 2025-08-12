'use client'

import { useRef, useMemo, useState } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { Badge } from '@/components/ui/badge'

// Face names mapping - moved outside component to avoid dependency issues
const FACE_NAMES = ['FRONT', 'RIGHT', 'BACK', 'LEFT', 'TOP', 'BOTTOM']

export default function CustomGeometry() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hoveredFace, setHoveredFace] = useState<number>(-1)
  const [selectedFaces, setSelectedFaces] = useState<Set<number>>(new Set())

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    
    // Define 24 unique vertices (4 per face) - this eliminates vertex duplication
    const vertices = [
      // Front face (indices 0-3)
      { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0] }, // 0
      { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0] }, // 1
      { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1] }, // 2
      { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1] }, // 3
      
      // Right face (indices 4-7)
      { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0] }, // 4
      { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0] }, // 5
      { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1] }, // 6
      { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1] }, // 7
      
      // Back face (indices 8-11)
      { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0] }, // 8
      { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0] }, // 9
      { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1] }, // 10
      { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1] }, // 11
      
      // Left face (indices 12-15)
      { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0] }, // 12
      { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0] }, // 13
      { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 1] }, // 14
      { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1] }, // 15
      
      // Top face (indices 16-19)
      { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0] }, // 16
      { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0] }, // 17
      { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1] }, // 18
      { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1] }, // 19
      
      // Bottom face (indices 20-23)
      { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 0] }, // 20
      { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0] }, // 21
      { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 1] }, // 22
      { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1] }, // 23
    ]
    
    // Pre-allocate TypedArrays for optimal performance
    const numVertices = 24
    const positionNumComponents = 3
    const normalNumComponents = 3
    const uvNumComponents = 2
    
    const positions = new Float32Array(numVertices * positionNumComponents)
    const normals = new Float32Array(numVertices * normalNumComponents)
    const uvs = new Float32Array(numVertices * uvNumComponents)
    
    // Fill vertex data using .set() for performance
    let posNdx = 0, nrmNdx = 0, uvNdx = 0
    for (const vertex of vertices) {
      positions.set(vertex.pos, posNdx)
      normals.set(vertex.norm, nrmNdx)
      uvs.set(vertex.uv, uvNdx)
      posNdx += positionNumComponents
      nrmNdx += normalNumComponents
      uvNdx += uvNumComponents
    }
    
    // Define triangles with face metadata for maximum flexibility
    const triangleDefinitions = [
      // Front face (materialIndex: 0)
      { vertices: [0, 1, 2], face: 0 },
      { vertices: [2, 3, 0], face: 0 },
      
      // Right face (materialIndex: 1)
      { vertices: [4, 5, 6], face: 1 },
      { vertices: [6, 7, 4], face: 1 },
      
      // Back face (materialIndex: 2)
      { vertices: [8, 9, 10], face: 2 },
      { vertices: [10, 11, 8], face: 2 },
      
      // Left face (materialIndex: 3)
      { vertices: [12, 13, 14], face: 3 },
      { vertices: [14, 15, 12], face: 3 },
      
      // Top face (materialIndex: 4)
      { vertices: [16, 17, 18], face: 4 },
      { vertices: [18, 19, 16], face: 4 },
      
      // Bottom face (materialIndex: 5)
      { vertices: [20, 21, 22], face: 5 },
      { vertices: [22, 23, 20], face: 5 },
    ]
    
    // Build indices and groups from triangle definitions
    const indices: number[] = []
    const faceGroups = new Map<number, { start: number, count: number }>()
    
    triangleDefinitions.forEach(triangle => {
      const startIndex = indices.length
      indices.push(...triangle.vertices)
      
      // Track or create face group
      if (!faceGroups.has(triangle.face)) {
        faceGroups.set(triangle.face, { start: startIndex, count: 0 })
      }
      faceGroups.get(triangle.face)!.count += 3  // 3 indices per triangle
    })
    
    // Set geometry attributes
    geo.setAttribute('position', new THREE.BufferAttribute(positions, positionNumComponents))
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, normalNumComponents))
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, uvNumComponents))
    
    // Set indices for indexed geometry
    geo.setIndex(indices)
    
    // Add material groups based on calculated face groups
    faceGroups.forEach((group, faceIndex) => {
      geo.addGroup(group.start, group.count, faceIndex)
    })
    
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
          <Badge variant="secondary" className="text-lg font-bold">
            {FACE_NAMES[hoveredFace]}
          </Badge>
        </Html>
      )}
    </>
  )
}