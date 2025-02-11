import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const vendors = await prisma.vendors.findMany({
      select: { id: true, name: true },
    })

    const categories = await prisma.categories.findMany({
      select: { id: true, name: true },
    })

    return NextResponse.json({ vendors, categories })
  } catch (error) {
    console.error('Error fetching vendors and categories:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
