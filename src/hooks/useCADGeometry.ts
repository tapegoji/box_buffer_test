import { useState, useEffect, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { CADMeshData, UseCADGeometryReturn, ProcessedGeometry } from '@/types/cad-geometry'

export function useCADGeometry(geometryId: string): UseCADGeometryReturn {
  const [cadData, setCadData] = useState<CADMeshData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGeometry = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/geometry/${geometryId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch geometry: ${response.status}`)
      }

      const data: CADMeshData = await response.json()
      
      // Validate the received data structure
      if (!data.faces || !Array.isArray(data.faces)) {
        throw new Error('Invalid CAD data: missing faces array')
      }

      setCadData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setCadData(null)
    } finally {
      setIsLoading(false)
    }
  }, [geometryId])

  const refetch = useCallback(() => {
    fetchGeometry()
  }, [fetchGeometry])

  useEffect(() => {
    fetchGeometry()
  }, [fetchGeometry])

  // Process CAD data into Three.js geometry
  const processedGeometry = useMemo((): ProcessedGeometry | null => {
    if (!cadData) return null

    const allVertices: number[] = []
    const allNormals: number[] = []
    const allUvs: number[] = []
    const allIndices: number[] = []
    const groups: Array<{ start: number; count: number; materialIndex: number }> = []

    let vertexOffset = 0

    cadData.faces.forEach((face) => {
      const faceStartIndex = allIndices.length

      // Add vertices, normals, and UVs for this face
      face.vertices.forEach((vertex) => {
        allVertices.push(...vertex.pos)
        allNormals.push(...vertex.norm)
        allUvs.push(...vertex.uv)
      })

      // Add indices for this face's triangles
      face.triangles.forEach((triangle) => {
        allIndices.push(
          triangle.vertices[0] + vertexOffset,
          triangle.vertices[1] + vertexOffset,
          triangle.vertices[2] + vertexOffset
        )
      })

      // Create material group for this face
      const triangleCount = face.triangles.length * 3
      groups.push({
        start: faceStartIndex,
        count: triangleCount,
        materialIndex: face.materialIndex
      })

      vertexOffset += face.vertices.length
    })

    return {
      vertices: new Float32Array(allVertices),
      normals: new Float32Array(allNormals),
      uvs: new Float32Array(allUvs),
      indices: allIndices,
      groups
    }
  }, [cadData])

  // Create Three.js BufferGeometry
  const geometry = useMemo(() => {
    if (!processedGeometry) return null

    const geo = new THREE.BufferGeometry()

    // Set attributes
    geo.setAttribute('position', new THREE.BufferAttribute(processedGeometry.vertices, 3))
    geo.setAttribute('normal', new THREE.BufferAttribute(processedGeometry.normals, 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(processedGeometry.uvs, 2))

    // Set indices
    geo.setIndex(processedGeometry.indices)

    // Add material groups
    processedGeometry.groups.forEach((group) => {
      geo.addGroup(group.start, group.count, group.materialIndex)
    })

    return geo
  }, [processedGeometry])

  // Create materials array
  const materials = useMemo(() => {
    if (!cadData) return []

    const materialCount = cadData.faces.length
    return Array.from({ length: materialCount }, () => 
      new THREE.MeshStandardMaterial({ 
        color: '#cccccc',
        side: THREE.DoubleSide
      })
    )
  }, [cadData])

  // Extract face names for UI
  const faceNames = useMemo(() => {
    if (!cadData) return []
    return cadData.faces.map(face => face.name)
  }, [cadData])

  // Extract transform data
  const transform = useMemo(() => {
    return cadData?.transform || null
  }, [cadData])

  return {
    geometry,
    materials,
    faceNames,
    transform,
    isLoading,
    error,
    refetch
  }
}