import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuthenticated,
  children,
}) => {
  return isAuthenticated ? children : <Navigate to="/auth" />;
};
export default PrivateRoute;
