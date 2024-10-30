import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Header from '@/features/header/header';
import { useSurveyThemes } from '@/shared/http';
import AddThemeForm from './components/addThemeForm/addThemeForm';
import ThemesList from './components/themeList/themesList';
import { MainPageProps } from './interfaces';
import 'react-toastify/dist/ReactToastify.css'; // Import styles

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

  useEffect(() => {
    if (error) {
      toast.error(`Error loading themes: ${error.message}`);
    }
  }, [error]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <Header username={userData.username} onRefetch={refetch} />
      <main className="flex-1 p-6 overflow-y-auto flex flex-col">
        {userData.role === 'admin' && (
          <AddThemeForm
            onThemeAdded={() => {
              refetchThemes();
              toast.success('Theme added successfully!');
            }}
          />
        )}
        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4 text-center">
          Survey Themes
        </h2>
        {isLoading && <div className="text-gray-600">Loading themes...</div>}
        {themes && themes.length > 0 ? (
          <ThemesList themes={themes} onDelete={undefined} />
        ) : (
          <div className="text-gray-600 mt-4">No available themes.</div>
        )}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
      />
    </div>
  );
};

MainPage.displayName = 'MainPage';

export default React.memo(MainPage);
