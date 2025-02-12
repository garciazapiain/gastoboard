'use client'
import { useState } from 'react'
import TicketViewer from './TicketViewer'

interface Expense {
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
  newExpense: Expense
  setNewExpense: (expense: Expense) => void
  vendors: Vendor[]
  categories: Category[]
  onClose: () => void
  onSave: () => void
  isEditing: boolean
  onDelete?: () => void
}

export default function AddOrEditExpensePopup({
  newExpense,
  setNewExpense,
  vendors,
  categories,
  onClose,
  onSave,
  isEditing,
  onDelete,
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [isViewingTicket, setIsViewingTicket] = useState(false) // Modal state

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    setUploading(false)

    if (res.ok) {
      setNewExpense({ ...newExpense, receipt: data.secure_url })
    } else {
      alert('Error uploading file')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 text-black shadow-lg">
        <h2 className="mb-4 text-xl font-bold">
          {isEditing ? 'Editar Gasto' : 'Agregar Gasto'}
        </h2>

        {/* Upload Section */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="mb-4"
        />
        {uploading && <p>Uploading...</p>}

        {/* View Receipt Button */}
        {newExpense.receipt && (
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={() => setIsViewingTicket(true)}
              className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
            >
              Ver Ticket
            </button>
          </div>
        )}

        {/* Expense Inputs */}
        <select
          value={newExpense.vendor_id || ''}
          onChange={(e) =>
            setNewExpense({ ...newExpense, vendor_id: e.target.value })
          }
          className="mb-4 w-full rounded border p-2"
        >
          <option value="">Proveedor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Cantidad $"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
          className="mb-4 w-full rounded border p-2"
        />

        <select
          value={newExpense.category_id || ''}
          onChange={(e) =>
            setNewExpense({ ...newExpense, category_id: e.target.value })
          }
          className="mb-4 w-full rounded border p-2"
        >
          <option value="">Categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          placeholder="Date"
          value={newExpense.date}
          onChange={(e) =>
            setNewExpense({ ...newExpense, date: e.target.value })
          }
          className="mb-4 w-full rounded border p-2"
        />

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {isEditing ? 'Actualizar' : 'Guardar'}
          </button>
          {isEditing && onDelete && (
            <button
              onClick={onDelete}
              className="ml-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {isViewingTicket && newExpense.receipt && (
          <TicketViewer receiptPath={newExpense.receipt} onClose={() => setIsViewingTicket(false)} />
        )}
    </div>
  )
}
