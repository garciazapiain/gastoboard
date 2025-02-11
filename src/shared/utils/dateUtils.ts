import { startOfMonth, format } from 'date-fns'

export function getDefaultDates() {
  return {
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'), // ✅ First of the current month
    endDate: format(new Date(), 'yyyy-MM-dd'), // ✅ Today's date
  }
}
