import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children, inverse = false }: { children: ReactNode, inverse?: boolean }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('access_token') && !!localStorage.getItem('refresh_token'); // Проверка аутентификации

  if (inverse) {
    // Для страниц, которые должны быть доступны только неаутентифицированным пользователям (например, login, register)
    return isAuthenticated ? <Navigate to="/" state={{ from: location }} replace /> : <>{children}</>;
  }

  // Для обычных защищённых маршрутов (например, профиля, заявок)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" state={{ from: location }} replace />;
};
