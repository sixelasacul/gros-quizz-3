import * as React from 'react'
import { ThemesList } from './ThemesList'
import { Options } from './Options'

const TITLE = 'Le Gros Quizz'

export function App() {
  const [title, setTitle] = React.useState(TITLE)

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
    <div className='bg-white relative h-screen overflow-hidden'>
      <div className='absolute inset-0'>
        <div className='flex flex-col justify-between'>
          <h1
            className={`
              text-9xl text-center font-extrabold
              bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-emerald-500
            `}
          >
            {title}
          </h1>
        </div>
      </div>
      <div className='flex flex-col items-center gap-2 relative h-screen overflow-y-scroll px-4 pt-20'>
        <ThemesList onThemeSelected={(theme) => {
          if (theme) {
            setTitle(theme.name)
          } else {
            setTitle(TITLE)
          }
        }} />
      </div>
      <Options />
    </div>
  )
}
