// Results.tsx
import React from 'react';
import { Answer, Question } from '../interfaces';

interface ResultsProps {
  questions: Question[];
  userAnswers: { [key: string]: string | string[] };
  answers: Answer[];
}

const Results: React.FC<ResultsProps> = ({
  questions,
  userAnswers,
  answers,
}) => {
  return (
    <div>
      <h2>Ваши ответы:</h2>
      {questions.map((question) => (
        <div key={question.id}>
          <h3 style={{ fontWeight: 'bold' }}>{question.questionText}</h3>
          {question.answerType === 'open' ? (
            <p>{userAnswers[question.id] || 'Нет ответа'}</p>
          ) : (
            answers
              .filter((answer) => answer.questionId === question.id)
              .map((answer) => (
                <p key={answer.id}>
                  {answer.answerText}:
                  {Array.isArray(userAnswers[question.id]) &&
                  userAnswers[question.id].includes(answer.answerText)
                    ? ' Вы выбрали'
                    : ' Не выбрано'}
                </p>
              ))
          )}
        </div>
      ))}
    </div>
  );
};

export default Results;
