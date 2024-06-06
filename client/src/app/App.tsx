import { observer } from 'mobx-react-lite';
import { FC, useContext, useEffect } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from 'react-router-dom';
import AuthPage from 'pages/authPage';
import MainPage from 'pages/mainPage';
import EditPersonalData from 'features/editPersonalData/editPersonalData';
import EmployeeCard from 'features/employeeCard/employeeCard';
import EmployeesList from 'features/employeesList/employeesList';
import { useRefreshTokenMutation } from 'shared/http';
import { Context } from './main';

const App: FC = () => {
  const mutationRefresh = useRefreshTokenMutation();
  const { store } = useContext(Context);

  useEffect(() => {
    store.checkAuth(mutationRefresh);
  }, []);

  if (store.isLoading) {
    return <div>Загрузка...</div>;
  }
  return (
    <Router>
      <Routes>
        <Route
          path="/profile"
          element={store.isAuth ? <MainPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/employees"
          element={store.isAuth ? <EmployeesList /> : <Navigate to="/login" />}
        />
        <Route
          path="/employee/:id"
          element={store.isAuth ? <EmployeeCard /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={store.isAuth ? <Navigate to="/profile" /> : <AuthPage />}
        />
        <Route
          path="/employee/update"
          element={
            store.isAuth ? <EditPersonalData /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
};

export default observer(App);
