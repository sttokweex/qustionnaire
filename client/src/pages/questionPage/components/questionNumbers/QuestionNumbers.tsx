// components/QuestionNumbers.tsx
import React from 'react';
import { QuestionNumbersProps } from './interfaces';

const QuestionNumbers: React.FC<QuestionNumbersProps> = ({
  questions,
  currentQuestionIndex,
  onClick,
}) => {
  return (
    <div className="my-4 flex justify-center">
      <div className="flex space-x-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => onClick(index)}
            className={`px-3 py-1 rounded-lg focus:outline-none transition duration-300 ${
              currentQuestionIndex === index
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionNumbers;
