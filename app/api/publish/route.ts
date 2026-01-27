import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { update } = await request.json()

    if (!update || !update.trim()) {
      return NextResponse.json(
        { error: 'Update content is required' },
        { status: 400 }
      )
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock API response - in a real app, this would publish to a status page service
    const mockResponse = {
      success: true,
      id: crypto.randomUUID(),
      publishedAt: new Date().toISOString(),
      update: update.trim(),
    }

    return NextResponse.json(mockResponse)
  } catch (error: any) {
    console.error('Error publishing update:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to publish update' },
      { status: 500 }
    )
  }
}
