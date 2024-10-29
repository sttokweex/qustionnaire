// SurveyList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Survey } from '../../interfaces';
import './styles.css';

const SurveyList: React.FC<{ surveys: Survey[]; themeTitle: string }> = ({
  surveys,
  themeTitle,
}) => {
  if (!Array.isArray(surveys) || surveys.length === 0) {
    return <div className="empty-message">Нет опросов для этой темы.</div>;
  }

  return (
    <ul className="list">
      {surveys.map((survey, index) => (
        <li key={index} className="list-item">
          {survey.isCompleted ? (
            <span className="completed">{survey.title} (Завершен)</span>
          ) : (
            <Link to={`/theme/${themeTitle}/${survey.title}`} className="link">
              {survey.title}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SurveyList;
