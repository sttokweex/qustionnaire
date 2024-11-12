import { useEffect, useState } from 'react';
import { useGetQuestions } from '@/shared/http';
import { Answer, Question } from '@/shared/types/interfaces';

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

  const [singleSelectedOption, setSingleSelectedOption] = useState<
    string | null
  >(null);
  const [multipleSelectedOptions, setMultipleSelectedOptions] = useState<
    string[]
  >([]);
  const [openAnswer, setOpenAnswer] = useState<string>('');
  const [surveyCompleted, setSurveyCompleted] = useState<boolean>(false);

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`userAnswers`);

    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers);
      setUserAnswers(parsedAnswers);

      if (data?.questions && currentQuestionIndex < data.questions.length) {
        const currentQuestionId = data.questions[currentQuestionIndex]?.id;

        if (currentQuestionId) {
          const previousAnswer = parsedAnswers[currentQuestionId];

          if (Array.isArray(previousAnswer)) {
            setMultipleSelectedOptions(previousAnswer);
          } else {
            setOpenAnswer(previousAnswer || '');
            setSingleSelectedOption(previousAnswer || null);
          }
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
    if (data?.questions && currentQuestionIndex < data.questions.length) {
      const currentQuestion = data.questions[currentQuestionIndex];
      const answerKey = currentQuestion.id;

      if (currentQuestion.answerType === 'open') {
        setUserAnswers((prev) => ({ ...prev, [answerKey]: openAnswer }));
      } else if (currentQuestion.answerType === 'single') {
        setUserAnswers((prev) => ({
          ...prev,
          [answerKey]: singleSelectedOption,
        }));
      } else if (currentQuestion.answerType === 'multiple') {
        setUserAnswers((prev) => ({
          ...prev,
          [answerKey]: multipleSelectedOptions,
        }));
      }
    }
  }, [
    openAnswer,
    singleSelectedOption,
    multipleSelectedOptions,
    currentQuestionIndex,
    data,
  ]);

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
    singleSelectedOption,
    setSingleSelectedOption,
    multipleSelectedOptions,
    setMultipleSelectedOptions,
    openAnswer,
    setOpenAnswer,
    surveyCompleted,
    setSurveyCompleted,
    questions,
    answers,
  };
};
