import {faker} from '@faker-js/faker'
import {Theme, Question} from '../types/Question'

function random(min = 0, max = 1) {
  return Math.random() * (max - min) + min
}

export function generateQuestion(): Question {
  return {
    question: faker.lorem.sentence().replace('.', '?'),
    answer: faker.lorem.sentence()
  }
}

export function generateQuestions(length = 3) {
  return Array.from({length}).map(generateQuestion)
}

export function generateTheme(): Theme {
  return {
    name: faker.lorem.words(random(1, 3)),
    imageUrl: faker.image.abstract(160, 112, true),
    questions: generateQuestions()
  }
}

export function generateThemes(length = 10) {
  return Array.from({length}).map(generateTheme)
}
