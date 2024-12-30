import { FC } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { MainPage } from '@/pages/main-page';
import { QuestionPage } from '@/pages/question-page';
import { SurveyThemePage } from '@/pages/survey-theme-page';
import PrivateRoute from '@/app/routing/protectedRoute';
import useAuth from '@/features/auth/useAuth';
import { AuthPage } from '@/pages/auth-page';

const RouteProvider: FC = () => {
  const { userData, refetch, isAuthLoading, isLoading } = useAuth();

  if (isAuthLoading || isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Routes>
      <Route
        path="/home"
        element={
          <PrivateRoute isAuthenticated={!!userData}>
            <MainPage userData={userData!} refetch={refetch} />
          </PrivateRoute>
        }
      />
      <Route
        path="/theme/:title"
        element={
          <PrivateRoute isAuthenticated={!!userData}>
            <SurveyThemePage userData={userData!} refetch={refetch} />
          </PrivateRoute>
        }
      />
      <Route
        path="/theme/:title/:surveyTitle"
        element={
          <PrivateRoute isAuthenticated={!!userData}>
            <QuestionPage userData={userData!} refetch={refetch} />
          </PrivateRoute>
        }
      />
      <Route
        path="/auth"
        element={userData ? <Navigate to="/home" replace /> : <AuthPage />}
      />
      <Route
        path="*"
        element={userData ? <Navigate to="/home" replace /> : <AuthPage />}
      />
    </Routes>
  );
};

export default RouteProvider;
