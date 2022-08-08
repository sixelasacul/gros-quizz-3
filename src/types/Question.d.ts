export interface Question {
  question: string
  answer: string
  // Difficulty? Order?
}

export interface Theme {
  name: string
  imageUrl: string
  questions: Question[]
}