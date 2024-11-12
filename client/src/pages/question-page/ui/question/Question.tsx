import React from 'react';
import { Answer, Question } from '@/shared/types/interfaces';

export interface QuestionProps {
  question: Question;
  answers: Answer[];
  singleSelectedOption: string | null;
  multipleSelectedOptions: string[];
  openAnswer: string;
  setOpenAnswer: (value: string) => void;
  onOptionChange: (option: string) => void;
}
const QuestionComponent: React.FC<QuestionProps> = ({
  question,
  answers,
  singleSelectedOption,
  multipleSelectedOptions,
  openAnswer,
  setOpenAnswer,
  onOptionChange,
}) => {
  return (
    <div className="question-container my-6 p-6 bg-white rounded-lg shadow-lg transition hover:shadow-xl min-h-[200px]">
      <h2 className="question-title text-2xl font-semibold mb-4 text-gray-900">
        {question.questionText}
      </h2>
      {question.answerType === 'open' ? (
        <textarea
          className="input-text w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none transition duration-200 ease-in-out"
          value={openAnswer}
          onChange={(e) => setOpenAnswer(e.target.value)}
          placeholder="Введите ваш ответ"
        />
      ) : (
        answers
          .filter((answer) => answer.questionId === question.id)
          .map((answer) => (
            <div
              key={answer.id}
              className="answer-option mb-2 flex items-center"
            >
              {question.answerType === 'multiple' ? (
                <input
                  type="checkbox"
                  value={answer.answerText}
                  checked={multipleSelectedOptions.includes(answer.answerText)}
                  onChange={() => onOptionChange(answer.answerText)}
                  className="mr-2 h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
              ) : (
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={answer.answerText}
                  checked={singleSelectedOption === answer.answerText}
                  onChange={() => onOptionChange(answer.answerText)}
                  className="mr-2 h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
              )}
              <span className="text-gray-800 text-lg">{answer.answerText}</span>
            </div>
          ))
      )}
    </div>
  );
};

export default QuestionComponent;
