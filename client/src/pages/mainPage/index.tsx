import React, { useEffect } from 'react';
import { useLogoutMutation, useSurveyThemes } from '@/shared/http';
import AddThemeForm from './components/addThemeForm';
import ThemesList from './components/themesList';
import { MainPageProps } from './interfaces';

const MainPage: React.FC<MainPageProps> = ({ userData, refetch }) => {
  const mutationLogout = useLogoutMutation(refetch);
  const {
    data: themes,
    isLoading,
    error,
    refetch: refetchThemes,
  } = useSurveyThemes();

  const handleLogout = () => {
    mutationLogout.mutate();
  };

  useEffect(() => {
    refetchThemes();
  }, []);

  return (
    <div>
      <h1>User Information</h1>
      <p>Name: {userData.username}</p>
      <p>ID: {userData.id}</p>
      <p>Role: {userData.role}</p>
      <button onClick={handleLogout}>Logout</button>

      {userData.role === 'admin' && (
        <AddThemeForm onThemeAdded={refetchThemes} />
      )}

      <h2>Survey Themes</h2>
      {isLoading && <div>Loading themes...</div>}
      {error && <div>Error loading themes: {error.message}</div>}
      {themes && themes.length > 0 ? (
        <ThemesList themes={themes} />
      ) : (
        <div>No themes found.</div>
      )}
    </div>
  );
};

MainPage.displayName = 'MainPage';

export default React.memo(MainPage);
