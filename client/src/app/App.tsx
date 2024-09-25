import { FC, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import AuthPage from '@/pages/authPage';
import MainPage from '@/pages/mainPage';
import { UserData } from '@/pages/mainPage/interfaces';
import QuestionarePage from '@/pages/questionatePage';
import { refreshToken, useLogoutMutation } from '@/shared/http';

const App: FC = () => {
  const queryClient = useQueryClient();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery<UserData | undefined>('user', () => {
    return queryClient.getQueryData<UserData>('user');
  });

  const mutationLogout = useLogoutMutation(refetch);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshToken()
        .then((response) => {
          queryClient.setQueryData('user', response.user);
        })
        .catch((err) => {
          console.error('Token refresh failed:', err);
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

  if (error) {
    return <div>Error loading user data</div>;
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
          element={userData ? <QuestionarePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={userData ? <Navigate to="/home" /> : <AuthPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
