// QuestionPage.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSubmitSurveyMutation } from '@/shared/http';
import Question from './components/question/question';
import QuestionNavigation from './components/questionNavigate/QuestionNavigation';
import QuestionNumbers from './components/questionNumbers/QuestionNumbers';
import SurveyResults from './components/surveyResult/SurveyResults';
import { useSurvey } from './hooks/useSurvey';
import { QuestionPageProps } from './interfaces';

const QuestionPage: React.FC<QuestionPageProps> = ({ userData }) => {
  const { surveyTitle } = useParams<{ surveyTitle: string }>();
  const navigate = useNavigate();

  if (!surveyTitle) {
    return <div>No title</div>;
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

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading questions: {error.message}</div>;

  if (!questions.length) return <div>No questions available.</div>;

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
        console.log('Response from server:', submitSurveyMutation.data);
      } catch (error) {
        console.error('Error sending survey results:', error);
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
        </>
      ) : (
        <SurveyResults results={results} onSend={sendResults} />
      )}
    </div>
  );
};

export default QuestionPage;
