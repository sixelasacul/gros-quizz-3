import * as React from 'react'
import cx from 'classnames'
import { Menu, Transition } from '@headlessui/react'
import { ArrowsExpandIcon, DotsVerticalIcon, PencilIcon, RefreshIcon, StatusOnlineIcon, XIcon } from '@heroicons/react/outline'
import { IconButton } from './IconButton'
import { usePresenterMode } from '../contexts/PresenterMode'

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

function Option({Icon, label, onClick}: OptionProps) {
  return (
    <Menu.Item>
      {({active}) => (
        <button
          className={cx(`
            p-1 flex flex-row items-center gap-2 w-full rounded
            transition duration-100 ease-in-out
          `, {
            'bg-emerald-500 text-white': active
          })}
          onClick={onClick}
        >
          <Icon className='h-6 w-6' /> {label}
        </button>
      )}
    </Menu.Item>
  )
}

export function Options() {
  const { isPresenterModeOn, togglePresenterMode } = usePresenterMode()
  const { isFullscreen, toggleFullscreen } = useFullscreen()

  return (
    <div className='absolute top-0 right-0 m-2'>
      <Menu>
        <Menu.Button as={IconButton} icon={<DotsVerticalIcon className='h-6 w-6' />} />
        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-1">
            <Option
              Icon={isPresenterModeOn ? PencilIcon : StatusOnlineIcon}
              label={isPresenterModeOn ? 'Passer à la vue présentateur' : 'Passer à la vue spectateur'}
              onClick={togglePresenterMode}
            />
            <Option
              Icon={isFullscreen ? XIcon : ArrowsExpandIcon}
              label={isFullscreen ? 'Quitter le mode plein écran' : 'Passer en mode plein écran'}
              onClick={toggleFullscreen}
            />
            {!isPresenterModeOn && (
              <Option
                Icon={RefreshIcon}
                label="Réinitialiser l'application"
                onClick={() => localStorage.clear()}
              />
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
