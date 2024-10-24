import { useEffect, useState } from 'react';
import { useGetQuestions } from '@/shared/http';
import { Answer, Question } from '../interfaces';

export const useSurvey = (surveyTitle: string) => {
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
  }, [data, currentQuestionIndex]);

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

  return {
    data,
    isLoading,
    error,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userAnswers,
    setUserAnswers,
    selectedOptions,
    setSelectedOptions,
    openAnswer,
    setOpenAnswer,
    surveyCompleted,
    setSurveyCompleted,
    questions,
    answers,
  };
};
