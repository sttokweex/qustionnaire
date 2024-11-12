import { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RouteProvider from '@/routing/RouteProvider'; // Импортируйте RouteProvider

const App: FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteProvider />
    </Router>
  );
};

export default App;
