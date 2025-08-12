'use client'

import { useRef, useMemo, useState } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { Badge } from '@/components/ui/badge'
import { useCADGeometry } from '@/hooks/useCADGeometry'

interface CustomGeometryProps {
  geometryId: string
}

export default function CustomGeometry({ geometryId }: CustomGeometryProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hoveredFace, setHoveredFace] = useState<number>(-1)
  const [selectedFaces, setSelectedFaces] = useState<Set<number>>(new Set())

  // Use CAD geometry hook with the provided geometryId
  const { geometry, materials: baseMaterials, faceNames, transform, isLoading, error } = useCADGeometry(geometryId)

  // Create materials with dynamic colors based on hover/selection state
  const materials = useMemo(() => {
    if (!baseMaterials.length) return []
    
    return baseMaterials.map((_, index) => 
      new THREE.MeshStandardMaterial({ 
        color: selectedFaces.has(index) || hoveredFace === index ? '#ff0000' : '#cccccc',
        side: THREE.DoubleSide
      })
    )
  }, [baseMaterials, hoveredFace, selectedFaces])

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

  // Loading state
  if (isLoading) {
    return (
      <Html position={[0, 0, 0]} center>
        <Badge variant="outline" className="text-lg">
          Loading CAD Geometry...
        </Badge>
      </Html>
    )
  }

  // Error state
  if (error) {
    return (
      <Html position={[0, 0, 0]} center>
        <Badge variant="destructive" className="text-lg">
          Error: {error}
        </Badge>
      </Html>
    )
  }

  // No geometry available
  if (!geometry) {
    return (
      <Html position={[0, 0, 0]} center>
        <Badge variant="outline" className="text-lg">
          No geometry data
        </Badge>
      </Html>
    )
  }

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={materials}
        position={transform?.position || [0, 0, 0]}
        rotation={transform?.rotation || [0, 0, 0]}
        scale={transform?.scale || [1, 1, 1]}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      />
      
      {hoveredFace !== -1 && faceNames.length > hoveredFace && (
        <Html 
          position={[
            (transform?.position[0] || 0), 
            (transform?.position[1] || 0), 
            (transform?.position[2] || 0) + 3
          ]} 
          center
        >
          <Badge variant="secondary" className="text-lg font-bold">
            {faceNames[hoveredFace]}
          </Badge>
        </Html>
      )}
    </>
  )
}