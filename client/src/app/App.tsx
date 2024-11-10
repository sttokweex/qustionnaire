import { FC, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import AuthPage from '@/pages/authPage';
import MainPage from '@/pages/mainPage';
import { UserData } from '@/pages/mainPage/interfaces';
import QuestionPage from '@/pages/questionPage';
import SurveyThemePage from '@/pages/surveyThemePage';
import { refreshToken, useLogoutMutation } from '@/shared/http';

const App: FC = () => {
  const queryClient = useQueryClient();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery<UserData | undefined>({
    queryKey: ['user'],
    queryFn: () => {
      return queryClient.getQueryData<UserData>(['user']);
    },
    staleTime: Infinity,
  });

  const mutationLogout = useLogoutMutation(refetch);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      refreshToken()
        .then((response) => {
          if (response.user) {
            queryClient.setQueryData(['user'], response.user);
          } else {
          }
        })
        .catch(() => {
          mutationLogout.mutate();
        })
        .finally(() => {
          setIsAuthLoading(false);
        });
    } else {
      setIsAuthLoading(false);
    }
  }, [queryClient]);

  if (isAuthLoading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={
            userData ? (
              <MainPage userData={userData} refetch={refetch} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/theme/:title"
          element={
            userData ? (
              <SurveyThemePage userData={userData} refetch={refetch} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/theme/:title/:surveyTitle"
          element={
            userData ? (
              <QuestionPage userData={userData} refetch={refetch} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/auth"
          element={userData ? <Navigate to="/home" /> : <AuthPage />}
        />
        <Route
          path="*"
          element={userData ? <Navigate to="/home" /> : <AuthPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
