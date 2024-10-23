import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetQuestions } from '@/shared/http';
import { Answer, Question } from './interfaces';

const QuestionPage: React.FC = () => {
  const { surveyTitle } = useParams<{ surveyTitle: string }>();

  if (!surveyTitle) {
    return <div>Title is required to fetch questions.</div>;
  }

  const { data, isLoading, error } = useGetQuestions(surveyTitle);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const savedIndex = localStorage.getItem(
      `${surveyTitle}_currentQuestionIndex`,
    );
    return savedIndex ? Number(savedIndex) : 0;
  });

  const [userAnswers, setUserAnswers] = useState<{
    [key: string]: string | string[];
  }>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [openAnswer, setOpenAnswer] = useState<string>('');
  const [surveyCompleted, setSurveyCompleted] = useState<boolean>(false);

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`userAnswers`);
    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers);
      setUserAnswers(parsedAnswers);

      const currentQuestionId = data?.questions[currentQuestionIndex]?.id;
      if (currentQuestionId) {
        const previousAnswer = parsedAnswers[currentQuestionId];
        if (Array.isArray(previousAnswer)) {
          setSelectedOptions(previousAnswer);
        } else {
          setOpenAnswer(previousAnswer || '');
        }
      }
    }
  }, [data, currentQuestionIndex, surveyTitle]);

  useEffect(() => {
    localStorage.setItem(`userAnswers`, JSON.stringify(userAnswers));
    localStorage.setItem(
      `${surveyTitle}_currentQuestionIndex`,
      currentQuestionIndex.toString(),
    );
  }, [userAnswers, currentQuestionIndex, surveyTitle]);

  useEffect(() => {
    if (data && currentQuestionIndex < data?.questions.length) {
      const currentQuestion = data.questions[currentQuestionIndex];
      const answerKey = currentQuestion.id;

      if (currentQuestion.answerType === 'open') {
        setUserAnswers((prev) => ({ ...prev, [answerKey]: openAnswer }));
      } else {
        setUserAnswers((prev) => ({ ...prev, [answerKey]: selectedOptions }));
      }
    }
  }, [openAnswer, selectedOptions, currentQuestionIndex, data]);

  const questions: Question[] = data?.questions || [];
  const answers: Answer[] = data?.answers || [];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading questions: {error.message}</div>;

  if (!questions.length) {
    return <div>No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return <div>There was an error retrieving the current question.</div>;
  }

  const handleOptionChange = (option: string) => {
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

  const handleOpenAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOpenAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    const answerKey = currentQuestion.id;

    if (currentQuestion.answerType === 'open') {
      setUserAnswers((prev) => ({ ...prev, [answerKey]: openAnswer || '' }));
    } else {
      setUserAnswers((prev) => ({ ...prev, [answerKey]: selectedOptions }));
    }

    const newIndex = currentQuestionIndex + 1;
    if (newIndex < questions.length) {
      setCurrentQuestionIndex(newIndex);
    } else {
      setSurveyCompleted(true);
    }
  };

  const handleQuestionSelect = (index: number) => {
    const answerKey = currentQuestion.id;

    if (currentQuestion.answerType === 'open') {
      setUserAnswers((prev) => ({ ...prev, [answerKey]: openAnswer || '' }));
    } else {
      setUserAnswers((prev) => ({ ...prev, [answerKey]: selectedOptions }));
    }

    setCurrentQuestionIndex(index);

    const newQuestion = questions[index];
    const previousAnswer = userAnswers[newQuestion.id];

    if (newQuestion.answerType === 'open') {
      setOpenAnswer(typeof previousAnswer === 'string' ? previousAnswer : '');
      setSelectedOptions([]);
    } else {
      setOpenAnswer('');
      setSelectedOptions(Array.isArray(previousAnswer) ? previousAnswer : []);
    }
  };

  const renderResults = () => {
    return (
      <div>
        <h2>Ваши ответы:</h2>
        {questions.map((question, index) => (
          <div key={index}>
            <h3 style={{ fontWeight: 'bold' }}>{question.questionText}</h3>
            {question.answerType === 'open' ? (
              <p>{userAnswers[question.id] || 'Нет ответа'}</p>
            ) : (
              answers
                .filter((answer) => answer.questionId === question.id)
                .map((answer) => {
                  const isChecked =
                    Array.isArray(userAnswers[question.id]) &&
                    userAnswers[question.id].includes(answer.answerText);
                  return (
                    <p key={answer.id}>
                      {answer.answerText}:{' '}
                      {isChecked ? 'Вы выбрали' : 'Не выбрано'}
                    </p>
                  );
                })
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {!surveyCompleted ? (
        <>
          <h2>{currentQuestion.questionText}</h2>
          {currentQuestion.answerType === 'open' ? (
            <input
              type="text"
              id={`open-answer-${currentQuestionIndex}`} // Уникальный id
              name={`open-answer-${currentQuestionIndex}`} // Уникальное имя
              value={openAnswer}
              onChange={handleOpenAnswerChange}
              placeholder="Введите ваш ответ"
            />
          ) : (
            answers
              .filter((answer) => answer.questionId === currentQuestion.id)
              .map((answer) => (
                <div key={answer.id}>
                  <label>
                    {currentQuestion.answerType === 'multiple' ? (
                      <input
                        type="checkbox"
                        id={`answer-${answer.id}`} // Уникальный id для чекбокса
                        name={`answer-${answer.id}`} // Уникальное имя для чекбокса
                        value={answer.answerText}
                        checked={selectedOptions.includes(answer.answerText)}
                        onChange={() => handleOptionChange(answer.answerText)}
                      />
                    ) : (
                      <input
                        type="radio"
                        id={`answer-${answer.id}`} // Уникальный id для радио кнопки
                        name={`question-${currentQuestion.id}`} // Уникальное имя для выбора
                        value={answer.answerText}
                        checked={selectedOptions.includes(answer.answerText)}
                        onChange={() => handleOptionChange(answer.answerText)}
                      />
                    )}
                    {answer.answerText}
                  </label>
                </div>
              ))
          )}
          <button
            onClick={handleNextQuestion}
            disabled={
              currentQuestion.answerType === 'open'
                ? openAnswer.length === 0
                : selectedOptions.length === 0
            }
          >
            Далее
          </button>
        </>
      ) : (
        renderResults()
      )}

      <div>
        <h3>Номера вопросов:</h3>
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => handleQuestionSelect(index)}
            style={{
              margin: '0 5px',
              fontWeight: currentQuestionIndex === index ? 'bold' : 'normal',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionPage;
