'use client'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import FilterWrapper from '@/shared/components/filters/FilterWrapper'
import TableExpenses from './TableExpenses'
import { getDefaultDates } from '@/shared/utils/dateUtils'
import AddOrEditExpensePopup from './AddOrEditExpensePopup'

// ✅ Type Definitions
interface Expense {
  id?: string
  user_id?: string
  vendor_id: string
  amount: string | number
  category_id: string
  date: string
  receipt?: string | null
}

interface Vendor {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

interface Props {
  initialData: Expense[]
}

// ✅ API Calls
async function fetchExpenses(
  startDate: string,
  endDate: string
): Promise<Expense[]> {
  const res = await fetch(`/api/gastos?start=${startDate}&end=${endDate}`)
  if (!res.ok) throw new Error('Failed to fetch expenses')
  return res.json()
}

async function fetchVendorsAndCategories(): Promise<{
  vendors: Vendor[]
  categories: Category[]
}> {
  const res = await fetch('/api/vendors-categories')
  if (!res.ok) throw new Error('Failed to fetch vendors and categories')
  return res.json()
}

async function addExpense(expenseData: Expense) {
  const res = await fetch('/api/gastos', {
    method: expenseData.id ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  })
  if (!res.ok) throw new Error('Failed to save expense')
  return res.json()
}

async function deleteExpense(id: string) {
  const res = await fetch('/api/gastos', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
  if (!res.ok) throw new Error('Failed to delete expense')
  return res.json()
}

// ✅ Component
export default function ClientExpensesPage({ initialData }: Props) {
  const [selectedDates, setSelectedDates] = useState(getDefaultDates())
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [newExpense, setNewExpense] = useState<Expense>({
    vendor_id: '',
    amount: '',
    category_id: '',
    date: '',
    receipt: '',
  })
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function loadData() {
      const data = await fetchVendorsAndCategories()
      setVendors(data.vendors)
      setCategories(data.categories)
    }
    loadData()
  }, [])

  const { data: expenses, refetch } = useQuery({
    queryKey: ['expenses', selectedDates.startDate, selectedDates.endDate],
    queryFn: () =>
      fetchExpenses(selectedDates.startDate, selectedDates.endDate),
    initialData,
    staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    refetch()
  }, [selectedDates, refetch])

  function handleApplyFilters(filters: { startDate: string; endDate: string }) {
    setSelectedDates(filters)
  }

  async function handleSaveExpense() {
    await addExpense({
      ...newExpense,
      user_id: 'efa15929-8030-4c9d-9ae1-fee84d5b9e23',
      // user_id: '0817ff44-efb5-46a3-81dd-15bff8f9cc09',
      id: editingExpense?.id,
    })
    setIsPopupOpen(false)
    setEditingExpense(null)
    refetch()
  }

  async function handleDeleteExpense() {
    if (!editingExpense?.id) return
    await deleteExpense(editingExpense.id)
    setIsPopupOpen(false)
    setEditingExpense(null)
    refetch()
  }

  function handleEditExpense(expense: Expense) {
    const vendor = vendors.find((v) => v.name === expense.vendor_id)
    const category = categories.find((c) => c.name === expense.category_id)
    setNewExpense({
      vendor_id: vendor ? vendor.id : '',
      amount: expense.amount,
      category_id: category ? category.id : '',
      date: expense.date,
      receipt: expense.receipt,
    })
    setEditingExpense(expense)
    setIsPopupOpen(true)
  }

  return (
    <div className="relative">
      <FilterWrapper onApplyFilters={handleApplyFilters} />
      <TableExpenses initialData={expenses} onEditExpense={handleEditExpense} />

      <button
        onClick={() => {
          setNewExpense({
            vendor_id: '',
            amount: '',
            category_id: '',
            date: '',
            receipt: '',
          })
          setEditingExpense(null)
          setIsPopupOpen(true)
        }}
        className="fixed bottom-6 right-6 rounded-full bg-blue-500 p-4 text-white shadow-lg hover:bg-blue-600"
      >
        +
      </button>

      {isPopupOpen && (
        <AddOrEditExpensePopup
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          vendors={vendors}
          categories={categories}
          onClose={() => setIsPopupOpen(false)}
          onSave={handleSaveExpense}
          isEditing={!!editingExpense}
          onDelete={handleDeleteExpense}
        />
      )}
    </div>
  )
}
