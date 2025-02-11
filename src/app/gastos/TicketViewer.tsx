'use client'
import { useState } from 'react'

export default function TicketViewer({ receiptPath }: { receiptPath: string }) {
  return (
    <div className="p-4">
      <img
        src={receiptPath}
        alt="Receipt"
        className="max-h-screen-md max-w-screen-md rounded-lg object-contain shadow-lg"
      />
    </div>
  )
}
