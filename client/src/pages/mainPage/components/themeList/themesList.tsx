import React from 'react';
import { Link } from 'react-router-dom';

const ThemesList: React.FC<{
  themes: any[];
  onDelete?: (id: string) => void;
}> = ({ themes, onDelete }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 h-full">
      {themes.length === 0 ? (
        <p className="text-gray-600 text-center">Нет доступных тем.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <Link
              key={theme.id}
              to={`/theme/${theme.title}`}
              className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-md transition-transform transform hover:scale-105 flex flex-col items-center justify-center h-52 cursor-pointer" // Добавлен класс cursor-pointer
            >
              <div className="text-purple-700 transition duration-300 font-semibold text-lg text-center">
                {theme.title}
              </div>
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(theme.id);
                  }}
                  className="mt-2 text-red-600 hover:text-red-500 transition duration-300"
                >
                  Удалить
                </button>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemesList;
