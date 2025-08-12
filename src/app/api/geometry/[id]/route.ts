import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: geometryId } = await params

  // Simulate processing delay for CAD operations
  await new Promise(resolve => setTimeout(resolve, 100))

  // Sample CAD mesh data matching the current box geometry structure
  // This simulates data that would come from OpenCASCADE topology translation
  const cadMeshData = {
    id: geometryId,
    metadata: {
      name: `CAD_Geometry_${geometryId}`,
      source: 'OpenCASCADE',
      tessellationQuality: 'medium',
      deflection: 0.1,
      angularTolerance: 0.1
    },
    faces: [
      {
        id: 'front',
        name: 'FRONT',
        materialIndex: 0,
        vertices: [
          { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0] },
          { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0] },
          { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1] },
          { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1] }
        ],
        triangles: [
          { vertices: [0, 1, 2] },
          { vertices: [2, 3, 0] }
        ]
      },
      {
        id: 'right',
        name: 'RIGHT',
        materialIndex: 1,
        vertices: [
          { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0] },
          { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0] },
          { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1] },
          { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1] }
        ],
        triangles: [
          { vertices: [0, 1, 2] },
          { vertices: [2, 3, 0] }
        ]
      },
      {
        id: 'back',
        name: 'BACK',
        materialIndex: 2,
        vertices: [
          { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0] },
          { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0] },
          { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1] },
          { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1] }
        ],
        triangles: [
          { vertices: [0, 1, 2] },
          { vertices: [2, 3, 0] }
        ]
      },
      {
        id: 'left',
        name: 'LEFT',
        materialIndex: 3,
        vertices: [
          { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0] },
          { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0] },
          { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 1] },
          { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1] }
        ],
        triangles: [
          { vertices: [0, 1, 2] },
          { vertices: [2, 3, 0] }
        ]
      },
      {
        id: 'top',
        name: 'TOP',
        materialIndex: 4,
        vertices: [
          { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0] },
          { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0] },
          { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1] },
          { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1] }
        ],
        triangles: [
          { vertices: [0, 1, 2] },
          { vertices: [2, 3, 0] }
        ]
      },
      {
        id: 'bottom',
        name: 'BOTTOM',
        materialIndex: 5,
        vertices: [
          { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 0] },
          { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0] },
          { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 1] },
          { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1] }
        ],
        triangles: [
          { vertices: [0, 1, 2] },
          { vertices: [2, 3, 0] }
        ]
      }
    ]
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