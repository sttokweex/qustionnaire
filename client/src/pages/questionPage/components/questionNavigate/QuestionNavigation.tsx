import React from 'react';
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
    <div className="flex flex-col items-center my-4">
      <div className="flex justify-between w-full">
        <button
          onClick={onPrev}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 ${currentQuestionIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'} font-semibold rounded-lg transition duration-300`}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={currentQuestionIndex >= totalQuestions - 1}
          className={`px-4 py-2 ${currentQuestionIndex >= totalQuestions - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'} font-semibold rounded-lg transition duration-300`}
        >
          Next
        </button>
      </div>

      <button
        onClick={onComplete}
        disabled={!isAllAnswered}
        className={`mt-4 px-4 py-2 font-semibold rounded-lg transition duration-300 ${
          isAllAnswered
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
        }`}
      >
        Complete Survey
      </button>
    </div>
  );
};

export default QuestionNavigation;
