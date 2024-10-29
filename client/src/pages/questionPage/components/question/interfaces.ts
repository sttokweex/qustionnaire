import { Answer, Question } from '../../interfaces';

export interface QuestionProps {
  question: Question;
  answers: Answer[];
  selectedOptions: string[];
  openAnswer: string;
  setOpenAnswer: (value: string) => void;
  onOptionChange: (option: string) => void;
}
