// CAD-specific geometry types for OpenCASCADE integration

export interface Vector3 {
  pos: [number, number, number]
  norm: [number, number, number]
  uv: [number, number]
}

export interface Triangle {
  vertices: [number, number, number]
}

export interface CADFace {
  id: string
  name: string
  materialIndex: number
  vertices: Vector3[]
  triangles: Triangle[]
}

export interface CADMetadata {
  name: string
  source: 'OpenCASCADE' | 'Manual'
  tessellationQuality: 'low' | 'medium' | 'high'
  deflection: number
  angularTolerance: number
}

export interface CADMeshData {
  id: string
  metadata: CADMetadata
  faces: CADFace[]
}

// Hook return types
export interface UseCADGeometryReturn {
  geometry: THREE.BufferGeometry | null
  materials: THREE.Material[]
  faceNames: string[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

// Three.js related types for better integration
export interface ProcessedGeometry {
  vertices: Float32Array
  normals: Float32Array
  uvs: Float32Array
  indices: number[]
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