import * as React from 'react'

interface PresenterModeContextState {
  isPresenterModeOn: boolean
  togglePresenterMode(): void
}
interface Children {
  children: React.ReactNode
}

const PresenterModeContext = React.createContext<PresenterModeContextState>({
  isPresenterModeOn: false,
  togglePresenterMode() {}
})

export function PresenterModeProvider({ children }: Children) {
  const [isPresenterModeOn, setPresenterMode] = React.useState(false)
  function togglePresenterMode() {
    setPresenterMode(prev => !prev)
  }

  return (
    <PresenterModeContext.Provider value={{isPresenterModeOn, togglePresenterMode}}>
      {children}
    </PresenterModeContext.Provider>
  )
}

export function usePresenterMode() {
  return React.useContext(PresenterModeContext)
}
