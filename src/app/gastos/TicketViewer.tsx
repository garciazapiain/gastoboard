'use client'
import { useEffect } from 'react'

interface TicketViewerProps {
  receiptPath: string
  onClose: () => void
}

export default function TicketViewer({ receiptPath, onClose }: TicketViewerProps) {
  // Close when user presses "Esc"
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose} // Click outside to close
    >
      <div
        className="relative max-w-full w-[90vw] max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
        >
          ✖
        </button>

        {/* Image */}
        <img
          src={receiptPath}
          alt="Receipt"
          className="w-full h-auto max-h-[80vh] object-contain"
        />
      </div>
    </div>
  )
}
