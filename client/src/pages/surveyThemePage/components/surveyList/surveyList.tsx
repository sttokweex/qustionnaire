import React from 'react';
import { Link } from 'react-router-dom';
import { Survey } from '../../interfaces';

const SurveyList: React.FC<{ surveys: Survey[]; themeTitle: string }> = ({
  surveys,
  themeTitle,
}) => {
  if (!Array.isArray(surveys) || surveys.length === 0) {
    return (
      <div className="text-center text-gray-600">
        Нет опросов для этой темы.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {surveys.map((survey, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105 flex flex-col items-center justify-center"
        >
          {survey.isCompleted ? (
            <span className="text-gray-500 text-lg text-center">
              {survey.title} (Завершен)
            </span>
          ) : (
            <Link
              to={`/theme/${themeTitle}/${survey.title}`}
              className="text-purple-700 hover:text-purple-600 transition duration-300 text-lg font-semibold text-center"
            >
              {survey.title}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default SurveyList;
