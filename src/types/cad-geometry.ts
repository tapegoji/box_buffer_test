// CAD-specific geometry types for OpenCASCADE integration
import * as THREE from 'three'

export interface CADTransform {
  position: [number, number, number]
  rotation: [number, number, number] // Euler angles in radians
  scale: [number, number, number]
}

export interface CADMetadata {
  name: string
  source: 'OpenCASCADE' | 'Manual'
  tessellationQuality: 'low' | 'medium' | 'high'
  deflection: number
  angularTolerance: number
}

// Face information for BufferGeometry - maps to material groups
export interface CADFaceInfo {
  id: string
  name: string
  materialIndex: number
  vertexStart: number // Starting vertex index in the buffer
  vertexCount: number  // Number of vertices for this face
}

// Optimized BufferGeometry format
export interface BufferGeometryData {
  positions: number[]
  normals: number[]
  uvs: number[]
  vertexCount: number
  faces: CADFaceInfo[]
}

export interface CADMeshData {
  id: string
  metadata: CADMetadata
  transform: CADTransform
  bufferGeometry: BufferGeometryData
}

// Hook return types
export interface UseCADGeometryReturn {
  geometry: THREE.BufferGeometry | null
  materials: THREE.Material[]
  faceNames: string[]
  transform: CADTransform | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

// Three.js related types for better integration
export interface ProcessedGeometry {
  vertices: Float32Array
  normals: Float32Array
  uvs: Float32Array
  indices: number[] | null // Can be null for non-indexed geometry
  groups: Array<{
    start: number
    count: number
    materialIndex: number
  }>
}

// Error types for better error handling
export type CADGeometryError = 
  | 'FETCH_FAILED'
  | 'INVALID_DATA'
  | 'PROCESSING_FAILED'
  | 'NETWORK_ERROR'

export interface CADGeometryErrorDetails {
  type: CADGeometryError
  message: string
  details?: unknown
}