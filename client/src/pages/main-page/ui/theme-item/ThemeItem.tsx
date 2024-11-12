// ThemeItem.tsx
import { Theme } from '@/shared/types/interfaces';
import React from 'react';
import { Link } from 'react-router-dom';

interface ThemeItemProps {
  theme: Theme;
  onDelete?: (id: string) => void;
}

const ThemeItem: React.FC<ThemeItemProps> = ({ theme, onDelete }) => {
  return (
    <Link
      key={theme.id}
      to={`/theme/${theme.title}`}
      className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-md transition-transform transform hover:scale-105 flex flex-col items-center justify-center h-52 cursor-pointer"
    >
      <div className="text-purple-700 transition duration-300 font-semibold text-lg text-center">
        {theme.title}
      </div>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(theme.id);
          }}
          className="mt-2 text-red-600 hover:text-red-500 transition duration-300"
        >
          Удалить
        </button>
      )}
    </Link>
  );
};

export default ThemeItem;
