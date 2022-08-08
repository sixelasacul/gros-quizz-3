import * as React from 'react'
import cx from 'classnames'

interface IconButtonProps {
  icon: React.ReactNode
  disabled?: boolean
  className?: string
  onClick?(): void
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, disabled, className, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={cx(`
          p-1 rounded-full disabled:opacity-50
          border-2 border-gray-400
          text-gray-700 bg-gray-50 enabled:hover:bg-gray-200
          focus:outline-none ring-gray-900 enabled:focus:ring-2
          transition-all duration-150 ease-in-out
        `, className)}
      >
        {icon}
      </button>
    )
}
)