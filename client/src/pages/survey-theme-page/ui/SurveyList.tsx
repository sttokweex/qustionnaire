import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToggleSurveyVisibilityMutation } from '@/shared/http';
import { Survey } from '@/entity/survey';

export interface SurveyListProps {
  surveys: Survey[];
  themeTitle: string;
  isAdmin: boolean;
}

const SurveyList: React.FC<SurveyListProps> = ({
  surveys,
  themeTitle,
  isAdmin,
}) => {
  const { mutate: toggleSurveyVisibility } =
    useToggleSurveyVisibilityMutation();

  type VisibilityState = {
    [key: string]: boolean;
  };

  const [surveyVisibility, setSurveyVisibility] = useState<VisibilityState>({});
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    const initialVisibility = surveys.reduce((acc, survey) => {
      acc[survey.title] = !survey.hidden;
      return acc;
    }, {} as VisibilityState);
    setSurveyVisibility(initialVisibility);
  }, [surveys]);

  if (!Array.isArray(surveys) || surveys.length === 0) {
    return <div className="text-center text-gray-600">No surveys</div>;
  }

  const handleToggleVisibility = async (surveyTitle: string) => {
    const newVisibility = !surveyVisibility[surveyTitle];

    try {
      await toggleSurveyVisibility({ surveyTitle, themeTitle });
      setSurveyVisibility((prev) => ({
        ...prev,
        [surveyTitle]: newVisibility,
      }));
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const handleToggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <span className="mr-2 text-gray-700">Hide completed surveys</span>
          <span className="relative">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={handleToggleShowCompleted}
              className="absolute opacity-0"
            />
            <div
              className={`block w-16 h-8 rounded-full transition-all duration-300 ${
                showCompleted ? 'bg-gray-300' : 'bg-purple-600'
              }`}
            ></div>
            <div
              className={`dot absolute left-0 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                showCompleted ? 'translate-x-0' : 'translate-x-8'
              }`}
            ></div>
          </span>
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {surveys.map((survey) => {
          if (!showCompleted && survey.isCompleted) {
            return null;
          }

          return (
            <div
              key={survey.title}
              className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-8 shadow-lg transition-transform transform hover:scale-105 flex flex-col items-center relative"
            >
              <Link
                to={`/theme/${themeTitle}/${survey.title}`}
                className="flex flex-col items-center w-full mb-4 text-center cursor-pointer"
              >
                <span className="text-xl font-semibold">{survey.title}</span>
                {survey.isCompleted && (
                  <span className="text-gray-500 text-lg">(completed)</span>
                )}
              </Link>
              {isAdmin && (
                <div className="flex items-center">
                  <label className="inline-flex items-center mt-2">
                    <span className="relative">
                      <input
                        type="checkbox"
                        checked={surveyVisibility[survey.title] || false}
                        onChange={() => handleToggleVisibility(survey.title)}
                        className="absolute opacity-0 peer"
                      />
                      <div
                        className={`block w-12 h-6 rounded-full transition-all duration-300 ${
                          surveyVisibility[survey.title]
                            ? 'bg-purple-600'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`dot absolute left-0 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                            surveyVisibility[survey.title]
                              ? 'translate-x-6'
                              : ''
                          }`}
                        ></div>
                      </div>
                    </span>
                    <span className="ml-2 text-gray-700">
                      Visible for users
                    </span>
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SurveyList;
