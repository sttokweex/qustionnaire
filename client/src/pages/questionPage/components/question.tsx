// Question.tsx
import React from 'react';
import { Answer, Question } from '../interfaces';

interface QuestionProps {
  question: Question;
  answers: Answer[];
  selectedOptions: string[];
  openAnswer: string;
  setOpenAnswer: (value: string) => void;
  onOptionChange: (option: string) => void;
}

const QuestionComponent: React.FC<QuestionProps> = ({
  question,
  answers,
  selectedOptions,
  openAnswer,
  setOpenAnswer,
  onOptionChange,
}) => {
  return (
    <div>
      <h2>{question.questionText}</h2>
      {question.answerType === 'open' ? (
        <input
          type="text"
          value={openAnswer}
          onChange={(e) => setOpenAnswer(e.target.value)}
          placeholder="Введите ваш ответ"
        />
      ) : (
        answers
          .filter((answer) => answer.questionId === question.id)
          .map((answer) => (
            <div key={answer.id}>
              <label>
                {question.answerType === 'multiple' ? (
                  <input
                    type="checkbox"
                    value={answer.answerText}
                    checked={selectedOptions.includes(answer.answerText)}
                    onChange={() => onOptionChange(answer.answerText)}
                  />
                ) : (
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={answer.answerText}
                    checked={selectedOptions.includes(answer.answerText)}
                    onChange={() => onOptionChange(answer.answerText)}
                  />
                )}
                {answer.answerText}
              </label>
            </div>
          ))
      )}
    </div>
  );
};

export default QuestionComponent;
