'use client'
import { useState } from 'react'
import { getDefaultDates } from '@/shared/utils/dateUtils'
import DateFilterOption from './DateFilterOption'
import SecondaryButton from '@/shared/ui/SecondaryButton'

interface FilterProps {
  onApplyFilters: (filters: { startDate: string; endDate: string }) => void
}

export default function FilterWrapper({ onApplyFilters }: FilterProps) {
  const [filters, setFilters] = useState(getDefaultDates()) // ✅ Use helper

  function updateFilter(startDate: string, endDate: string) {
    setFilters({ startDate, endDate })
  }

  function handleApply() {
    onApplyFilters(filters)
  }

  function handleReset() {
    const resetFilters = getDefaultDates() // ✅ Get correct default values
    setFilters(resetFilters)
    onApplyFilters(resetFilters)
  }

  return (
    <div className="rounded border p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Filtros</h2>
      <DateFilterOption
        startDate={filters.startDate} // ✅ Pass controlled startDate
        endDate={filters.endDate} // ✅ Pass controlled endDate
        onChange={updateFilter}
      />
      <div className="mt-4 space-x-4">
        <SecondaryButton onClick={handleApply}>Aplicar</SecondaryButton>
        <SecondaryButton color="red" onClick={handleReset}>
          Resetear
        </SecondaryButton>
      </div>
    </div>
  )
}
