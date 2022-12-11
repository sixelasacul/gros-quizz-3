import * as React from 'react'
import cx from 'classnames'
import { Switch } from '@headlessui/react'

interface IconButtonProps {
  icon: React.ReactNode
  disabled?: boolean
  className?: string
  onClick?(): void
}

interface ButtonProps {
  children: React.ReactNode
  icon?: React.ReactNode
  onClick?(): void
}

interface ToggleProps {
  label: string
  icon?: React.ReactNode // meh
  initialValue?: boolean
  onToggle?(enabled: boolean): void
}

export function IconButton({ icon, disabled, className, onClick }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(`
        p-1 rounded-full disabled:opacity-50
        text-sky-500 enabled:hover:bg-gray-200
        focus:outline-none ring-sky-300 enabled:focus:ring-2
        transition duration-150 ease-in-out
      `, className)}
    >
      {icon}
    </button>
  )
}

export function Button({ children, icon = null, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cx(`
          w-full rounded-lg px-6 py-2 text-sm font-medium leading-5
          bg-sky-500 text-white hover:bg-sky-600
          ring-sky-300 focus:outline-none focus:ring-2
          transition duration-150 ease-in-out
          flex flex-row gap-2 items-center
        `)}
    >
      {icon}{children}
    </button>
  )
}

export function Toggle({ label, icon = null, initialValue = false, onToggle }: ToggleProps) {
  const [enabled, setEnabled] = React.useState(initialValue)

  function toggle(newValue: boolean) {
    setEnabled(newValue)
    onToggle?.(newValue)
  }

  return (
    <Switch.Group>
      <div className="flex items-center justify-around gap-4 w-full group">
        <Switch.Label className="flex flex-row gap-2 items-center grow">
          {icon}{label}
        </Switch.Label>
        <Switch
          checked={enabled}
          onChange={toggle}
          className={cx(`
            relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors focus:outline-none focus:ring-2 focus:ring-sky-300
          `, {
            'bg-sky-500': enabled,
            'bg-sky-200': !enabled
          })}
        >
          <span
            className={cx(`
              inline-block h-4 w-4 transform rounded-full
              bg-white group-hover:bg-gray-100 transition
            `, {
              'translate-x-6': enabled,
              'translate-x-1': !enabled
            })}
          />
        </Switch>
      </div>
    </Switch.Group>
  )
}

interface UploadProps {
  label: string
  multiple?: boolean
  accept?: string
  onFileUpload(files: FileList | null): void
}

export function Upload({ label, accept, multiple = false, onFileUpload }: UploadProps) {
  return (
    <label
      tabIndex={0}
      className={cx(`
      w-full rounded-lg px-6 py-2 text-sm font-medium leading-5
      border-2 border-dashed border-sky-500
      bg-sky-200 text-white hover:bg-sky-300
      ring-sky-300 focus:outline-none focus:ring-2
      transition duration-150 ease-in-out
      flex flex-row gap-2 items-center justify-center
      cursor-pointer
    `)}>
      {label}
      <input type='file' multiple={multiple} accept={accept} hidden onChange={(e) => {
        onFileUpload(e.target.files)
      }} />
    </label>
  )
}
