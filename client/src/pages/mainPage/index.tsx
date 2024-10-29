import React, { useEffect } from 'react';
import { useLogoutMutation, useSurveyThemes } from '@/shared/http';
import AddThemeForm from './components/addThemeForm/addThemeForm';
import ThemesList from './components/themeList/themesList';
import { MainPageProps } from './interfaces';
import './styles.css';

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
    <div className="container">
      <h1 className="heading">User Information</h1>
      <p className="info">
        <strong>Name:</strong> {userData.username}
      </p>
      <p className="info">
        <strong>ID:</strong> {userData.id}
      </p>
      <p className="info">
        <strong>Role:</strong> {userData.role}
      </p>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      {userData.role === 'admin' && (
        <AddThemeForm onThemeAdded={refetchThemes} />
      )}

      <h2 className="theme-heading">Survey Themes</h2>
      {isLoading && <div className="loading">Loading themes...</div>}
      {error && (
        <div className="error">Error loading themes: {error.message}</div>
      )}
      {themes && themes.length > 0 ? (
        <ThemesList themes={themes} />
      ) : (
        <div className="no-themes">No themes found.</div>
      )}
    </div>
  );
};

MainPage.displayName = 'MainPage';

export default React.memo(MainPage);
