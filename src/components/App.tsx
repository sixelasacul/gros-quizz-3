import * as React from 'react'
import cx from 'classnames'
import { Tab } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { firstThemes, secondThemes } from '../models/themes'
import { Theme } from '../types/Question'
import { ThemesList } from './ThemesList'
import { Options } from './Options'
import { IconButton } from './Actions'

interface Children {
  children: React.ReactNode
}

const TITLE = 'Le Gros Quizz'

function CustomTab({ children }: Children) {
  return (
    <Tab
      className={({ selected }) =>
        cx(`
          w-full rounded-lg px-6 py-2 text-sm font-medium leading-5
          ring-sky-300 focus:outline-none focus:ring-2
          transition duration-150 ease-in-out
        `, {
          'bg-sky-500 text-white shadow': selected,
          'text-sky-500 hover:bg-sky-500/20 hover:text-white': !selected
        })
      }
    >
      {children}
    </Tab>
  )
}

export function App() {
  const [title, setTitle] = React.useState(TITLE)
  const [areTabsVisible, setTabsVisibility] = React.useState(false)

  function onThemeSelected(theme: Theme | null) {
    if (theme) {
      setTitle(theme.name)
    } else {
      setTitle(TITLE)
    }
  }

  return (
    // In order to display elements above the others, we need the following
    // structure (order is important):
    // parent: relative
    // -> first child, background: absolute
    // -> second child, container: relative
    // --> content: nothing special
    // Having children with absolute and relative put them in a specific state
    // during rendering: Relative is displayed as it would be rendered normally
    // in the flow of the document, while absolute is positioned, but behind
    // the second child, thanks to the order in the DOM + relative.
    <div className='bg-white relative h-screen'>
      <div className='absolute inset-0'>
        <div className='flex flex-col justify-between'>
          <h1
            // variant: from-purple-500 to-rose-500
            className={`
              text-9xl text-center font-extrabold
              bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-emerald-500
            `}
          >
            {title}
          </h1>
        </div>
      </div>
      <div className='flex flex-col items-center gap-8 relative h-screen px-4 pt-20'>
        <Tab.Group>
          <Tab.Panels>
            <Tab.Panel>
              <ThemesList themes={firstThemes} onThemeSelected={onThemeSelected} />
            </Tab.Panel>
            <Tab.Panel>
              <ThemesList themes={secondThemes} onThemeSelected={onThemeSelected} />
            </Tab.Panel>
            <Tab.Panel>
              <Options />
            </Tab.Panel>
          </Tab.Panels>
          <div className='flex flex-col gap-1 items-center fixed bottom-0 m-4'>
            <div className='bg-white shadow-md rounded-full p-1 flex items-center'>
              <IconButton
                onClick={() => setTabsVisibility(prev => !prev)}
                className='enabled:hover:bg-sky-500/20 hover:text-white'
                icon={areTabsVisible ? (
                  <ChevronDownIcon className='h-6 w-6' />
                ) : (
                  <ChevronUpIcon className='h-6 w-6' />
                )}
              />
            </div>
            {areTabsVisible && (
              <Tab.List className='flex gap-1 rounded-xl bg-white p-1 shadow-md'>
                <CustomTab>Général</CustomTab>
                <CustomTab>Spécial</CustomTab>
                <CustomTab>Options</CustomTab>
              </Tab.List>
            )}
          </div>
        </Tab.Group>
      </div>
    </div>
  )
}
