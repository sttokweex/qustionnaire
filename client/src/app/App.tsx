import { FC, useContext, useEffect } from 'react';
import AuthPage from '../pages/authPage';

import { useLogoutMutation, useRefreshTokenMutation } from '../shared/http';
import { Context } from './main';
import { observer } from 'mobx-react-lite';
const App: FC = () => {
  const mutation = useLogoutMutation();
  const mutationRefresh = useRefreshTokenMutation();
  const { store } = useContext(Context);
  const handleLogout = () => {
    store.logout(mutation);
  };
  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth(mutationRefresh);
    }
  }, []);
  if (!store.isAuth) {
    return (
      <div>
        <AuthPage />
      </div>
    );
  }
  return (
    <div>
      <h1>
        {store.isAuth
          ? `Пользователь ${store.user.username} авторизован`
          : 'АВТОРИЗУЙТЕСЬ'}
        <button onClick={handleLogout}>выход</button>
      </h1>
    </div>
  );
};

export default observer(App);
