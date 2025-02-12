'use client'
import { useState } from 'react'

export default function TicketViewer({ receiptPath }: { receiptPath: string }) {
  return (
    <div className="p-4">
      <img
        src={receiptPath}
        alt="Receipt"
        className="h-[80vh] max-w-screen-md rounded-lg object-contain shadow-lg"
      />
    </div>
  )
}
