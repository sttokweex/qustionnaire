export interface QuestionNavigationProps {
  currentQuestionIndex: number;
  onPrev: () => void;
  onNext: () => void;
  totalQuestions: number;
  onComplete: () => void;
  isAllAnswered: boolean;
}
