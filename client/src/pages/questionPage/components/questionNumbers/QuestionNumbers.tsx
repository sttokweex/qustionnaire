// components/QuestionNumbers.tsx
import React from 'react';
import './styles.css'; // Импорт стилей
import { QuestionNumbersProps } from './interfaces';

const QuestionNumbers: React.FC<QuestionNumbersProps> = ({
  questions,
  currentQuestionIndex,
  onClick,
}) => {
  return (
    <div className="numbers">
      <h3>Номера вопросов:</h3>
      {questions.map((_, index) => (
        <button
          key={index}
          onClick={() => onClick(index)}
          className={currentQuestionIndex === index ? 'active' : ''}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default QuestionNumbers;
