import * as React from 'react'
import { PresenterModeProvider } from '../contexts/PresenterMode'
import { App } from './App'

export function AppSetup() {
  return (
    <PresenterModeProvider>
      <App />
    </PresenterModeProvider>
  )
}