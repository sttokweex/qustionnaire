import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  useAddSurveyThemeMutation,
  useLogoutMutation,
  useSurveyThemes,
} from '@/shared/http';
import { MainPageProps } from './interfaces';

const MainPage: React.FC<MainPageProps> = ({ userData, refetch }) => {
  const mutationLogout = useLogoutMutation(refetch);
  const addThemeMutation = useAddSurveyThemeMutation();
  const {
    data: themes,
    isLoading,
    error,
    refetch: refetchThemes,
  } = useSurveyThemes();

  const { register, handleSubmit } = useForm();

  const handleLogout = () => {
    mutationLogout.mutate();
  };

  const onSubmit = async (data: any) => {
    await addThemeMutation.mutateAsync(data);
    refetchThemes();
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
        <div>
          <h2>Add New Theme</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('title')} placeholder="Theme Title" required />
            <button type="submit">Add Theme</button>
          </form>
        </div>
      )}

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
