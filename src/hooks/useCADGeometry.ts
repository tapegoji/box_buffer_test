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
      
      console.log('Received CAD data:', data)
      console.log('bufferGeometry:', data.bufferGeometry)
      console.log('faces:', data.bufferGeometry?.faces)
      
      // Validate the received data structure
      if (!data.bufferGeometry || !data.bufferGeometry.faces || !Array.isArray(data.bufferGeometry.faces)) {
        console.error('Validation failed:', {
          hasBufferGeometry: !!data.bufferGeometry,
          hasFaces: !!data.bufferGeometry?.faces,
          isArray: Array.isArray(data.bufferGeometry?.faces)
        })
        throw new Error('Invalid CAD data: missing BufferGeometry data')
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
    if (!cadData?.bufferGeometry) return null

    const { positions, normals, uvs, faces } = cadData.bufferGeometry
    
    // Create material groups from face information
    const groups: Array<{ start: number; count: number; materialIndex: number }> = []
    
    faces.forEach((face) => {
      groups.push({
        start: face.vertexStart,
        count: face.vertexCount,
        materialIndex: face.materialIndex
      })
    })

    return {
      vertices: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: null, // No indices needed for non-indexed geometry
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

    // Set indices only if they exist (indexed geometry)
    if (processedGeometry.indices) {
      geo.setIndex(processedGeometry.indices)
    }

    // Add material groups
    processedGeometry.groups.forEach((group) => {
      geo.addGroup(group.start, group.count, group.materialIndex)
    })

    return geo
  }, [processedGeometry])

  // Create materials array
  const materials = useMemo(() => {
    if (!cadData?.bufferGeometry?.faces) return []

    const faceCount = cadData.bufferGeometry.faces.length
    return Array.from({ length: faceCount }, () => 
      new THREE.MeshStandardMaterial({ 
        color: '#cccccc',
        side: THREE.DoubleSide
      })
    )
  }, [cadData])

  // Extract face names for UI
  const faceNames = useMemo(() => {
    if (!cadData?.bufferGeometry?.faces) return []
    
    return cadData.bufferGeometry.faces.map(face => face.name)
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