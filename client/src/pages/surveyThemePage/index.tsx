import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
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
  console.log(surveys);
  const { register, handleSubmit, control, watch } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  useEffect(() => {
    refetchThemes();
  }, []);
  const answerTypes = watch('questions');
  const onSubmit = async (data: any) => {
    const isPrivate = data.flag === 'private';
    const formData = {
      survey: {
        title: data.title,
        questions: data.questions.map((question: any) => ({
          questionText: question.questionText,
          answerOptions: question.answerOptions
            ? question.answerOptions
                .split(',')
                .map((option: string) => option.trim())
            : [],
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
    <div>
      <h1>Surveys for Theme: {title}</h1>

      {isLoading && <div>Loading surveys...</div>}
      {userData.role === 'admin' && (
        <div>
          <h2>Add New Survey</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('title')} placeholder="Survey Title" required />

            <label>
              <input
                type="radio"
                {...register('flag')}
                value="private"
                required
              />
              Приватный
            </label>

            <label>
              <input type="radio" {...register('flag')} value="public" />
              Публичный
            </label>

            <h3>Вопросы</h3>
            {fields.map((item, index) => (
              <div key={item.id}>
                <input
                  {...register(`questions.${index}.questionText`)}
                  placeholder="Текст вопроса"
                  required
                />

                <select {...register(`questions.${index}.answerType`)}>
                  <option value="single">Один выбор</option>
                  <option value="multiple">Несколько выборов</option>
                  <option value="open">Открытый вопрос</option>
                </select>

                {['single', 'multiple'].includes(
                  answerTypes[index]?.answerType,
                ) && (
                  <input
                    {...register(`questions.${index}.answerOptions`)}
                    placeholder="Варианты ответов (через запятую)"
                    required
                  />
                )}

                <button type="button" onClick={() => remove(index)}>
                  Удалить вопрос
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                append({
                  questionText: '',
                  answerOptions: '',
                  answerType: 'single',
                })
              }
            >
              Добавить вопрос
            </button>

            <button type="submit">Добавить опрос</button>
          </form>
        </div>
      )}
      {surveys && surveys.length > 0 ? (
        <ul>
          {surveys.map((survey: Survey, index: number) => (
            <li key={index}>
              {survey.isCompleted ? (
                <span>{survey.title} (Завершен)</span>
              ) : (
                <Link to={`/theme/${title}/${survey.title}`}>
                  {survey.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        error && <div>Нет опросов для этой темы.</div>
      )}
    </div>
  );
};

export default SurveyThemePage;
