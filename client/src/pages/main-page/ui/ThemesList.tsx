// ThemesList.tsx

import React from 'react';
import ThemeItem from './ThemeItem';
import { SurveyTheme } from '@/entity/surveyTheme';
interface ThemesListProps {
  themes: SurveyTheme[];
  onDelete?: (id: string) => void;
}
const ThemesList: React.FC<ThemesListProps> = ({ themes, onDelete }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 h-full">
      {themes.length === 0 ? (
        <p className="text-gray-600 text-center">Нет доступных тем.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <ThemeItem key={theme.id} theme={theme} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemesList;
