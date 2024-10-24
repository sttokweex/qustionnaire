// QuestionPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import NextButton from './components/nextButton';
import Question from './components/question';
import Results from './components/results';
import { useSurvey } from './hooks/useSurvey';

const QuestionPage: React.FC = () => {
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

  if (!surveyTitle) return <div>Title is required to fetch questions.</div>;
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
        : selectedOptions;

    setUserAnswers((prev) => ({ ...prev, [answerKey]: answerValue }));

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setSurveyCompleted(true);
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
        </>
      ) : (
        <Results
          questions={questions}
          userAnswers={userAnswers}
          answers={answers}
        />
      )}
      <div>
        <h3>Номера вопросов:</h3>
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
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
