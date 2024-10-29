// components/QuestionNavigation.tsx
import React from 'react';
import './styles.css'; // Импорт стилей
import { QuestionNavigationProps } from './interfaces';

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  currentQuestionIndex,
  onPrev,
  onNext,
  totalQuestions,
  onComplete,
  isAllAnswered,
}) => {
  return (
    <div className="navigation">
      {currentQuestionIndex > 0 && <button onClick={onPrev}>Назад</button>}
      {currentQuestionIndex < totalQuestions - 1 && (
        <button onClick={onNext}>Далее</button>
      )}
      <button onClick={onComplete} disabled={!isAllAnswered}>
        Завершить опрос
      </button>
    </div>
  );
};

export default QuestionNavigation;
