import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useAddSurveyMutation, useSurveysByTheme } from '@/shared/http';
import { Survey, SurveyThemePageProps } from './interfaces';

const SurveyThemePage: React.FC<SurveyThemePageProps> = ({ userData }) => {
  const addSurveyMutation = useAddSurveyMutation();
  const { title } = useParams<{ title: string }>();
  if (!title) {
    return <div>Error: Title is missing from the URL.</div>;
  }

  const {
    data: surveys,
    error,
    isLoading,
    refetch: refetchThemes,
  } = useSurveysByTheme(title);

  const { register, handleSubmit } = useForm();
  useEffect(() => {
    refetchThemes();
  }, []);
  const onSubmit = async (data: any) => {
    const isPrivate = data.flag === 'private';
    const flag = isPrivate;
    const formData = { title: data.title, themeTitle: title, flag: flag };
    await addSurveyMutation.mutateAsync(formData);
    refetchThemes();
  };

  return (
    <div>
      <h1>Surveys for Theme: {title}</h1>

      {isLoading && <div>Loading surveys...</div>}
      {userData.role === 'admin' && (
        <div>
          <h2>Add New Survey</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('title')} placeholder="survey Title" required />

            <label>
              <input
                type="radio"
                {...register('flag')}
                value="option1"
                required
              />
              приватный
            </label>

            <label>
              <input type="radio" {...register('flag')} value="option2" />
              публичный
            </label>

            <button type="submit">Add survey</button>
          </form>
        </div>
      )}
      {surveys && surveys.length > 0 ? (
        <ul>
          {surveys.map((survey: Survey, index: number) => (
            <li key={index}>{survey.title}</li>
          ))}
        </ul>
      ) : (
        error && <div>No surveys found for this theme.</div>
      )}
    </div>
  );
};

export default SurveyThemePage;
