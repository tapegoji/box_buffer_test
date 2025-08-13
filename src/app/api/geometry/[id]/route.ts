import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: geometryId } = await params

  // Simulate processing delay for CAD operations
  await new Promise(resolve => setTimeout(resolve, 100))

  // Sample CAD mesh data optimized for BufferGeometry
  // This simulates data that would come from OpenCASCADE topology translation
  let cadMeshData

  if (geometryId === 'box1') {
    // First box geometry - optimized for BufferGeometry with flat arrays
    const positions = new Float32Array([
      // Front face
      -1, -1,  1,   1, -1,  1,   1,  1,  1,
      -1, -1,  1,   1,  1,  1,  -1,  1,  1,
      // Right face
       1, -1,  1,   1, -1, -1,   1,  1, -1,
       1, -1,  1,   1,  1, -1,   1,  1,  1,
      // Back face
       1, -1, -1,  -1, -1, -1,  -1,  1, -1,
       1, -1, -1,  -1,  1, -1,   1,  1, -1,
      // Left face
      -1, -1, -1,  -1, -1,  1,  -1,  1,  1,
      -1, -1, -1,  -1,  1,  1,  -1,  1, -1,
      // Top face
       1,  1, -1,  -1,  1, -1,  -1,  1,  1,
       1,  1, -1,  -1,  1,  1,   1,  1,  1,
      // Bottom face
       1, -1,  1,  -1, -1,  1,  -1, -1, -1,
       1, -1,  1,  -1, -1, -1,   1, -1, -1
    ])

    const normals = new Float32Array([
      // Front face
       0,  0,  1,   0,  0,  1,   0,  0,  1,
       0,  0,  1,   0,  0,  1,   0,  0,  1,
      // Right face
       1,  0,  0,   1,  0,  0,   1,  0,  0,
       1,  0,  0,   1,  0,  0,   1,  0,  0,
      // Back face
       0,  0, -1,   0,  0, -1,   0,  0, -1,
       0,  0, -1,   0,  0, -1,   0,  0, -1,
      // Left face
      -1,  0,  0,  -1,  0,  0,  -1,  0,  0,
      -1,  0,  0,  -1,  0,  0,  -1,  0,  0,
      // Top face
       0,  1,  0,   0,  1,  0,   0,  1,  0,
       0,  1,  0,   0,  1,  0,   0,  1,  0,
      // Bottom face
       0, -1,  0,   0, -1,  0,   0, -1,  0,
       0, -1,  0,   0, -1,  0,   0, -1,  0
    ])

    const uvs = new Float32Array([
      // Front face
      0, 0,   1, 0,   1, 1,
      0, 0,   1, 1,   0, 1,
      // Right face
      0, 0,   1, 0,   1, 1,
      0, 0,   1, 1,   0, 1,
      // Back face
      0, 0,   1, 0,   1, 1,
      0, 0,   1, 1,   0, 1,
      // Left face
      0, 0,   1, 0,   1, 1,
      0, 0,   1, 1,   0, 1,
      // Top face
      0, 0,   1, 0,   1, 1,
      0, 0,   1, 1,   0, 1,
      // Bottom face
      0, 0,   1, 0,   1, 1,
      0, 0,   1, 1,   0, 1
    ])

    cadMeshData = {
      id: geometryId,
      metadata: {
        name: `CAD_Geometry_${geometryId}`,
        source: 'OpenCASCADE' as const,
        tessellationQuality: 'medium' as const,
        deflection: 0.1,
        angularTolerance: 0.1
      },
      transform: {
        position: [0, 0, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: [1, 1, 1] as [number, number, number]
      },
      bufferGeometry: {
        positions: Array.from(positions),
        normals: Array.from(normals),
        uvs: Array.from(uvs),
        vertexCount: positions.length / 3,
        faces: [
          { id: 'front', name: 'FRONT', materialIndex: 0, vertexStart: 0, vertexCount: 6 },
          { id: 'right', name: 'RIGHT', materialIndex: 1, vertexStart: 6, vertexCount: 6 },
          { id: 'back', name: 'BACK', materialIndex: 2, vertexStart: 12, vertexCount: 6 },
          { id: 'left', name: 'LEFT', materialIndex: 3, vertexStart: 18, vertexCount: 6 },
          { id: 'top', name: 'TOP', materialIndex: 4, vertexStart: 24, vertexCount: 6 },
          { id: 'bottom', name: 'BOTTOM', materialIndex: 5, vertexStart: 30, vertexCount: 6 }
        ]
      }
    }
  } else if (geometryId === 'box2') {
    // Second box geometry - optimized for BufferGeometry with flat arrays
    const positions = new Float32Array([
      // Front face
      -1, -1,  1,   1, -1,  1,   1,  1,  1,
      -1, -1,  1,   1,  1,  1,  -1,  1,  1,
      // Right face
       1, -1,  1,   1, -1, -1,   1,  1, -1,
       1, -1,  1,   1,  1, -1,   1,  1,  1,
      // Back face
       1, -1, -1,  -1, -1, -1,  -1,  1, -1,
       1, -1, -1,  -1,  1, -1,   1,  1, -1,
      // Left face
      -1, -1, -1,  -1, -1,  1,  -1,  1,  1,
      -1, -1, -1,  -1,  1,  1,  -1,  1, -1,
      // Top face
       1,  1, -1,  -1,  1, -1,  -1,  1,  1,
       1,  1, -1,  -1,  1,  1,   1,  1,  1,
      // Bottom face
       1, -1,  1,  -1, -1,  1,  -1, -1, -1,
       1, -1,  1,  -1, -1, -1,   1, -1, -1
    ])

    const normals = new Float32Array([
      // Front face
       0,  0,  1,   0,  0,  1,   0,  0,  1,
       0,  0,  1,   0,  0,  1,   0,  0,  1,
      // Right face
       1,  0,  0,   1,  0,  0,   1,  0,  0,
       1,  0,  0,   1,  0,  0,   1,  0,  0,
      // Back face
       0,  0, -1,   0,  0, -1,   0,  0, -1,
       0,  0, -1,   0,  0, -1,   0,  0, -1,
      // Left face
      -1,  0,  0,  -1,  0,  0,  -1,  0,  0,
      -1,  0,  0,  -1,  0,  0,  -1,  0,  0,
      // Top face
       0,  1,  0,   0,  1,  0,   0,  1,  0,
       0,  1,  0,   0,  1,  0,   0,  1,  0,
      // Bottom face
       0, -1,  0,   0, -1,  0,   0, -1,  0,
       0, -1,  0,   0, -1,  0,   0, -1,  0
    ])

    const uvs = new Float32Array([
      // Front face
      0, 0,   1, 0,   1, 1,
      0, 0,   1, 1,   0, 1,
      // Right face
      0, 0,   1, 0,   1, 1,
      0, 0,   1, 1,   0, 1,
      // Back face
      0, 0,   1, 0,   1, 1,
      0, 0,   1, 1,   0, 1,
      // Left face
      0, 0,   1, 0,   1, 1,
      0, 0,   1, 1,   0, 1,
      // Top face
      0, 0,   1, 0,   1, 1,
      0, 0,   1, 1,   0, 1,
      // Bottom face
      0, 0,   1, 0,   1, 1,
      0, 0,   1, 1,   0, 1
    ])

    cadMeshData = {
      id: geometryId,
      metadata: {
        name: `CAD_Geometry_${geometryId}`,
        source: 'OpenCASCADE' as const,
        tessellationQuality: 'medium' as const,
        deflection: 0.1,
        angularTolerance: 0.1
      },
      transform: {
        position: [3, 0, 2] as [number, number, number],
        rotation: [0, 0, Math.PI/4] as [number, number, number],
        scale: [0.5, 0.5, 2] as [number, number, number]
      },
      bufferGeometry: {
        positions: Array.from(positions),
        normals: Array.from(normals),
        uvs: Array.from(uvs),
        vertexCount: positions.length / 3,
        faces: [
          { id: 'front', name: 'FRONT', materialIndex: 0, vertexStart: 0, vertexCount: 6 },
          { id: 'right', name: 'RIGHT', materialIndex: 1, vertexStart: 6, vertexCount: 6 },
          { id: 'back', name: 'BACK', materialIndex: 2, vertexStart: 12, vertexCount: 6 },
          { id: 'left', name: 'LEFT', materialIndex: 3, vertexStart: 18, vertexCount: 6 },
          { id: 'top', name: 'TOP', materialIndex: 4, vertexStart: 24, vertexCount: 6 },
          { id: 'bottom', name: 'BOTTOM', materialIndex: 5, vertexStart: 30, vertexCount: 6 }
        ]
      }
    }
  }

  // Handle unknown geometry IDs
  if (!cadMeshData) {
    return NextResponse.json(
      { error: 'Unknown geometry ID' },
      { status: 404 }
    )
  }

  // Simulate different geometry types based on ID
  if (geometryId === 'invalid') {
    return NextResponse.json(
      { error: 'Invalid geometry ID' },
      { status: 404 }
    )
  }

  if (geometryId === 'error') {
    return NextResponse.json(
      { error: 'CAD processing failed' },
      { status: 500 }
    )
  }

  return NextResponse.json(cadMeshData, {
    headers: {
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
}