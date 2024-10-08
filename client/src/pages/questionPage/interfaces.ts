export interface Question {
  id: number;
  questionText: string;
  answerOptions: string[];
  answerType: string;
}

export interface Answer {
  id: number;
  questionId: number;
  answerText: string;
}
