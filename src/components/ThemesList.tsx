import * as React from 'react'
import { useLocalstorageState } from 'rooks'
import cx from 'classnames'
import { themes } from '../models/themes'
import { Theme } from '../types/Question'
import { Questions } from './Questions'

interface ThemeDisplayProps {
  theme: Theme
  disabled?: boolean
  onSelect(): void
}

interface ThemesListProps {
  onThemeSelected?(theme: Theme | null): void
}

function ThemeDisplay({ theme, disabled, onSelect }: ThemeDisplayProps) {
  const { name, imageUrl } = theme
  return (
    <div
      role='button'
      aria-disabled={disabled}
      tabIndex={0}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={(e) => {
        if (disabled) return
        if (['Enter', ' '].includes(e.key)) {
          onSelect()
          e.preventDefault()
        }
      }}
      className={cx(`
        rounded flex flex-col gap-1 items-center justify-around select-none
        drop-shadow-md bg-gray-50
        focus:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900
        transition-all duration-100 ease-in-out
      `, {
        'grayscale cursor-not-allowed': disabled,
        'hover:drop-shadow-lg hover:scale-110 hover:bg-gray-200': !disabled,
        'hover:scale-110 focus:scale-110': !disabled
      })}
    >
      <img src={imageUrl} draggable={false} />
      <p className='text-center font-semibold'>{name}</p>
      {/*
        Dropdown with following actions:
        - Reset theme
      */}
    </div>
  )
}

export function ThemesList({ onThemeSelected }: ThemesListProps) {
  const [selectedTheme, setSelectedTheme] = useLocalstorageState<Theme | null>('selectedTheme', null)
  // Should be using `Set`, but not properly serializable
  // Ideally, we should have the features from both `react-use` and `rooks`
  // regarding state synchronization in local storage.
  const [doneThemes, setDoneThemes] = useLocalstorageState<string[]>('doneThemes', [])
  // Will probably need another boolean to properly unset the theme after the
  // dialog has ended transition, not before

  function selectTheme(theme: Theme | null) {
    setSelectedTheme(theme)
    onThemeSelected?.(theme)
  }

  function doneTheme() {
    if (selectedTheme) {
      setDoneThemes(doneThemes.concat(selectedTheme.name))
    }
    selectTheme(null)
  }

  return (
    <>
      <ul className='grid grid-cols-1 gap-4 md:grid-cols-8'>
        {themes.map((theme) => (
          <li key={window.btoa(theme.name)}>
            <ThemeDisplay
              theme={theme}
              disabled={doneThemes.includes(theme.name)}
              onSelect={() => selectTheme(theme)}
            />
          </li>
        ))}
      </ul>
      <Questions theme={selectedTheme} onClose={doneTheme} />
    </>
  )
}