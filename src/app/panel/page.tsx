import { getExpenses } from '../gastos/actions'

export default async function Panel() {
  const expenses = await getExpenses() // Fetch only current month

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Dashboard - Overview</h1>
      <p>
        Total Expenses: $
        {expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
      </p>
      <a
        href="/gastos"
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Ver todos los gastos
      </a>
    </main>
  )
}
