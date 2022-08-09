import * as React from 'react'
import { RefreshIcon } from '@heroicons/react/outline'
import { usePresenterMode } from '../contexts/PresenterMode'
import { Button, Toggle } from './Actions'

interface OptionProps {
  label: string
  Icon: React.ElementType<{className?: string}>
  onClick(): void
}

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  async function toggleFullscreen() {
    if(isFullscreen) {
      await document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      await document.body.requestFullscreen()
      setIsFullscreen(true)
    }
  }

  React.useEffect(() => {
    function listener() {
      // This event is triggered once the full screen change is effective. Thus,
      // we just need to check that there's no more element in full screen mode
      // to synchronize back the state (when it wasn't done via the button).
      if(!document.fullscreenElement) {
        setIsFullscreen(false)
      }
    }
    document.body.addEventListener('fullscreenchange', listener)
    return () => document.body.removeEventListener('fullscreenchange', listener)
  }, [])

  return { isFullscreen, toggleFullscreen }
}

export function Options() {
  const { isPresenterModeOn, togglePresenterMode } = usePresenterMode()
  const { isFullscreen, toggleFullscreen } = useFullscreen()

  return (
    <div className='rounded shadow-lg bg-white p-4 flex flex-col gap-4'>
      <Toggle
        label={isPresenterModeOn ? 'Passer à la vue présentateur' : 'Passer à la vue spectateur'}
        onToggle={togglePresenterMode}
      />
      <Toggle
        label={isFullscreen ? 'Quitter le mode plein écran' : 'Passer en mode plein écran'}
        onToggle={toggleFullscreen}
      />
      <Button
        onClick={() => localStorage.clear()}
        icon={<RefreshIcon className='h-6 w-6' />}
      >
        Réinitialiser l'application
      </Button>
    </div>
  )
}
