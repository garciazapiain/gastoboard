'use client'
import { useState } from 'react'
import TicketViewer from './TicketViewer'
import { Eye } from 'lucide-react'

// ✅ Define Expense Type
interface Expense {
  id: string
  date: string
  category: string
  vendor: string
  amount: number
  receipt?: string | null
}

// ✅ Define Props
interface TableExpensesProps {
  initialData: Expense[]
  onEditExpense: (expense: Expense) => void
}

export default function TableExpenses({ initialData, onEditExpense }: TableExpensesProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)

  if (!initialData || initialData.length === 0) return <p>No expenses found.</p>

  return (
    <div>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-black">
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Categoría</th>
            <th className="border p-2">Proveedor</th>
            <th className="border p-2">$ Cantidad</th>
            <th className="border p-2">Ticket</th>
          </tr>
        </thead>
        <tbody>
          {initialData.map((expense) => (
            <tr
              key={expense.id}
              className="cursor-pointer border-b text-center hover:bg-gray-100"
              onClick={() => onEditExpense(expense)}
            >
              <td className="p-2">{expense.date}</td>
              <td className="p-2">{expense.category}</td>
              <td className="p-2">{expense.vendor}</td>
              <td className="p-2">${expense.amount.toFixed(2)}</td>
              <td className="p-2">
                {expense.receipt ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedReceipt(expense.receipt)
                    }}
                  >
                    <Eye className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                  </button>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Show TicketViewer when a receipt is selected */}
      {selectedReceipt && <TicketViewer receiptPath={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
    </div>
  )
}
