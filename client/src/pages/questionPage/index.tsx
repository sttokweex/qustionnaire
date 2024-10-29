import React from 'react';
import { useParams } from 'react-router-dom';
import { useSubmitSurveyMutation } from '@/shared/http';
import NextButton from './components/nextButton';
import Question from './components/question';
import { useSurvey } from './hooks/useSurvey';
import { QuestionPageProps } from './interfaces';

const QuestionPage: React.FC<QuestionPageProps> = ({ userData }) => {
  const { surveyTitle } = useParams<{ surveyTitle: string }>();

  if (!surveyTitle) {
    return <div>no tittle</div>;
  }
  const {
    isLoading,
    error,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    setUserAnswers,
    userAnswers,
    selectedOptions,
    setSelectedOptions,
    openAnswer,
    setOpenAnswer,
    surveyCompleted,
    setSurveyCompleted,
    questions,
    answers,
  } = useSurvey(surveyTitle);

  const submitSurveyMutation = useSubmitSurveyMutation();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading questions: {error.message}</div>;

  if (!questions.length) return <div>No questions available.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionChange = (option: string) => {
    currentQuestion.answerType === 'multiple'
      ? setSelectedOptions((prev) =>
          prev.includes(option)
            ? prev.filter((o) => o !== option)
            : [...prev, option],
        )
      : setSelectedOptions([option]);
  };

  const handleNextQuestion = () => {
    const answerKey = currentQuestion.id;
    const answerValue =
      currentQuestion.answerType === 'open'
        ? openAnswer || ''
        : selectedOptions.length > 0
          ? selectedOptions
          : null;

    setUserAnswers((prev) => ({ ...prev, [answerKey]: answerValue }));

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setSurveyCompleted(true);
    }
  };

  // Формирование структуры данных для передачи на сервер
  const results = surveyCompleted
    ? questions.map((question) => {
        const userAnswer = userAnswers[question.id];

        return {
          questionId: question.id,
          userAnswer: userAnswer !== undefined ? userAnswer : null,
        };
      })
    : null;

  // Функция для отправки результатов на сервер
  const sendResults = async () => {
    if (results) {
      try {
        await submitSurveyMutation.mutateAsync({
          endedSurvey: {
            surveyTitle: surveyTitle,
            userId: userData.id,
          },
          answerStats: results.map((result) => ({
            questionId: result.questionId,
            answerText: Array.isArray(result.userAnswer)
              ? result.userAnswer.join(', ')
              : result.userAnswer || '',
          })),
        });

        console.log('Response from server:', submitSurveyMutation.data); // Отладочная информация
      } catch (error) {
        console.error('Error sending survey results:', error);
      }
    }
  };

  return (
    <div>
      {!surveyCompleted ? (
        <>
          <Question
            question={currentQuestion}
            answers={answers}
            selectedOptions={selectedOptions}
            onOptionChange={handleOptionChange}
            openAnswer={openAnswer}
            setOpenAnswer={setOpenAnswer}
          />
          <NextButton
            onClick={handleNextQuestion}
            isDisabled={
              currentQuestion.answerType === 'open'
                ? openAnswer.length === 0
                : selectedOptions.length === 0
            }
          />
          <div>
            <h3>Номера вопросов:</h3>
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                style={{
                  margin: '0 5px',
                  fontWeight:
                    currentQuestionIndex === index ? 'bold' : 'normal',
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <h2>Результаты опроса в формате JSON:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
          <button onClick={sendResults}>Отправить результаты</button>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
