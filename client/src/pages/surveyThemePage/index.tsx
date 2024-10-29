// SurveyThemePage.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAddSurveyMutation, useSurveysByTheme } from '@/shared/http';
import SurveyForm from './components/surveyForm/surveyForm';
import SurveyList from './components/surveyList/surveyList';
import { SurveyThemePageProps } from './interfaces';
import './styles.css';

const SurveyThemePage: React.FC<SurveyThemePageProps> = ({ userData }) => {
  const addSurveyMutation = useAddSurveyMutation();
  const { title } = useParams<{ title: string }>();

  if (!title) {
    return <div>Error: Title is missing from the URL.</div>;
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
    <div className="container">
      <h1 className="title">Surveys for Theme: {title}</h1>
      {isLoading && <div className="loading">Loading surveys...</div>}

      {userData.role === 'admin' && (
        <div className="add-survey-section">
          <h2 className="add-survey-title">Add New Survey</h2>
          <SurveyForm onSubmit={onSubmit} />
        </div>
      )}

      <SurveyList surveys={surveys} themeTitle={title} />
    </div>
  );
};

export default SurveyThemePage;
