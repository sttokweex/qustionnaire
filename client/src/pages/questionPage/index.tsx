import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetQuestions } from '@/shared/http';
import { Answer, Question } from './interfaces';

const QuestionPage: React.FC = () => {
  const { surveyTitle } = useParams<{ surveyTitle: string }>();

  if (!surveyTitle) {
    return <div>Title is required to fetch questions.</div>;
  }

  const { data, isLoading, error } = useGetQuestions(surveyTitle);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading questions: {error.message}</div>;

  const questions: Question[] = data?.questions || [];
  const answers: Answer[] = data?.answers || [];

  const handleOptionChange = (option: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.answerType === 'multiple') {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option],
      );
    } else {
      setSelectedOptions([option]);
    }
  };

  const handleNextQuestion = () => {
    setUserAnswers([...userAnswers, ...selectedOptions]);
    setSelectedOptions([]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <div>
      {currentQuestionIndex < questions.length ? (
        <div>
          <h2>{questions[currentQuestionIndex].questionText}</h2>
          {answers
            .filter(
              (answer) =>
                answer.questionId === questions[currentQuestionIndex].id,
            )
            .map((answer) => (
              <div key={answer.id}>
                <label>
                  {questions[currentQuestionIndex].answerType === 'multiple' ? (
                    <input
                      type="checkbox"
                      value={answer.answerText}
                      checked={selectedOptions.includes(answer.answerText)}
                      onChange={() => handleOptionChange(answer.answerText)}
                    />
                  ) : (
                    <input
                      type="radio"
                      name={`question-${questions[currentQuestionIndex].id}`}
                      value={answer.answerText}
                      checked={selectedOptions.includes(answer.answerText)}
                      onChange={() => handleOptionChange(answer.answerText)}
                    />
                  )}
                  {answer.answerText}
                </label>
              </div>
            ))}
          <button
            onClick={handleNextQuestion}
            disabled={selectedOptions.length === 0}
          >
            Далее
          </button>
        </div>
      ) : (
        <div>
          <pre>{JSON.stringify(userAnswers, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
