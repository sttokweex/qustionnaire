import React from 'react';
import { Link } from 'react-router-dom';
import { Survey } from '../interfaces';

const SurveyList: React.FC<{ surveys: Survey[]; themeTitle: string }> = ({
  surveys,
  themeTitle,
}) => {
  if (!Array.isArray(surveys) || surveys.length === 0) {
    return <div>Нет опросов для этой темы.</div>;
  }

  return (
    <ul>
      {surveys.map((survey, index) => (
        <li key={index}>
          {survey.isCompleted ? (
            <span>{survey.title} (Завершен)</span>
          ) : (
            <Link to={`/theme/${themeTitle}/${survey.title}`}>
              {survey.title}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SurveyList;
