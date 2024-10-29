// components/QuestionPage.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/features/header/header'; // Импортируем Header
import { useSubmitSurveyMutation } from '@/shared/http';
import Question from './components/question/Question';
import QuestionNavigation from './components/questionNavigate/QuestionNavigation';
import QuestionNumbers from './components/questionNumbers/QuestionNumbers';
import SurveyResults from './components/surveyResult/SurveyResults';
import { useSurvey } from './hooks/useSurvey';
import { QuestionPageProps } from './interfaces';

const QuestionPage: React.FC<QuestionPageProps> = ({ userData, refetch }) => {
  const { surveyTitle } = useParams<{ surveyTitle: string }>();
  const navigate = useNavigate();

  if (!surveyTitle) {
    return <div>Ошибка: заголовок отсутствует.</div>;
  }

  const {
    isLoading,
    error,
    currentQuestionIndex,
    setCurrentQuestionIndex,
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

  if (isLoading) return <div>Загрузка...</div>;

  if (error) return <div>Ошибка при загрузке вопросов: {error.message}</div>;

  if (!questions.length) return <div>Нет доступных вопросов.</div>;

  const currentQuestion = questions[currentQuestionIndex];

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

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const results = surveyCompleted
    ? questions.map((question) => {
        const userAnswer = userAnswers[question.id];

        if (['single', 'multiple'].includes(question.answerType)) {
          const validAnswers = answers.map((answer) => answer.answerText);
          const filteredAnswer = Array.isArray(userAnswer)
            ? userAnswer.filter((answer) => validAnswers.includes(answer))
            : validAnswers.includes(userAnswer)
              ? userAnswer
              : null;

          return {
            questionId: question.id,
            userAnswer: filteredAnswer || null,
          };
        } else {
          return {
            questionId: question.id,
            userAnswer: userAnswers[question.id] || null,
          };
        }
      })
    : null;

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
        console.log('Ответ от сервера:', submitSurveyMutation.data);
      } catch (error) {
        console.error('Ошибка при отправке результатов опроса:', error);
      } finally {
        navigate(-1);
      }
    }
  };

  const isAllAnswered = questions.every(
    (q) =>
      userAnswers[q.id] !== undefined &&
      userAnswers[q.id] !== '' &&
      userAnswers[q.id].length !== 0,
  );

  return (
    <>
      <Header username={userData.username} onRefetch={refetch} />
      {/* Добавлена шапка */}
      <div className="max-w-xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-purple-800">
          Опрос: {surveyTitle}
        </h1>
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
            <QuestionNavigation
              currentQuestionIndex={currentQuestionIndex}
              onPrev={handlePrevQuestion}
              onNext={handleNextQuestion}
              totalQuestions={questions.length}
              onComplete={() => setSurveyCompleted(true)}
              isAllAnswered={isAllAnswered}
            />
            <QuestionNumbers
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              onClick={setCurrentQuestionIndex}
            />
            {/* Кнопка перемещена вниз */}
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-300"
            >
              К опросам
            </button>
          </>
        ) : (
          <SurveyResults
            results={results}
            onSend={sendResults}
            onBack={() => setSurveyCompleted(false)}
          />
        )}
      </div>
    </>
  );
};

export default QuestionPage;
