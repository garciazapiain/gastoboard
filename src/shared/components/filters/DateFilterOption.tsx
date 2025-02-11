'use client'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns'
import SecondaryButton from '@/shared/ui/SecondaryButton'
import { useState } from 'react'

interface DateFilterProps {
  startDate: any
  endDate: any
  onChange: (startDate: string, endDate: string) => void
}

export default function DateFilterOption({
  startDate,
  endDate,
  onChange,
}: DateFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null) // ✅ Track selected quick filter

  function handleStartDateChange(date: Date | null) {
    setSelectedFilter(null) // ❌ Clear quick filter selection
    if (date && endDate) {
      const formattedStart = format(
        new Date(date.setHours(12, 0, 0, 0)),
        'yyyy-MM-dd'
      ) // ✅ Ensure local time
      const formattedEnd = format(
        new Date(endDate.setHours(12, 0, 0, 0)),
        'yyyy-MM-dd'
      ) // ✅ Ensure local time
      onChange(formattedStart, formattedEnd)
    }
  }

  function handleEndDateChange(date: Date | null) {
    setSelectedFilter(null) // ❌ Clear quick filter selection
    if (startDate && date) {
      const formattedStart = format(
        new Date(startDate.setHours(12, 0, 0, 0)),
        'yyyy-MM-dd'
      ) // ✅ Ensure local time
      const formattedEnd = format(
        new Date(date.setHours(12, 0, 0, 0)),
        'yyyy-MM-dd'
      ) // ✅ Ensure local time
      onChange(formattedStart, formattedEnd)
    }
  }

  function applyQuickFilter(monthsAgo: number) {
    setSelectedFilter(monthsAgo) // ✅ Highlight selected quick filter

    const newStart = startOfMonth(subMonths(new Date(), monthsAgo))
    const newEnd =
      monthsAgo === 1 // Only change endDate for "Last Month"
        ? endOfMonth(subMonths(new Date(), 1))
        : endOfMonth(new Date())

    const formattedStart = format(
      new Date(newStart.setHours(12, 0, 0, 0)),
      'yyyy-MM-dd'
    ) // ✅ Local time
    const formattedEnd = format(
      new Date(newEnd.setHours(12, 0, 0, 0)),
      'yyyy-MM-dd'
    ) // ✅ Local time

    onChange(formattedStart, formattedEnd)
  }

  return (
    <div className="mb-3 rounded border p-4 shadow-sm">
      <h3 className="mb-2 font-medium">Seleccionar fechas</h3>

      {/* Date Pickers */}
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium text-white">Inicio</label>
          <DatePicker
            selected={startDate ? new Date(`${startDate}T00:00:00`) : null} // ✅ Ensure correct local time
            onChange={handleStartDateChange}
            dateFormat="yyyy-MM-dd"
            className="w-full rounded border p-2 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Fin</label>
          <DatePicker
            selected={endDate ? new Date(`${endDate}T00:00:00`) : null} // ✅ Ensure correct local time
            onChange={handleEndDateChange}
            dateFormat="yyyy-MM-dd"
            className="w-full rounded border p-2 text-black"
          />
        </div>
      </div>

      {/* Quick Filters with Selected State */}
      <div className="mt-3 flex space-x-2">
        <SecondaryButton
          onClick={() => applyQuickFilter(1)}
          selected={selectedFilter === 1}
        >
          Mes pasado
        </SecondaryButton>
        <SecondaryButton
          onClick={() => applyQuickFilter(3)}
          selected={selectedFilter === 3}
        >
          Pasados 3 meses
        </SecondaryButton>
        <SecondaryButton
          onClick={() => applyQuickFilter(12)}
          selected={selectedFilter === 12}
        >
          Último año
        </SecondaryButton>
      </div>
    </div>
  )
}
