// components/QuestionComponent.tsx
import React from 'react';
import { QuestionProps } from './interfaces';
import './styles.css';

const QuestionComponent: React.FC<QuestionProps> = ({
  question,
  answers,
  selectedOptions,
  openAnswer,
  setOpenAnswer,
  onOptionChange,
}) => {
  return (
    <div className="question-container">
      <h2 className="question-title">{question.questionText}</h2>
      {question.answerType === 'open' ? (
        <input
          type="text"
          className="input-text"
          value={openAnswer}
          onChange={(e) => setOpenAnswer(e.target.value)}
          placeholder="Введите ваш ответ"
        />
      ) : (
        answers
          .filter((answer) => answer.questionId === question.id)
          .map((answer) => (
            <div key={answer.id} className="answer-option">
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
