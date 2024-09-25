import React from 'react';
import { useParams } from 'react-router-dom';
import { useSurveysByTheme } from '@/shared/http';
import { Survey } from './interfaces';

const QuestionarePage: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  if (!title) {
    return <div>Error: Title is missing from the URL.</div>;
  }

  const { data: surveys, error, isLoading } = useSurveysByTheme(title);

  if (isLoading) return <div>Loading surveys...</div>;
  if (error) return <div>Error fetching surveys: {error.message}</div>;

  return (
    <div>
      <h1>Surveys for Theme: {title}</h1>
      {surveys && surveys.length > 0 ? (
        <ul>
          {surveys.map((survey: Survey, index: number) => (
            <li key={index}>{survey.title}</li>
          ))}
        </ul>
      ) : (
        <div>No surveys found for this theme.</div>
      )}
    </div>
  );
};

export default QuestionarePage;
