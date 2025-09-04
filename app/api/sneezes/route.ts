import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sneezes = await prisma.sneeze.findMany({
      orderBy: {
        date: 'desc',
      },
    })
    return NextResponse.json(sneezes)
  } catch (error) {
    console.error('Failed to fetch sneezes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sneezes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { intensity, location, notes, date } = body

    if (!intensity || intensity < 1 || intensity > 5) {
      return NextResponse.json(
        { error: 'Intensity must be between 1 and 5' },
        { status: 400 }
      )
    }

    const sneeze = await prisma.sneeze.create({
      data: {
        intensity: parseInt(intensity),
        location: location || null,
        notes: notes || null,
        date: date ? new Date(date) : new Date(),
      },
    })

    return NextResponse.json(sneeze, { status: 201 })
  } catch (error) {
    console.error('Failed to create sneeze:', error)
    return NextResponse.json(
      { error: 'Failed to record sneeze' },
      { status: 500 }
    )
  }
}