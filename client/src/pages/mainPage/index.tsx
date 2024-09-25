import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogoutMutation, useSurveyThemes } from '@/shared/http';
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

      <h2>Survey Themes</h2>
      {isLoading && <div>Loading themes...</div>}
      {error && <div>Error loading themes: {error.message}</div>}
      {themes && themes.length > 0 ? (
        <ul>
          {themes.map((theme) => (
            <li key={theme.id}>
              <Link to={`/theme/${theme.title}`}>{theme.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>No themes found.</div>
      )}
    </div>
  );
};

MainPage.displayName = 'MainPage';

export default React.memo(MainPage);
