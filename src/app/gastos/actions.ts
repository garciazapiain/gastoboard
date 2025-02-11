'use server'

import prisma from '@/lib/prisma'
import { startOfMonth, format } from 'date-fns'
import cloudinary from '@/lib/cloudinary'
import { Prisma } from '@prisma/client'
import exp from 'constants'

// ✅ Type Definitions
interface ExpenseData {
  id?: string
  user_id: string
  vendor_id: string
  category_id: string
  amount: string | number
  date: string
  receipt_path?: string | null
}

// ✅ Fetch Expenses
export async function getExpenses(startDate?: string, endDate?: string) {
  if (!startDate) {
    startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  }
  if (!endDate) {
    endDate = format(new Date(), 'yyyy-MM-dd')
  }

  const start = new Date(`${startDate}T00:00:00.000`)
  const end = new Date(`${endDate}T23:59:59.999`)

  const expenses = await prisma.expenses.findMany({
    where: { date: { gte: start, lte: end } },
    orderBy: { date: 'asc' },
    include: {
      vendors: true,
      categories: true,
      expense_splits: { include: { branches: true } },
      receipts: true,
    },
  })

  return expenses.map((expense) => ({
    id: expense.id,
    date: expense.date.toISOString().split('T')[0],
    vendor: expense.vendors.name,
    amount: Number(expense.amount),
    category: expense.categories.name,
    branchId: expense.expense_splits.map((split) => split.branches.id),
    splitPercentage:
      expense.expense_splits.length > 1
        ? expense.expense_splits.map((split) => split.percentage)
        : undefined,
    receipt: expense.receipts ? expense.receipts.path : null,
  }))
}

// ✅ Add Expense
export async function addExpense(expenseData: ExpenseData) {
  const { user_id, vendor_id, category_id, amount, date, receipt } =
    expenseData;

  if (!user_id || !vendor_id || !category_id || !amount || !date) {
    throw new Error('Missing required fields');
  }

  // ✅ Step 1: First create the expense
  const newExpense = await prisma.expenses.create({
    data: {
      user_id,
      vendor_id,
      category_id,
      amount: new Prisma.Decimal(amount),
      date: new Date(date),
    },
  });

  // ✅ Step 2: If there's a receipt, create it separately and link it
  if (receipt) {
    const receipt_created = await prisma.receipts.create({
      data: { path: receipt },
    });

    // ✅ Step 3: Update the newly created expense with the receipt ID
    await prisma.expenses.update({
      where: { id: newExpense.id },
      data: { receipt_id: receipt_created.id },
    });
  }

  return newExpense;
}

// ✅ Update Expense
export async function updateExpense(expenseData: ExpenseData) {
  const { id, user_id, vendor_id, category_id, amount, date, receipt } =
    expenseData
  
    console.log(expenseData, 'expenseData')

  if (!id || !user_id || !vendor_id || !category_id || !amount || !date) {
    throw new Error('Missing required fields')
  }

  // Get the current expense to check if a receipt exists
  const existingExpense = await prisma.expenses.findUnique({
    where: { id },
    include: { receipts: true },
  })

  let receiptId: string | null = existingExpense?.receipt_id ?? null

  if (receipt) {
    if (receiptId) {
      // Update existing receipt
      await prisma.receipts.update({
        where: { id: receiptId },
        data: { path: receipt },
      })
    } else {
      // Create new receipt
      const newReceipt = await prisma.receipts.create({
        data: { path: receipt },
      })
      receiptId = newReceipt.id
    }
  } else if (receiptId) {
    // If receipt_path is empty, remove the existing receipt
    await prisma.receipts.delete({
      where: { id: receiptId },
    })
    receiptId = null
  }

  const updatedExpense = await prisma.expenses.update({
    where: { id },
    data: {
      user_id,
      vendor_id,
      category_id,
      amount: new Prisma.Decimal(amount), // Ensure amount is Decimal
      date: new Date(date),
      receipt_id: receiptId, // Update receipt reference
    },
  })

  return updatedExpense
}

// ✅ Delete Expense
export async function deleteExpense(id: string) {
  const expense = await prisma.expenses.findUnique({
    where: { id },
    include: { receipts: true },
  })

  if (expense?.receipts?.path) {
    try {
      // Extract Cloudinary Public ID
      const urlParts = expense.receipts.path.split('/')
      const filename = urlParts[urlParts.length - 1]
      const publicId = `receipts/${filename.split('.')[0]}` // Preserve folder structure

      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.error('Error deleting Cloudinary image:', error)
    }
  }

  await prisma.expenses.delete({ where: { id } })
}
