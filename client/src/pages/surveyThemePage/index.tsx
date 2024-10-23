import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAddSurveyMutation, useSurveysByTheme } from '@/shared/http';
import SurveyForm from './components/surveyForm';
import SurveyList from './components/surveyList';
import { SurveyThemePageProps } from './interfaces';

const SurveyThemePage: React.FC<SurveyThemePageProps> = ({ userData }) => {
  const addSurveyMutation = useAddSurveyMutation();
  const { title } = useParams<{ title: string }>();

  // Проверяем наличие заголовка
  if (!title) {
    return <div>Error: Title is missing from the URL.</div>;
  }

  const {
    data: surveys = [], // Устанавливаем значение по умолчанию
    isLoading,
    refetch: refetchThemes,
  } = useSurveysByTheme(title);

  useEffect(() => {
    refetchThemes();
  }, [title, refetchThemes]); // Добавляем title и refetchThemes в зависимости

  const onSubmit = async (data: any) => {
    const isPrivate = data.flag === 'private';
    const formData = {
      survey: {
        title: data.title,
        questions: data.questions.map((question: any) => ({
          questionText: question.questionText,
          answerOptions: question.answerOptions
            .split(',')
            .map((option: string) => option.trim()),
          answerType: question.answerType,
        })),
      },
      themeTitle: title,
      flag: isPrivate,
    };
    await addSurveyMutation.mutateAsync(formData);
    refetchThemes(); // Обновляем списки после добавления
  };

  return (
    <div>
      <h1>Surveys for Theme: {title}</h1>
      {isLoading && <div>Loading surveys...</div>}

      {userData.role === 'admin' && (
        <div>
          <h2>Add New Survey</h2>
          <SurveyForm onSubmit={onSubmit} />
        </div>
      )}

      <SurveyList surveys={surveys} themeTitle={title} />
    </div>
  );
};

export default SurveyThemePage;
