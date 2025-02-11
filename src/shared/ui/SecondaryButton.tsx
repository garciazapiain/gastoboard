'use client'

type SecondaryButtonProps = {
  children: React.ReactNode
  onClick: () => void
  selected?: boolean
  color?: 'red' | 'blue' | 'gray' // ✅ Accept color prop
}

export default function SecondaryButton({
  children,
  onClick,
  selected,
  color = 'blue',
}: SecondaryButtonProps) {
  const baseClasses = 'px-3 py-1 rounded focus:outline-none transition'

  // ✅ Apply dynamic color styles
  const colorClasses = selected
    ? color === 'blue'
      ? 'bg-blue-900 text-white'
      : 'bg-blue-500 text-white'
    : color === 'red'
      ? 'bg-red-500 text-white hover:bg-red-600'
      : 'bg-blue-500 text-white hover:bg-gray-300'

  return (
    <button onClick={onClick} className={`${baseClasses} ${colorClasses}`}>
      {children}
    </button>
  )
}
