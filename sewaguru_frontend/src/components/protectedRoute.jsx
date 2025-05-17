import { Navigate, Outlet } from 'react-router-dom';
import { getUser } from '../utils/auth';

const ProtectedRoute = ({ requiredRole, redirectPath = '/login' }) => {
  const user = getUser();
  if (!user || user.role !== requiredRole) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;