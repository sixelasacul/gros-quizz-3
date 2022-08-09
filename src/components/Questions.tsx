import * as React from 'react'
import cx from 'classnames'
import { useLocalstorageState } from 'rooks'
import { Dialog, Transition } from '@headlessui/react'
import { PlayIcon, PauseIcon, ArrowCircleLeftIcon, ArrowCircleRightIcon } from '@heroicons/react/solid'
import { Theme } from '../types/Question'
import { usePresenterMode } from '../contexts/PresenterMode'
import { IconButton } from './Actions'

interface QuestionsDisplayProps {
  theme: Theme
  title?: React.ReactNode
}
interface QuestionsProps {
  theme: Theme | null
  onClose(): void
}
interface TimerDisplayProps {
  // In millisecons
  maxTime: number
  // In millisecons
  currentTime: number
}

function TimerDisplay({ maxTime, currentTime }: TimerDisplayProps) {
  const timerWidth = 100 * currentTime / maxTime
  return (
    <div className={cx('h-6 w-full rounded flex flex-row items-center bg-slate-200', {
      'border-2 border-rose-500': currentTime <= 0
    })}>
      <div className={cx('h-full w-full rounded bg-emerald-500', {
        'bg-amber-500': currentTime < maxTime * 0.5,
        'bg-rose-500': currentTime < maxTime * 0.25
      })} style={{
        width: `${timerWidth}%`
      }}></div>
      <div className='flex flex-row justify-start' style={{ width: `${100 - timerWidth}%` }}>
        <p className='overflow-hidden m-2'>{Math.ceil(currentTime / 1000)}</p>
      </div>
    </div>
  )
}

// Can be attributed to each theme if needed
const DEFAULT_TIMER = 30 * 1000 // 30s
const INTERVAL = 10

function QuestionsDisplay({ theme, title = <h2 className='text-2xl leading-tight'>{theme.name}</h2> }: QuestionsDisplayProps) {
  // const [isRunning, setIsRunning] = React.useState(false)
  const [isRunning, setIsRunning] = useLocalstorageState('isRunning', false)
  const [questionIndex, setQuestionIndex] = useLocalstorageState('questionIndex', -1)
  const [remainingTime, setRemainingTime] = React.useState(DEFAULT_TIMER)
  const { isPresenterModeOn } = usePresenterMode()
  const currentQuestion = questionIndex >= 0 ? theme.questions[questionIndex] : null

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        setRemainingTime(prev => {
          if (prev >= INTERVAL) {
            return prev - INTERVAL
          }
          return prev
        })
      }
    }, INTERVAL)
    return () => clearInterval(interval)
  }, [isRunning])

  React.useEffect(() => {
    if (remainingTime <= 0) {
      setIsRunning(false)
    }
  }, [remainingTime])

  React.useEffect(() => {
    return () => {
      // Manually resetting them to the default value rather than using the reset
      // from `useLocalstorage`, which brings them back to `null` and causes
      // some issues across tabs.
      setIsRunning(false)
      setQuestionIndex(-1)
    }
  }, [])

  function startQuestions() {
    // Apparently, using the dispatch function in the `setState` from
    // `useLocalstorageState` doesn't work properly. Below is recommended from
    // their examples: https://github.com/imbhargav5/rooks/blob/main/data/docs/useLocalstorageState.md#examples
    // Reproduced here, and should open an issue/a PR to fix it: https://codesandbox.io/s/rook-use-local-storage-state-qszlgb
    // (Or create my own library from spa-dev-tools).
    // setIsRunning(prev => !prev)
    setIsRunning(!isRunning)
    if (questionIndex < 0) {
      setQuestionIndex(0)
    }
  }

  function showNextQuestion() {
    if (questionIndex + 1 < theme.questions.length) {
      // setQuestionIndex(i => i + 1)
      setQuestionIndex(questionIndex + 1)
    }
  }

  function showPreviousQuestion() {
    if (questionIndex > 0) {
      // setQuestionIndex(i => i - 1)
      setQuestionIndex(questionIndex - 1)
    }
  }

  // useEvent('keydown', ({key}: KeyboardEvent) => {
  //   switch(key) {
  //     case ' ':
  //       startQuestions()
  //       break
  //     case 'ArrowLeft':
  //       showPreviousQuestion()
  //       break
  //     case 'ArrowRight':
  //       showNextQuestion()
  //       break
  //     default:
  //       break
  //   }
  // })

  return (
    <div className='grid grid-cols-1 gap-8 m-4 text-center'>
      <TimerDisplay maxTime={DEFAULT_TIMER} currentTime={remainingTime} />
      {title}
      {currentQuestion && (<p className='text-4xl'>{currentQuestion.question}</p>)}
      {currentQuestion && !isPresenterModeOn && (
        <p className='text-2xl'>{currentQuestion.answer}</p>
      )}
      {!currentQuestion && isPresenterModeOn && (
        <p className='text-4xl'>Prêt ?</p>
      )}
      {!isPresenterModeOn && (
        <div className='flex flex-row gap-8 justify-center'>
          <IconButton
            onClick={startQuestions}
            icon={
              isRunning
                ? <PauseIcon className='h-8 w-8' />
                : <PlayIcon className='h-8 w-8' />
            }
          />
          <IconButton
            onClick={showPreviousQuestion}
            icon={<ArrowCircleLeftIcon className='h-8 w-8' />}
            disabled={!isRunning || questionIndex <= 0}
            />
          <IconButton
            onClick={showNextQuestion}
            icon={<ArrowCircleRightIcon className='h-8 w-8' />}
            disabled={!isRunning || questionIndex + 1 >= theme.questions.length}
          />
        </div>
      )}
    </div>
  )
}

// Animations from https://headlessui.com/react/dialog
export function Questions({ theme, onClose }: QuestionsProps) {
  return (
    <Transition appear show={!!theme} as={React.Fragment}>
    <Dialog onClose={onClose} className='relative'>
      <Transition.Child
        as={React.Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      </Transition.Child>
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className='w-full max-w-4xl rounded bg-white drop-shadow-2xl'>
            {!!theme && (
              <QuestionsDisplay
                theme={theme}
                title={<Dialog.Title className='text-xl'>{theme.name}</Dialog.Title>}
              />
            )}
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
  )
}