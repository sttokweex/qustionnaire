import { FC, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import AuthPage from '@/pages/authPage';
import { useLogoutMutation, useRefreshTokenMutation } from '@/shared/http';

const App: FC = () => {
  const queryClient = useQueryClient();
  const mutation = useLogoutMutation();
  const mutationRefresh = useRefreshTokenMutation();

  const handleLogout = () => {
    mutation.mutate();
  };

  useEffect(() => {
    const tokenData = localStorage.getItem('token');
    if (tokenData) {
      mutationRefresh.mutate();
      queryClient.setQueryData('user', localStorage.getItem('user'));
      queryClient.setQueryData('token', tokenData);
    }
  }, []);

  const { data: userData } = useQuery('user', () => {
    return queryClient.getQueryData('user');
  });

  if (!userData) {
    return (
      <div>
        <AuthPage />
      </div>
    );
  }

  return (
    <div>
      <h1>
        {userData ? `Пользователь ${userData} авторизован ` : 'АВТОРИЗУЙТЕСЬ'}
        <button onClick={handleLogout}>выход</button>
      </h1>
    </div>
  );
};

export default App;
