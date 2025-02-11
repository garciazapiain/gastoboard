import { getExpenses } from './actions'
import ClientExpensesPage from './ClientExpensesPage'

// ✅ Define the type for expenses
interface Expense {
  id: string
  user_id?: string // User ID might not be returned from getExpenses()
  vendor_id: string
  amount: string | number
  category_id: string
  date: string
  receipt?: string | null
}

export default async function ExpensesPage() {
  const fetchedExpenses = await getExpenses() // Initial fetch for SSR

  // ✅ Transform fetched data to match the expected Expense structure
  const expenses: Expense[] = fetchedExpenses.map((expense) => ({
    id: expense.id,
    vendor_id: expense.vendor, // Convert "vendor" to "vendor_id"
    category_id: expense.category, // Convert "category" to "category_id"
    amount: expense.amount,
    date: expense.date,
    receipt: expense.receipt,
  }))

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Expenses</h1>
      <ClientExpensesPage initialData={expenses} />
    </main>
  )
}
