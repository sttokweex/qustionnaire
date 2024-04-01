import { FC, useContext, useEffect } from 'react';
import AuthPage from '../pages/authPage';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useRefreshTokenMutation } from '../shared/http';
import { Context } from './main';
import { observer } from 'mobx-react-lite';
import MainPage from '../pages/mainPage';

import EmployeesList from '../features/employeesList/employeesList';
import EmployeeCard from '../features/employeeCard/emploeyyCard';
const App: FC = () => {
  const mutationRefresh = useRefreshTokenMutation();
  const { store } = useContext(Context);

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
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            store.isAuth ? <Navigate to="/profile" /> : <Navigate to="/login" />
          }
        />
        <Route path="/profile" Component={MainPage} />
        <Route path="/employees" Component={EmployeesList} />
        <Route path="/employee/:id" Component={EmployeeCard} />
      </Routes>
    </Router>
  );
};

export default observer(App);
