import React, { useEffect } from 'react';
import Header from '@/features/header/header';
import { useSurveyThemes } from '@/shared/http';
import AddThemeForm from './components/addThemeForm/addThemeForm';
import ThemesList from './components/themeList/themesList';
import { MainPageProps } from './interfaces';

const MainPage: React.FC<MainPageProps> = ({ userData, refetch }) => {
  const {
    data: themes,
    isLoading,
    error,
    refetch: refetchThemes,
  } = useSurveyThemes();

  useEffect(() => {
    refetchThemes();
  }, [refetchThemes]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <Header username={userData.username} onRefetch={refetch} />
      <main className="flex-1 p-6 overflow-y-auto flex flex-col">
        {' '}
        {/* Убедитесь, что используется flex-1 */}
        {userData.role === 'admin' && (
          <AddThemeForm onThemeAdded={refetchThemes} />
        )}
        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 text-center">
          Темы опросов
        </h2>
        {isLoading && <div className="text-gray-600">Загрузка тем...</div>}
        {error && (
          <div className="text-red-600 mt-2">
            Ошибка загрузки тем: {error.message}
          </div>
        )}
        {themes && themes.length > 0 ? (
          <ThemesList themes={themes} onDelete={undefined} />
        ) : (
          <div className="text-gray-600 mt-4">Нет доступных тем.</div>
        )}
      </main>
    </div>
  );
};

MainPage.displayName = 'MainPage';

export default React.memo(MainPage);
