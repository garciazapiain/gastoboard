import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from '@/app/gastos/actions'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const startDate = searchParams.get('start')
  const endDate = searchParams.get('end')

  try {
    const expenses = await getExpenses(
      startDate || undefined,
      endDate || undefined
    )
    return NextResponse.json(expenses)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body || typeof body !== 'object') {
      console.error('Invalid request payload:', body)
      return NextResponse.json(
        { error: 'Invalid request payload' },
        { status: 400 }
      )
    }

    const newExpense = await addExpense(body)
    return NextResponse.json(newExpense, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const updatedExpense = await updateExpense(body)
    return NextResponse.json(updatedExpense, { status: 200 })
  } catch (error) {
    console.error('Error updating expense:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await deleteExpense(id)
    return NextResponse.json({ message: 'Expense deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
