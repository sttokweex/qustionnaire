import { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RouteProvider from '@/app/routing/RouteProvider'; // Импортируйте RouteProvider
import { ToastContainer } from 'react-toastify';

const App: FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteProvider />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </Router>
  );
};

export default App;
