import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/features/header/header';
import { useAddSurveyMutation, useSurveysByTheme } from '@/shared/http';
import SurveyForm from './components/surveyForm/surveyForm';
import SurveyList from './components/surveyList/surveyList';
import { SurveyThemePageProps } from './interfaces';

const SurveyThemePage: React.FC<SurveyThemePageProps> = ({
  userData,
  refetch,
}) => {
  const navigate = useNavigate();
  const addSurveyMutation = useAddSurveyMutation();
  const { title } = useParams<{ title: string }>();

  if (!title) {
    return <div>Ошибка: заголовок отсутствует в URL.</div>;
  }

  const {
    data: surveys = [],
    isLoading,
    refetch: refetchThemes,
  } = useSurveysByTheme(title);

  useEffect(() => {
    refetchThemes();
  }, [title, refetchThemes]);

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
    refetchThemes();
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      <Header username={userData.username} onRefetch={refetch} />
      <div className="p-4 ">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Назад к темам
        </button>
        <h1 className="text-3xl font-bold text-center mb-4 text-purple-800">
          Опросы для темы: {title}
        </h1>
      </div>
      {isLoading && (
        <div className="text-gray-600 text-center">Загрузка опросов...</div>
      )}
      {userData.role === 'admin' && (
        <div className="add-survey-section my-6 p-4 bg-white rounded-lg shadow md:my-8">
          <SurveyForm onSubmit={onSubmit} />
        </div>
      )}
      <SurveyList surveys={surveys} themeTitle={title} />
    </div>
  );
};

export default SurveyThemePage;
